# CarZ - OpenSpec: 01. Visão Geral do Sistema & Escopo

## 1. Identificação do Projeto
* **Nome do Sistema:** CarZ (Multi-tenant Garage & Vehicle Management Platform)
* **Perfil de Negócio:** Plataforma SaaS / Web Multi-tenant para Garagens de Compra, Preparação e Revenda de Veículos.
* **Modelo Multi-garagem:** 
  * Um usuário pode possuir ou ser membro de **múltiplas garagens** (com diferentes papéis em cada uma).
  * Cada garagem é um ambiente isolado (**Tenant**) com seus próprios veículos, estoque de peças, despesas e faturamento.
  * O proprietário de uma garagem pode convidar e conceder permissões específicas para outros colaboradores.

---

## 2. As 3 Etapas Fundamentais do Ciclo de Vida do Veículo

O sistema adota um pipeline operacional simplificado, claro e objetivo em **3 etapas**:

```
[1. PREPARAÇÃO] ──(Revisão & Peças Concluídas)──> [2. À VENDA] ──(Negociação Concluída)──> [3. VENDIDO]
```

1. **PREPARAÇÃO (`PREPARACAO`):**
   * Entrada do veículo (Compra, Leilão ou Troca).
   * Aplicação de peças de estoque e débito de almoxarifado.
   * Lançamento de despesas diretas (funilaria, mecânica, laudo cautelar, IPVA, higienização).
   * Formação do custo total acumulado.

2. **À VENDA (`A_VENDA`):**
   * Veículo revisado e disponível no pátio físico e portais de anúncios.
   * Custo acumulado disponível para cálculo de margem da equipe comercial.
   * Criação de propostas e negociação com clientes.

3. **VENDIDO (`VENDIDO`):**
   * Conclusão da venda com formas de pagamento (PIX, Financiamento, Cartão ou Trade-in).
   * Registro final de lucro bruto, líquido e comissões.
   * Baixa definitiva no estoque de veículos.

---

## 3. Personas e Papéis por Garagem (RBAC por Tenant)

| Papel na Garagem | Permissões |
| :--- | :--- |
| **OWNER / PROPRIETÁRIO** | Acesso total à garagem, convite/remoção de membros, configuração de taxas e encerramento de conta. |
| **ADMIN** | Gestão administrativa delegada e relatórios globais. |
| **GERENTE** | Gestão de compras/entradas, aprovação de propostas de vendas, cadastro de despesas gerais e relatórios. |
| **VENDEDOR** | Consulta estoque disponível (`A_VENDA`), cadastro de clientes, geração de propostas e registro de vendas. |
| **MECÂNICO / PREPARADOR** | Visualização de veículos em `PREPARACAO`, solicitação de peças do almoxarifado e registro de serviços. |
| **ESTOQUISTA** | Entrada de notas de peças, controle de estoque mínimo e inventário de autopeças. |
| **VIEWER / AUDITOR** | Acesso somente-leitura aos relatórios financeiros, DRE e comprovantes. |

---

## 4. Requisitos Não Funcionais
* **Isolamento Estrito de Dados (Tenant Isolation):** Nenhuma query pode vazar dados entre garagens.
* **Precisão Decimal:** Cálculos monetários utilizam tipo `numeric(12, 2)` / `Decimal.js`.
* **Auditoria:** Rastreamento do `garageId` e `userId` em todas as mutações e transações.
