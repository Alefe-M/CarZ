# 🚗 CarZ - OpenSpec Architecture

Bem-vindo à especificação técnica e de negócio do **CarZ**, sistema web multi-tenant de gestão de veículos, controle de peças e apuração financeira para revendas e garagens de seminovos.

---

## 📂 Documentos da Especificação

| Arquivo | Descrição |
| :--- | :--- |
| [01-system-overview.md](./01-system-overview.md) | Visão geral do produto, arquitetura multi-tenant, as 3 etapas de vida do veículo (`PREPARACAO`, `A_VENDA`, `VENDIDO`) e matriz de permissões (RBAC). |
| [02-domain-models.yaml](./02-domain-models.yaml) | Schema completo de dados: Entidades (`Garage`, `GarageMember`, `Vehicle`, `Part`, `PartStockMovement`, `VehicleExpense`, `GeneralExpense`, `SaleTransaction`, etc.). |
| [03-financial-rules.md](./03-financial-rules.md) | Fórmulas matemáticas de apuração de custo direto acumulado, custo médio ponderado de estoque, lucratividade, markup, regra de Trade-in (carro na troca) e DRE mensal. |
| [04-workflows.md](./04-workflows.md) | Diagramas de fluxo e máquinas de estado (Ciclo em 3 Etapas, Aplicação de Peças e Venda com Trade-in). |
| [05-api-spec.yaml](./05-api-spec.yaml) | Contrato OpenAPI 3.0 (Swagger) para a API REST multi-tenant e endpoints de proxy FIPE. |
| [06-technical-architecture.md](./06-technical-architecture.md) | Arquitetura técnica: Next.js (App Router), React, TypeScript, PostgreSQL, Tenant Context Switcher, Tailwind CSS e shadcn/ui. |
| [schema.prisma](./schema.prisma) | Modelagem pronta do Prisma ORM para PostgreSQL com precisão monetária `Decimal(12,2)`, campos FIPE e integridade referencial multi-tenant. |
| [08-fipe-integration.md](./08-fipe-integration.md) | Especificação completa da integração com a **FipeAPI / Parallelum API** (Marcas, Modelos, Anos, Valores de mercado e Caching). |
| [09-ui-design-prompts-stitch.md](./09-ui-design-prompts-stitch.md) | Guia completo de **Prompts para o Stitch** (Web Desktop 1440px e Mobile 390px) cobrindo todas as telas e fluxos. |
| [10-docker-compose-spec.md](./10-docker-compose-spec.md) | Especificação do ambiente **Docker Compose** (PostgreSQL 16 Alpine + pgAdmin 4 + Healthchecks + Volumes). |

---

## 🚀 Como Subir o Banco e Iniciar o Backend

1. **Subir o PostgreSQL local:**
   ```bash
   docker compose up -d
   ```
2. **Inicializar o projeto Next.js e aplicar as migrações Prisma:**
   ```bash
   npx prisma migrate dev --name init
   ```
