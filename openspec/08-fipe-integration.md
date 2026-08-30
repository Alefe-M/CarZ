# CarZ - OpenSpec: 08. Especificação da Integração FipeAPI / Parallelum

## 1. Visão Geral
A **FipeAPI (Parallelum API)** é uma API RESTful pública, de alta performance e gratuita que expõe os dados oficiais da Tabela FIPE (Fundação Instituto de Pesquisas Econômicas) para carros, motos e caminhões no Brasil.

* **Base URL Oficial:** `https://parallelum.com.br/fipe/api/v1`
* **Protocolo:** HTTPS / JSON
* **Autenticação:** Não requer chave de API (Livre)
* **Finalidade no CarZ:**
  1. Autopreenchimento de Marcas, Modelos e Versões no cadastro de veículos.
  2. Obtenção do **Preço Médio de Mercado (FIPE)** no momento da compra para cálculo de oportunidade/deságio.
  3. Acompanhamento de desvalorização/valorização do estoque em pátio.

---

## 2. Endpoints da Parallelum API

### 2.1. Listar Marcas de Veículos
```http
GET https://parallelum.com.br/fipe/api/v1/carros/marcas
```
**Resposta (Exemplo):**
```json
[
  { "codigo": "21", "nome": "Fiat" },
  { "codigo": "23", "nome": "Ford" },
  { "codigo": "59", "nome": "VW - VolksWagen" },
  { "codigo": "56", "nome": "Toyota" }
]
```

---

### 2.2. Listar Modelos de uma Marca
```http
GET https://parallelum.com.br/fipe/api/v1/carros/marcas/{marcaCodigo}/modelos
```
* Exemplo: `https://parallelum.com.br/fipe/api/v1/carros/marcas/56/modelos` (Toyota)

**Resposta (Exemplo):**
```json
{
  "modelos": [
    { "codigo": 4920, "nome": "Corolla Altis 2.0 16V Flex Aut." },
    { "codigo": 4921, "nome": "Corolla XEi 2.0 Flex 16V Aut." },
    { "codigo": 4922, "nome": "Corolla GLi 2.0 Flex 16V Aut." }
  ],
  "anos": [
    { "codigo": "2024-1", "nome": "2024 Gasolina" },
    { "codigo": "2023-1", "nome": "2023 Gasolina" },
    { "codigo": "2022-1", "nome": "2022 Gasolina" }
  ]
}
```

---

### 2.3. Listar Anos Disponíveis de um Modelo
```http
GET https://parallelum.com.br/fipe/api/v1/carros/marcas/{marcaCodigo}/modelos/{modeloCodigo}/anos
```
* Exemplo: `https://parallelum.com.br/fipe/api/v1/carros/marcas/56/modelos/4921/anos`

**Resposta (Exemplo):**
```json
[
  { "codigo": "2023-1", "nome": "2023 Gasolina" },
  { "codigo": "2022-1", "nome": "2022 Gasolina" },
  { "codigo": "2021-1", "nome": "2021 Gasolina" }
]
```

---

### 2.4. Consultar Preço e Ficha FIPE do Veículo
```http
GET https://parallelum.com.br/fipe/api/v1/carros/marcas/{marcaCodigo}/modelos/{modeloCodigo}/anos/{anoCodigo}
```
* Exemplo: `https://parallelum.com.br/fipe/api/v1/carros/marcas/56/modelos/4921/anos/2022-1`

**Resposta (Exemplo Oficial):**
```json
{
  "TipoVeiculo": 1,
  "Valor": "R$ 115.820,00",
  "Marca": "Toyota",
  "Modelo": "Corolla XEi 2.0 Flex 16V Aut.",
  "AnoModelo": 2022,
  "Combustivel": "Gasolina",
  "CodigoFipe": "002167-9",
  "MesReferencia": "agosto de 2026",
  "SiglaCombustivel": "G",
  "DataConsulta": "domingo, 30 de agosto de 2026 13:00"
}
```

---

## 3. Arquitetura de Integração no Next.js (Proxy & Caching)

Para garantir velocidade instantânea na interface e não depender de requisições externas a cada clique do usuário, o Next.js atuará como **Gateway / Proxy com Cache**:

```
[Browser / Frontend CarZ]
         │ (Autocomplete rápido)
         ▼
[Next.js Server: /api/v1/fipe/...]
         │
         ├── 1. Verifica Cache em Memória / Next.js Data Cache (revalidate: 86400 / 24 horas)
         │      └─ Se em cache: Retorna instantaneamente (< 5ms)
         │
         └── 2. Se expirado: Consulta Parallelum API externa
                └─ Transforma "R$ 115.820,00" -> 115820.00 (Decimal)
```

### 3.1. Parsing e Sanitização de Valores Monetários
A API FIPE retorna o valor formatado como string (`"R$ 115.820,00"`). O serviço de integração fará a conversão segura para `Decimal`:

```typescript
export function parseFipePriceToNumber(fipePriceString: string): number {
  const sanitized = fipePriceString
    .replace("R$", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return parseFloat(sanitized); // 115820.00
}
```

---

## 4. Indicador Financeiro: Deságio / Margem de Compra FIPE

Ao cadastrar um veículo com preço de aquisição $V_{\text{aquisicao}}$ e valor de referência FIPE $V_{\text{fipe}}$:

$$\text{Deságio na Compra (\%)} = \left( \frac{V_{\text{fipe}} - V_{\text{aquisicao}}}{V_{\text{fipe}}} \right) \times 100$$

* **Exemplo:** FIPE = R\$ 100.000,00 / Compra = R\$ 82.000,00 $\rightarrow$ **18% abaixo da FIPE** (Excelente margem de segurança para absorver preparação e lucrar na revenda).

