# CarZ — OpenSpec: Integração Frontend, Sessão e Dados Reais

## Objetivo

As telas do dashboard não podem manter dados de veículos, despesas ou vendas em mocks ou `localStorage`. O `GarageContext` é exclusivamente uma camada de leitura e mutação da API REST; PostgreSQL, via Prisma, é a fonte de verdade.

## Sessão

1. `POST /api/v1/auth/login` recebe e-mail e senha.
2. Após validar a senha com bcrypt, o servidor emite o cookie HTTP-only `carz_session`, assinado com `NEXTAUTH_SECRET`, com validade de oito horas.
3. Toda rota de garagem obtém o usuário do cookie e verifica a associação `GarageMember`. Nenhuma rota aceita um usuário padrão ou ID escolhido pelo navegador.
4. Sem sessão válida, a API retorna `401` e o dashboard redireciona para `/login`.

## Carregamento por garagem

Ao abrir `/{garageSlug}`, o frontend deve carregar, em sequência:

1. `GET /api/v1/garages` para descobrir as garagens autorizadas e resolver o slug.
2. Em paralelo, os veículos, despesas gerais e vendas da garagem resolvida.
3. Valores `Decimal` retornados pelo Prisma são normalizados para número somente na camada de apresentação. Nenhum cálculo financeiro é feito como fonte de verdade no navegador.

Após cada mutação, o contexto executa uma nova leitura da API. Não há atualização otimista persistida localmente.

## Clientes e vendas

Como uma venda requer um `customerId`, a API expõe `GET` e `POST /api/v1/garages/{garageId}/customers`. O `POST` faz upsert pela chave `(garageId, documentCpfCnpj)`. A interface solicita nome, CPF/CNPJ e telefone antes de concluir a venda e usa o cliente retornado na transação.

## Novos endpoints

| Endpoint | Regra |
|---|---|
| `POST /api/v1/auth/login` | Cria sessão HTTP-only após credenciais válidas. |
| `POST /api/v1/auth/logout` | Invalida o cookie da sessão. |
| `GET /api/v1/garages/{garageId}/customers` | Lista clientes da própria garagem; papel mínimo `VENDEDOR`. |
| `POST /api/v1/garages/{garageId}/customers` | Cria/atualiza cliente da própria garagem; papel mínimo `VENDEDOR`. |
