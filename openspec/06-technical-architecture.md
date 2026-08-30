# CarZ - OpenSpec: 06. Arquitetura Técnica & Stack Tecnológica (Multi-tenant)

## 1. Stack Tecnológica Definida

| Camada | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Framework Full-stack** | **Next.js (App Router) + React 18/19** | Server Components para performance extrema, Server Actions para mutações e Route Handlers REST. |
| **Linguagem** | **TypeScript** | Tipagem estrita de ponta a ponta (do banco até a UI), garantindo segurança em dados monetários e relacionamentos multi-tenant. |
| **Banco de Dados** | **PostgreSQL** | Relacional robusto com suporte a isolamento multi-tenant (chaves estrangeiras `garageId`, índices compostos e integridade referencial). |
| **ORM / Data Layer** | **Prisma ORM** | Schema declarativo centralizado, Prisma Client Extensions para injeção e validação automática de tenant. |
| **Estilização & UI** | **Tailwind CSS + shadcn/ui** | Componentes acessíveis, visual moderno e seletor de tenant/garagem no topo da navegação. |
| **Validação de Schemas** | **Zod** | Validação de payloads e formulários com inferência automática de tipos TypeScript. |
| **Ícones & Gráficos** | **Lucide React + Recharts** | Gráficos financeiros de DRE, fluxo de caixa, giro de estoque e métricas por garagem. |
| **Autenticação** | **NextAuth.js (Auth.js) / JWT** | Autenticação global de usuário com suporte a alternância dinâmica de garagem ativa na sessão. |

---

## 2. Estratégia de Multi-tenancy & Isolamento de Dados

### 2.1. Modelo de Tenant (Shared Database, Pooled Schema)
* Todas as garagens compartilham o mesmo banco de dados PostgreSQL.
* Cada registro de domínio (`Vehicle`, `Part`, `VehicleExpense`, `GeneralExpense`, `SaleTransaction`, `Customer`, `Supplier`) possui obrigatoriamente a coluna `garageId`.
* As chaves únicas operacionais são compostas:
  * Exemplo: `@@unique([garageId, plate])` permite que garagens distintas tenham carros de teste sem colisão de chave, mantendo a unicidade estrita dentro da mesma loja.

### 2.2. Contexto de Garagem Ativa (Tenant Context)
1. **Seleção de Garagem:** O usuário faz login $\rightarrow$ o sistema lista as garagens às quais ele pertence (`GarageMember`).
2. **Armazenamento da Sessão:** A garagem ativa atual é salva em cookie seguro / sessão (`currentGarageId`).
3. **Alternador de Garagem (Switcher):** A qualquer momento no cabeçalho da aplicação, o usuário pode trocar para outra garagem autorizada sem precisar deslogar.

### 2.3. Guardiões de Segurança & Autorização (RBAC)
Toda Server Action ou rota de API executa uma verificação obrigatória de permissão:

```typescript
// Exemplo de Helper de Segurança
export async function verifyGarageAccess(garageId: string, minRole?: GarageRole) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");

  const membership = await prisma.garageMember.findUnique({
    where: {
      garageId_userId: {
        garageId,
        userId: session.user.id
      }
    }
  });

  if (!membership) {
    throw new Error("Acesso negado a esta garagem");
  }

  // Validação de nível de permissão (ex: Vendedor não pode excluir despesa geral)
  return { user: session.user, membership };
}
```

---

## 3. Estrutura Proposta de Pastas do Projeto

```
carz/
├── prisma/
│   ├── schema.prisma           # Modelagem Multi-tenant com PostgreSQL
│   └── migrations/             # Migrações versionadas
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login, Registro de Usuário e Aceite de Convite
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── convite/[token]/
│   │   ├── (garagens)/         # Onboarding & Seletor de Garagens
│   │   │   ├── page.tsx        # Lista de Garagens do Usuário (Escolher ou Criar Nova)
│   │   │   └── nova/           # Criar nova garagem
│   │   ├── (dashboard)/[garageSlug]/ # Área de trabalho com contexto da garagem ativa
│   │   │   ├── layout.tsx      # Sidebar, Tenant Switcher, Header e Perfil
│   │   │   ├── page.tsx        # Dashboard e Métricas da Garagem
│   │   │   ├── veiculos/       # Gestão de Veículos da Garagem
│   │   │   │   ├── [id]/       # Detalhes, Custos acumulados, Peças aplicadas
│   │   │   │   └── novo/       # Entrada de Veículo (Compra / Leilão / Troca)
│   │   │   ├── pecas/          # Catálogo e Almoxarifado da Garagem
│   │   │   ├── despesas/       # Gastos Fixos e Operacionais da Garagem
│   │   │   ├── vendas/         # Negociações e Trade-in
│   │   │   ├── membros/        # Gestão de Usuários da Garagem & Convites por e-mail
│   │   │   └── relatorios/     # DRE e Análises de Lucro
│   │   └── api/                # Endpoints REST (com autenticação e garageId)
│   ├── components/
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   ├── tenant/             # GarageSwitcher, InviteModal, MemberRoleBadge
│   │   ├── vehicles/           # Timeline de custos, card de status, formulários
│   │   ├── parts/              # Seletor de peças e baixa no estoque
│   │   └── financial/          # DRE, gráficos de lucro e indicadores
│   ├── lib/
│   │   ├── prisma.ts           # Cliente Prisma Singleton
│   │   ├── auth.ts             # Configuração NextAuth / Sessão
│   │   ├── tenant.ts           # Helpers de validação de acesso à garagem
│   │   ├── calculations.ts     # Funções puras de cálculo financeiro
│   │   └── validations/        # Schemas Zod
│   └── types/
```
