# CarZ - OpenSpec: 07. Processo Frontend, Arquitetura de UI & Design System

## 1. Visão Geral do Frontend

O **CarZ** é uma aplicação web voltada para a gestão ágil de garagens e revendas de seminovos. O frontend foi concebido sob a filosofia de alta densidade de informação (estilo *Linear*, *Vercel* e *shadcn/ui*), combinando navegação veloz, visual escuro premium e clareza analítica em tempo real.

O núcleo da experiência do usuário está estruturado ao redor das **3 Etapas do Ciclo de Vida do Veículo**:
1. 🟡 **`PREPARACAO` (Preparação):** Pátio de oficina e revisão, com foco no lançamento discriminado de **Peças** e **Mão de Obra/Serviços** e consolidação do Dossiê Financeiro.
2. 🟢 **`A_VENDA` (À Venda):** Estoque comercial disponível, destacando margem de lucro projetada, deságio FIPE e simulação de propostas.
3. 🟣 **`VENDIDO` (Vendido):** Histórico de negócios concluídos, cálculo final de Lucro Bruto e Líquido e entrada de veículos originados de **Trade-in (Troca)**.

---

## 2. Arquitetura de Diretórios e Rotas (Next.js App Router)

```
src/
├── app/
│   ├── layout.tsx                     # Root Layout (Dark theme, Inter font, Toasters)
│   ├── page.tsx                       # Redirecionamento para a Garagem Ativa
│   ├── (dashboard)/[garageSlug]/      # Contexto da Garagem Ativa
│   │   ├── layout.tsx                 # App Shell (Sidebar, Header, Tenant Context, Mobile Nav)
│   │   ├── page.tsx                   # Dashboard Executivo (KPIs, Pipeline Kanban, Breakdown de Gastos)
│   │   ├── veiculos/
│   │   │   ├── page.tsx               # Estoque Geral & Filtro das 3 Etapas (Preparação, À Venda, Vendido)
│   │   │   ├── [id]/page.tsx          # Dossiê de Custos do Veículo (Detalhamento Peça x Mão de Obra)
│   │   │   └── novo/page.tsx          # Entrada de Veículo com Auto-lookup FIPE e Deságio
│   │   ├── despesas/page.tsx          # Gestão de Despesas Gerais e Fixas da Garagem
│   │   ├── vendas/page.tsx            # Histórico de Vendas e Negociações com Trade-in
│   │   └── relatorios/page.tsx        # DRE Mensal e Gráficos de Rentabilidade
│   └── api/v1/                        # Rotas REST e Proxies
├── components/
│   ├── ui/                            # Primitivas de UI (Button, Card, Badge, Modal, Input, Tabs)
│   ├── layout/                        # Sidebar, Header, MobileNav, GarageSwitcher
│   ├── vehicles/                      # VehicleCard, PipelineKanban, CostDossier, FipeSelector
│   └── modals/                        # AddExpenseModal, SellVehicleModal
├── context/
│   └── GarageContext.tsx              # Provedor de Estado Multi-tenant (Garagem, Veículos, Métricas)
└── lib/
    ├── calculations.ts                # Fórmulas de Custos, Lucratividade e Deságio FIPE
    ├── tenant.ts                      # Validação de Acesso e Papéis
    └── utils.ts                       # Helpers de Formatação Monetária (BRL), Datas e Placas
```

---

## 3. Design Tokens & Cores Semânticas

* **Superfícies & Bordas:**
  * Background Principal: `#09090b` (Zinc-950)
  * Background de Cards: `#18181b` (Zinc-900 com transparência e borda `zinc-800/80`)
  * Bordas e Divisores: `#27272a` (Zinc-800)
* **Status das 3 Etapas:**
  * 🟡 **Preparação (`PREPARACAO`):** Âmbar / Dourado (`#F59E0B`)
    * Badge: `bg-amber-500/10 text-amber-400 border-amber-500/30`
  * 🟢 **À Venda (`A_VENDA`):** Verde Esmeralda (`#10B981`)
    * Badge: `bg-emerald-500/10 text-emerald-400 border-emerald-500/30`
  * 🟣 **Vendido (`VENDIDO`):** Roxo Violeta (`#8B5CF6`)
    * Badge: `bg-purple-500/10 text-purple-400 border-purple-500/30`
