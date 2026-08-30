# CarZ - OpenSpec: 03. Motor de Cálculo e Regras Financeiras

## 1. Visão Geral
Este documento define as fórmulas matemáticas e regras contábeis/financeiras adotadas no **CarZ** para garantir a precisão no cálculo de custos por veículo, lucratividade unitária, margem de contribuição e apuração de resultados da garagem.

---

## 2. Fórmulas de Custos por Veículo

### 2.1. Custo Direto Acumulado ($C_{\text{direto}}$)
O custo direto de um veículo é composto pelo valor desembolsado na compra somado a todos os gastos pontuais alocados especificamente a ele durante o período em pátio/oficina:

$$C_{\text{direto}}(v) = V_{\text{aquisicao}} + \sum_{i=1}^{n} G_{\text{direto}}(i)$$

Onde:
* $V_{\text{aquisicao}}$: Valor pago na compra (ou valor de entrada no caso de veículo recebido em troca).
* $G_{\text{direto}}$: Cada despesa direta vinculada ao veículo $v$ (peças aplicadas do estoque, serviços mecânicos, funilaria, pintura, laudo cautelar, IPVA proporcional, despachante, higienização).

### 2.2. Custo Médio Unitário de Peças em Estoque ($C_{\text{medio}}$)
Ao dar entrada em uma nova compra de peças ($E_{\text{nova}}$) com quantidade $Q_{\text{nova}}$ e custo unitário $U_{\text{novo}}$, o custo médio da peça no estoque é recalculado ponderadamente:

$$C_{\text{medio}} = \frac{(Q_{\text{atual}} \times C_{\text{medio\_anterior}}) + (Q_{\text{nova}} \times U_{\text{novo}})}{Q_{\text{atual}} + Q_{\text{nova}}}$$

> **Aplicação:** Quando a peça for instalada no veículo, o valor debitado como gasto direto do veículo é exatamente $Q_{\text{aplicada}} \times C_{\text{medio}}$.

---

## 3. Rateio de Custos Fixos / Indiretos da Garagem (Opcional por Configuração)

A garagem possui despesas gerais (aluguel, marketing, energia, salários fixos). O sistema suporta dois modos de visão:

### Modo 1: Margem de Contribuição Direta (Padrão)
* O veículo carrega **apenas** seus custos diretos ($C_{\text{direto}}$).
* Os custos indiretos são abatidos globalmente no DRE mensal da garagem.

### Modo 2: Custo Total com Rateio por Dias de Pátio
Para entender quanto a permanência de um carro no pátio consome da estrutura da garagem:

$$\text{Custo Diário da Garagem} = \frac{\sum \text{Despesas Gerais do Mês}}{\text{Dias do Mês} \times \text{Média de Carros no Pátio}}$$

$$C_{\text{rateado}}(v) = C_{\text{direto}}(v) + (\text{Dias em Estoque}(v) \times \text{Custo Diário da Garagem})$$

---

## 4. Métricas de Venda e Lucratividade

Quando um veículo é vendido por um valor final $P_{\text{venda}}$:

### 4.1. Lucro Bruto ($L_{\text{bruto}}$)
$$L_{\text{bruto}} = P_{\text{venda}} - C_{\text{direto}}$$

### 4.2. Margem Bruta de Venda ($\% M_{\text{bruta}}$)
Percentual de cada Real vendido que sobra após pagar os custos diretos do carro:
$$M_{\text{bruta}} = \left( \frac{L_{\text{bruto}}}{P_{\text{venda}}} \right) \times 100$$

### 4.3. Markup Realizado ($\% \text{Markup}$)
Percentual adicionado sobre o custo total para atingir o preço de venda:
$$\text{Markup} = \left( \frac{P_{\text{venda}} - C_{\text{direto}}}{C_{\text{direto}}} \right) \times 100$$

### 4.4. Lucro Líquido Unitário ($L_{\text{liquido}}$)
$$L_{\text{liquido}} = L_{\text{bruto}} - \text{ComissãoVendedor} - \text{ImpostosNota} - \text{TaxasFinanceiras}$$

---

## 5. Regra Especial: Venda com Veículo na Troca (Trade-in)

Um dos fluxos mais críticos em revendas de veículos:

### Exemplo de Cenário:
* **Veículo Vendido (A):** Preço de Venda = R\$ 80.000,00 (Custo Acumulado = R\$ 68.000,00).
* **Veículo Entrado na Troca (B):** Avaliado e aceito por R\$ 35.000,00.
* **Cliente paga a diferença:** R\$ 45.000,00 (via PIX / Financiamento).

### Regras do Sistema:
1. A transação de venda do **Veículo A** é liquidada pelo valor total de **R\$ 80.000,00**:
   * Lucro Bruto do Veículo A = $80.000,00 - 68.000,00 = \text{R\$} 12.000,00$.
   * Status do Veículo A muda para `VENDIDO`.
2. O sistema gera automaticamente um novo registro para o **Veículo B**:
   * `acquisition_type` = `TROCA_TRADE_IN`
   * `acquisition_price` = `R$ 35.000,00`
   * `status` = `AQUISICAO` (ou `EM_PREPARACAO`)
   * `trade_in_from_sale_id` = ID da venda do Veículo A.

---

## 6. DRE Mensal Simplificada da Garagem (Demonstrativo de Resultado)

O módulo financeiro deve consolidar mensalmente os seguintes blocos:

```
(+) Receita Bruta com Vendas de Veículos (Total Faturado no mês)
(-) Custo das Mercadorias Vendidas (CMV) = Soma dos Custos Acumulados dos Carros Vendidos
(=) Lucro Bruto Consolidado
--------------------------------------------------------------------------------------
(-) Despesas com Vendas (Comissões de Vendedores + Anúncios/Portais Webmotors/iCarros)
(-) Despesas Operacionais / Administrativas (Aluguel, Luz, Água, Folha, Contabilidade)
(-) Impostos & Taxas Financeiras
--------------------------------------------------------------------------------------
(=) Resultado Líquido do Mês (Lucro / Prejuízo Operacional)
```
