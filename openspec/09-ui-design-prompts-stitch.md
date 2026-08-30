# CarZ - OpenSpec: 09. Guia de Prompts de UI/UX para o Stitch (Web & Mobile)

Este documento contém os prompts prontos e estruturados para gerar o design de interface do **CarZ** no **Stitch** (versões Web Desktop e Mobile).

---

## 🎨 Design System & Diretrizes Visuais

* **Estilo:** SaaS B2B automotivo moderno, limpo, alta densidade de informação com visual profissional estilo Linear / Vercel / shadcn/ui.
* **Paleta de Cores:**
  * **Fundo/Background:** Dark Mode (`#09090B` / `#18181B`) com suporte a Light Mode clean (`#FAFAFA` / `#FFFFFF`).
  * **Cores Primárias/Ação:** Azul Indigo / Cobalto (`#6366F1` ou `#2563EB`) para botões de ação e links.
  * **Status das 3 Etapas:**
    * 🟡 **Preparação:** Âmbar / Laranja Suave (`#F59E0B` com badge translúcido).
    * 🟢 **À Venda:** Verde Esmeralda (`#10B981` com badge de destaque).
    * 🟣 **Vendido:** Roxo / Slate Metálico (`#8B5CF6` ou `#64748B`).
  * **Indicadores Financeiros:** Verde (`#22C55E`) para lucros e margens positivas, Vermelho (`#EF4444`) para despesas e alertas de estoque.
* **Tipografia:** Inter / Plus Jakarta Sans com pesos bem definidos (Semibold para KPIs e numerais tabulares para moedas).

---

## 🖥️ 1. PROMPT MASTER - VERSÃO WEB (Desktop 1440px)

```text
Design a modern, high-end Web Dashboard UI for "CarZ", a multi-tenant automotive garage and vehicle resale management platform (Desktop 1440x900px, Dark theme with subtle zinc borders, styled like shadcn/ui and Tailwind CSS).

LAYOUT & NAVIGATION:
- Sidebar Navigation: Collapsible dark sidebar with logo "CarZ", Tenant Switcher dropdown showing active garage "Alpha Motors (Owner)" with an "All Garages" quick switch, and menu items: Dashboard (active), Veículos (3-stage badge), Estoque de Peças, Despesas Gerais, Vendas, Relatórios DRE, Configurações de Equipe.
- Header: Global search bar (Search by Plate, VIN, Customer), FIPE Quick Lookup shortcut, Notifications bell, and User Avatar with role badge ("Admin").

MAIN CONTENT (Dashboard Overview):
1. Top KPI Summary Cards (4 columns):
   - "Estoque Ativo": 24 veículos (R$ 1.850.000 valor de custo) with mini trend badge.
   - "Em Preparação": 6 veículos em oficina/revisão (R$ 38.400 em despesas alocadas).
   - "Lucro Bruto do Mês": R$ 142.500,00 (+14.2% vs mês anterior, margem média 18.5%).
   - "Giro Médio de Estoque": 28 dias (indicador de lead time).

2. Central Grid - 3-Stage Vehicle Pipeline (Kanban & Table Toggle):
   - Stage 1 [PREPARAÇÃO - 6]: Cards showing thumbnail, "Toyota Corolla 2022", Plate "BRA2E19", accumulated cost "R$ 98.450" (Purchase R$ 95k + R$ 3.450 in parts/paint), progress bar "3/4 serviços concluídos".
   - Stage 2 [À VENDA - 15]: Cards showing "Honda Civic 2021", Price Tag "R$ 125.000", FIPE comparison badge "4.2% abaixo da FIPE", Target Profit "R$ 18.200". Quick action: "Simular Proposta".
   - Stage 3 [VENDIDO - 3 no mês]: Cards showing "Jeep Compass 2023", Final Price "R$ 145.000", Net Profit "R$ 22.800", Badge "Vendido com Trade-in".

3. Financial & Operational Analytics:
   - DRE Preview chart (Monthly Revenue vs Cost of Goods Sold vs Fixed Expenses).
   - Low Stock Alert Widget (Almoxarifado): "Pastilha de Freio Corolla (1 un restante - Repor)".
   - Quick Action Floating / Top Bar: "+ Nova Entrada de Veículo (FIPE Auto-lookup)", "+ Lançar Despesa", "+ Venda Rápida".
```

---

## 📱 2. PROMPT MASTER - VERSÃO MOBILE (Mobile 390px / PWA)

