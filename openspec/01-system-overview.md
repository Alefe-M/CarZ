# CarZ - OpenSpec: 01. Visão Geral do Sistema & Escopo

## 1. Identificação do Projeto
* **Nome do Sistema:** CarZ (Multi-tenant Garage & Vehicle Management Platform)
* **Perfil de Negócio:** Plataforma SaaS / Web Multi-tenant para Garagens de Compra, Preparação e Revenda de Veículos.
* **Modelo Operacional de Custos:**
  * **Sem almoxarifado/estoque central de peças:** Todas as peças trocadas e serviços executados são lançados e vinculados **diretamente ao veículo**.
  * Cada lançamento de gasto permite discriminar:
    * **Valor da(s) Peça(s)** (ex: Pastilhas de freio = R$ 20,00)
    * **Valor da Mão de Obra / Serviço** (ex: Serviço mecânico = R$ 50,00)
    * **Total do Lançamento** (ex: R$ 70,00 agregado ao custo do veículo).

---

## 2. As 3 Etapas Fundamentais do Ciclo de Vida do Veículo

```
[1. PREPARAÇÃO] ──(Revisão, Peças & Serviços Concluídos)──> [2. À VENDA] ──(Venda Concluída)──> [3. VENDIDO]
```

1. **PREPARAÇÃO (`PREPARACAO`):**
   * Entrada do veículo no pátio (Compra direta, Leilão ou Troca).
   * Lançamento de manutenções: peças trocadas e serviços de mecânica, funilaria, pintura, polimento, laudo cautelar e taxas.
   * Totalização do custo acumulado detalhado (Total de Peças, Total de Mão de Obra e Outros).

2. **À VENDA (`A_VENDA`):**
   * Veículo revisado e disponível no pátio físico e portais de anúncios.
   * Dossiê de custos travado para consulta da equipe comercial.
   * Simulação de propostas e margem de negociação com base no custo real.

3. **VENDIDO (`VENDIDO`):**
   * Conclusão da venda com formas de pagamento (PIX, Financiamento, Cartão ou Trade-in).
   * Apuração e congelamento do Lucro Bruto e Líquido Realizado.
   * Baixa definitiva no pátio de veículos da garagem.

---

## 3. Personas e Papéis por Garagem (RBAC por Tenant)

| Papel na Garagem | Permissões |
| :--- | :--- |
| **OWNER / PROPRIETÁRIO** | Acesso total à garagem, convite/remoção de membros, configuração de taxas e encerramento de conta. |
| **ADMIN** | Gestão administrativa delegada e relatórios globais. |
| **GERENTE** | Gestão de compras/entradas, aprovação de propostas de vendas, cadastro de despesas gerais e relatórios. |
| **VENDEDOR** | Consulta estoque disponível (`A_VENDA`), cadastro de clientes, geração de propostas e registro de vendas. |
| **MECÂNICO / PREPARADOR** | Visualização de veículos em `PREPARACAO` e lançamento direto de peças e serviços realizados no carro. |
| **VIEWER / AUDITOR** | Acesso somente-leitura aos relatórios financeiros, DRE e comprovantes. |

---

## 4. Requisitos Não Funcionais
* **Isolamento Estrito de Dados (Tenant Isolation):** Nenhuma query pode vazar dados entre garagens.
* **Precisão Decimal:** Cálculos monetários utilizam tipo `numeric(12, 2)` / `Decimal.js`.
* **Auditoria:** Rastreamento do `garageId` e `userId` em todas as mutações e transações.
