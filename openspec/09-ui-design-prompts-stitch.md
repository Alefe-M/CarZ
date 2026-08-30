# CarZ - OpenSpec: 09. Guia de Prompts de UI/UX para o Stitch (Web & Mobile)

Este documento contém os prompts atualizados para gerar o design de interface do **CarZ** no **Stitch** (versões Web Desktop e Mobile), com foco no **detalhamento direto de Peças e Serviços/Mão de Obra por Veículo**.

---

## 🎨 Design System & Diretrizes Visuais

* **Estilo:** SaaS B2B automotivo moderno, limpo, alta densidade de informação estilo Linear / Vercel / shadcn/ui.
* **Paleta de Cores:**
  * **Dark Mode:** Fundo escuro `#09090B` / `#18181B` com cards em zinc suave.
  * **Status das 3 Etapas:**
    * 🟡 **Preparação:** Âmbar / Laranja Suave (`#F59E0B`).
    * 🟢 **À Venda:** Verde Esmeralda (`#10B981`).
    * 🟣 **Vendido:** Roxo / Slate Metálico (`#8B5CF6`).
  * **Destaques de Custos:** Azul/Ciano para Peças, Violeta para Mão de Obra, Esmeralda para Lucro.

---

## 🖥️ 1. PROMPT MASTER - VERSÃO WEB (Desktop 1440px)

```text
Design a modern, high-end Web Dashboard UI for "CarZ", a multi-tenant automotive garage and vehicle resale management platform (Desktop 1440x900px, Dark theme with subtle zinc borders, styled like shadcn/ui and Tailwind CSS).

LAYOUT & NAVIGATION:
- Sidebar Navigation: Collapsible dark sidebar with logo "CarZ", Tenant Switcher dropdown showing active garage "Alpha Motors (Owner)", and menu items: Dashboard (active), Veículos (3-stage badge: Preparação, À Venda, Vendido), Despesas Gerais, Vendas / Trade-in, Relatórios DRE, Configurações de Equipe.
- Header: Global search bar (Search by Plate, VIN, Customer), FIPE Quick Lookup shortcut, Notifications bell, and User Avatar ("Admin").

MAIN CONTENT (Dashboard Overview):
1. Top KPI Summary Cards (4 columns):
   - "Estoque Ativo": 24 veículos (R$ 1.850.000 valor investido).
   - "Em Preparação": 6 veículos (R$ 18.200 em peças trocadas + R$ 14.500 em mão de obra/serviços).
   - "Lucro Bruto do Mês": R$ 142.500,00 (+14.2% vs mês anterior, margem média 18.5%).
   - "Giro Médio de Estoque": 28 dias.

2. Central Grid - 3-Stage Vehicle Pipeline (Kanban & Table Toggle):
   - Stage 1 [PREPARAÇÃO - 6]: Cards showing thumbnail, "Toyota Corolla 2022", Plate "BRA2E19", accumulated cost "R$ 96.020" (Purchase R$ 95k + Peças R$ 220 + Serviços R$ 800), progress pill "2 manutenções registradas".
   - Stage 2 [À VENDA - 15]: Cards showing "Honda Civic 2021", Asking Price "R$ 125.000", FIPE badge "-4.2% FIPE", Target Profit "R$ 18.200". Quick action: "Simular Proposta".
   - Stage 3 [VENDIDO - 3 no mês]: Cards showing "Jeep Compass 2023", Final Price "R$ 145.000", Net Profit "R$ 22.800", Badge "Vendido com Trade-in".

3. Financial Analytics & Maintenance Breakdown:
   - DRE Preview chart (Monthly Revenue vs Cost of Goods Sold vs Fixed Expenses).
   - Maintenance Cost Split Widget: Donut chart showing "Gasto com Peças (42%) vs Gasto com Mão de Obra/Serviços (58%)".
   - Quick Action Top Bar: "+ Nova Entrada de Veículo (FIPE Auto-lookup)", "+ Lançar Manutenção / Gasto", "+ Concluir Venda".
```

---

## 📱 2. PROMPT MASTER - VERSÃO MOBILE (Mobile 390px / PWA)

```text
Design an ultra-responsive, modern Mobile App UI for "CarZ", a vehicle garage and inventory management app (Mobile 390x844px, Dark theme, thumb-friendly touch targets, iOS/Android style).

TOP APP BAR:
- Garage Switcher pill selector at top: "🚗 Alpha Motors ▾".
- Quick Action: Camera icon for scanning vehicle VIN/Plate, User profile avatar.

HERO KPIS (Horizontal Carousel):
- Card 1: "Lucro do Mês: R$ 142.500" (Margem 18.5%).
- Card 2: "Veículos em Pátio: 24 (6 em Preparação)".
- Card 3: "Total Investido em Manutenções: R$ 32.700 (Peças + Mão de Obra)".

3-STAGE VEHICLE TAB FILTER (Segmented Control):
- Tabs: [ Preparação (6) | À Venda (15) | Vendidos (3) ]
- Vehicle Card List:
  - Card 1 (In Preparation): Photo thumbnail, "Toyota Corolla XEi 2022", Plate pill "BRA2E19", Current Total Cost "R$ 96.020", Tag [Peças: R$ 220 | Serviços: R$ 800]. Tap to open Cost Dossier.
  - Card 2 (For Sale): "Jeep Compass Longitude 2023", Plate "RIO2A18", Asking Price "R$ 148.000", FIPE badge "-5% FIPE", Projected Profit "R$ 21.000".

FLOATING BOTTOM BAR:
- Bottom Navigation Bar with 4 items: Início, Veículos, Despesas, Mais.
- Prominent Center FAB (+): Tap opens modal: "Cadastrar Veículo (FIPE)", "Lançar Peça/Serviço no Carro", "Registrar Venda".
```

---

## 📄 3. TELA DETALHADA: Dossiê de Custos do Veículo (Web & Mobile)

```text
UI Design for "CarZ - Vehicle Financial Dossier with Parts & Labor Cost Breakdown":
- Header: Vehicle photo banner, "Toyota Corolla XEi 2.0 Flex 2022", Plate "BRA2E19", Status Pill [EM PREPARAÇÃO].
- Top Financial Summary (4 Metric Badges in a row):
  - Preço de Compra: R$ 95.000,00
  - (+) Total Peças: R$ 170,00 (Pastilhas + Filtros)
  - (+) Total Mão de Obra: R$ 500,00 (Serviço Mecânico + Funilaria)
  - (+) Taxas / Outros: R$ 350,00 (Laudo Cautelar)
  - (=) CUSTO TOTAL ACUMULADO: R$ 96.020,00 (Big bold highlight).
- Itemized Maintenance & Expenses Feed (Table / Cards):
  - Item 1: "Troca de pastilhas de freio dianteiras" | Peças: R$ 20,00 | Mão de Obra: R$ 50,00 | Total: R$ 70,00 | 28/Ago
  - Item 2: "Pintura parachoque dianteiro" | Peças: R$ 150,00 | Mão de Obra: R$ 450,00 | Total: R$ 600,00 | 29/Ago
  - Item 3: "Laudo Cautelar de Vistoria" | Taxa: R$ 350,00 | Total: R$ 350,00 | 30/Ago
- Action Buttons: "+ Lançar Peça / Serviço", "Avançar para [À VENDA]".
```