```text
Design an ultra-responsive, modern Mobile App UI for "CarZ", a vehicle garage and inventory management app (Mobile 390x844px, Dark theme, thumb-friendly touch targets, iOS/Android style).

TOP APP BAR:
- Garage Switcher pill selector at top: "🚗 Alpha Motors ▾" (tap to switch garage).
- Quick Action: Camera icon for scanning vehicle VIN/Plate barcodes, User profile avatar.

HERO KPIS (Horizontal Carousel):
- Card 1: "Lucro do Mês: R$ 142.500" (Margem 18.5%).
- Card 2: "Veículos em Pátio: 24 (6 em Preparação)".
- Card 3: "Peças em Alerta: 3 itens abaixo do mínimo".

3-STAGE VEHICLE TAB FILTER (Segmented Control):
- Tabs: [ Preparação (6) | À Venda (15) | Vendidos (3) ]
- Vehicle Card List:
  - Card 1 (In Preparation): High-res car photo thumbnail, "Toyota Corolla XEi 2022", Plate pill "BRA2E19", Current Total Cost "R$ 98.450", Status tag [Em Funilaria & Mecânica]. Tap to open Cost Dossier.
  - Card 2 (For Sale): "Jeep Compass Longitude 2023", Plate "RIO2A18", Asking Price "R$ 148.000", FIPE badge "-5% FIPE", Projected Profit "R$ 21.000". Buttons: "Ver Ficha" & "Registrar Venda".

FLOATING BOTTOM BAR & NAVIGATION:
- Bottom Navigation Bar with 4 items: Início, Pátio/Veículos, Peças/Estoque, Mais.
- Prominent Center FAB (+): Tap opens modal with 3 quick options: "Cadastrar Veículo por Placa/FIPE", "Aplicar Peça do Estoque em Veículo", "Lançar Despesa Rápida".
```

---

## 📄 3. PROMPTS DETALHADOS POR TELA ESPECÍFICA

### Tela A: Ficha Completa do Veículo & Dossiê de Custos (Web & Mobile)
```text
UI Design for "CarZ - Vehicle Financial Dossier & Cost Timeline Screen":
- Top Header: Vehicle banner with photos carousel, Title "Toyota Corolla XEi 2.0 Flex 2022", Plate badge "BRA2E19", Renavam, Chassi, and Status Pill [EM PREPARAÇÃO].
- Real-time Cost Accumulator Card (Highlight):
  - Preço de Compra: R$ 95.000,00
  - (+) Peças do Almoxarifado: R$ 1.850,00 (Pastilhas, Filtro de Óleo, Correia)
  - (+) Serviços Externos & Funilaria: R$ 1.600,00 (Pintura parachoque + Martelinho)
  - (+) Taxas & Laudo Cautelar: R$ 600,00
  - (=) CUSTO TOTAL ATUAL: R$ 99.050,00 (Highlighted in bold).
  - Tabela FIPE Referência: R$ 115.820,00 (Comprado com 17.5% de deságio).
  - Preço Sugerido de Venda: R$ 112.000,00 (Lucro Projetado: R$ 12.950,00).
- Interactive Cost Timeline: Chronological feed of every expense receipt and part applied with date, mechanic name, and receipt download.
- Action Buttons: "+ Adicionar Despesa", "+ Aplicar Peça do Estoque", "Avançar para [À VENDA]".
```

### Tela B: Wizard de Cadastro com Autocomplete da Tabela FIPE (Web Modal & Mobile Screen)
```text
UI Design for "CarZ - Fast Vehicle Entry Wizard with FIPE Auto-lookup":
- Stepper: [1. Identificação FIPE -> 2. Valores & Aquisição -> 3. Check-in & Fotos].
- Step 1 UI:
  - Input field for Placa "BRA2E19" with instant "Consultar FIPE" button.
  - Cascading Selectors: Marca dropdown ("Toyota"), Modelo dropdown ("Corolla XEi 2.0 Flex Aut."), Ano/Combustível dropdown ("2022 Gasolina").
  - Auto-populated Card: "Código FIPE: 002167-9 | Valor Médio de Mercado: R$ 115.820,00 (Mês Ref: Agosto/2026)".
- Step 2 UI:
  - Tipo de Entrada: [Compra Direta PF | Troca (Trade-in) | Leilão].
  - Valor Pago na Aquisição (R$): Input with automatic discount badge calculated vs FIPE.
  - KM no Check-in: Input (ex: 45.000 km).
  - Data de Entrada.
- Button: "Concluir Entrada e Iniciar Preparação".
```

### Tela C: Modal de Venda com Veículo na Troca (Trade-in Deal Desk)
```text
UI Design for "CarZ - Sale Checkout & Trade-in Settlement Modal":
- Header: "Concluir Venda: Toyota Corolla XEi 2022 (Custo: R$ 99.050,00)".
- Customer Selection: Search by Name/CPF or Quick Add.
- Preço Final Negociado (R$): R$ 112.000,00.
- Payment Breakdown (Split Payment Box):
  - [x] Entrada em Dinheiro / PIX: R$ 37.000,00
  - [x] Financiamento Bancário: R$ 45.000,00
  - [x] Veículo na Troca (Trade-in): Ativado!
    - Placa do Carro de Troca: "RIO2A18" (Chevrolet Onix 2019, 68.000 km)
    - Valor de Avaliação / Entrada: R$ 30.000,00
    - Notice Box: "Este veículo será automaticamente cadastrado no pátio em [PREPARAÇÃO] com custo inicial de R$ 30.000,00."
- Real-time Profit Preview Box:
  - Lucro Bruto: R$ 12.950,00 (11.5% margem).
  - (-) Comissão do Vendedor: R$ 1.500,00.
  - (=) Lucro Líquido Realizado: R$ 11.450,00.
- Primary Button: "Finalizar Venda & Emitir Saída".
```