* **Desdobramento de Custos de Oficina:**
  * 🔵 **Peças:** Azul / Ciano (`#06B6D4` ou `#3B82F6`)
  * 🟣 **Mão de Obra / Serviços:** Violeta (`#A855F7`)
  * ⚪ **Taxas / Vistoria:** Slate / Cinza (`#94A3B8`)

---

## 4. Fluxos e Telas Centrais

### 4.1. Dashboard Executivo
* **4 KPIs Principais:**
  1. **Estoque Ativo:** Quantidade total de veículos em pátio e capital total imobilizado.
  2. **Em Preparação:** Contagem de veículos com breakdown explícito de valores aplicados em peças versus serviços de mão de obra.
  3. **Lucro Bruto do Mês:** Faturamento líquido menos custo acumulado dos veículos vendidos no período, com margem percentual.
  4. **Giro Médio de Estoque:** Tempo médio (em dias) entre aquisição e venda.
* **Pipeline Kanban das 3 Etapas:**
  * Visualização em colunas das 3 fases do veículo com contadores numéricos.
  * Alternador para modo Tabela condensada.
* **Barra de Ações Rápidas:**
  * Entrada Imediata com FIPE (`+ Nova Entrada`)
  * Lançamento de Gastos Diretos (`+ Lançar Manutenção / Gasto`)
  * Conclusão de Venda com Trade-in (`+ Concluir Venda`)

### 4.2. Dossiê Financeiro do Veículo (`/veiculos/[id]`)
* O veículo concentra todos os seus gastos diretamente na sua ficha, eliminando almoxarifados intermediários.
* **Fórmula do Dossiê:**
  $$\text{Custo Total} = \text{Preço de Aquisição} + \sum \text{Peças} + \sum \text{Mão de Obra} + \sum \text{Taxas/Outros}$$
* **Feed Cronológico de Manutenções:**
  * Cada item apresenta a descrição, categoria (mecânica, funilaria, estética, laudo), valor alocado para peças, valor pago de serviço e total do lançamento.
* **Ações de Máquina de Estado:**
  * Botão direto para avançar status: de `PREPARACAO` para `A_VENDA`, e de `A_VENDA` para `VENDIDO`.

### 4.3. Entrada de Veículo com FIPE Integrada (`/veiculos/novo`)
* Interface orientada a dados:
  1. O usuário seleciona a Marca $\rightarrow$ os modelos são carregados via proxy FIPE.
  2. O usuário seleciona o Modelo $\rightarrow$ os anos de fabricação/combustível são carregados.
  3. O sistema preenche automaticamente o Código FIPE e o Valor de Mercado atual.
  4. Ao digitar o **Preço de Aquisição (Compra)**, o sistema calcula em tempo real o **Deságio FIPE**:
     $$\text{Deságio (\%)} = \left(\frac{\text{Valor FIPE} - \text{Preço Aquisição}}{\text{Valor FIPE}}\right) \times 100$$
  5. Um indicador visual colorido sinaliza se a compra está vantajosa (ex: verde para deságio $> 15\%$).

### 4.4. Venda de Veículo com Trade-in (Carro na Troca)
* Na finalização da venda de um veículo em `A_VENDA`:
  1. O operador informa o valor acordado e forma de pagamento.
  2. Ativando o switch **"Receber Veículo na Troca (Trade-in)"**, abrem-se os campos do carro de entrada (Marca, Modelo, Ano, Placa e Valor de Entrada).
  3. O sistema:
     - Marca o veículo atual como `VENDIDO` e congela o lucro auferido.
     - Insere imediatamente o veículo da troca no pátio com status `PREPARACAO` e Preço de Aquisição igual ao valor acordado na troca.

---

## 5. Responsividade & PWA Mobile

* Em telas menores que 768px:
  * A sidebar fixa é recolhida e substituída por uma **Barra de Navegação Inferior Flutuante** (Home, Veículos, Despesas, Relatórios).
  * Um botão central **FAB (+)** flutuante oferece acesso de um toque às ações de cadastro de veículo, lançamento de peças/serviços e venda.
  * Os cards das 3 etapas adotam navegação em abas segmentadas (`[ Preparação | À Venda | Vendidos ]`).
