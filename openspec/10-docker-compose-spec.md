# CarZ - OpenSpec: 10. Especificação de Infraestrutura Docker Compose

## 1. Visão Geral dos Serviços

A infraestrutura local de desenvolvimento do **CarZ** é provisionada via Docker Compose, garantindo paridade total de ambiente para o banco de dados PostgreSQL 16 e ferramenta de inspeção gráfica pgAdmin 4.

---

## 2. Arquitetura de Containers

| Serviço | Imagem | Porta Host | Porta Container | Finalidade |
| :--- | :--- | :--- | :--- | :--- |
| **`postgres`** | `postgres:16-alpine` | `5432` | `5432` | Banco de dados relacional multi-tenant com volume persistente. |
| **`pgadmin`** | `dpage/pgadmin4:latest` | `5050` | `80` | Interface web para administração e execução de queries SQL. |

---

## 3. Variáveis de Ambiente & Defaults

```env
# PostgreSQL
POSTGRES_USER=carz_admin
POSTGRES_PASSWORD=carz_secret_123
POSTGRES_DB=carz_db
POSTGRES_PORT=5432

# URL de Conexão Prisma
DATABASE_URL="postgresql://carz_admin:carz_secret_123@localhost:5432/carz_db?schema=public"

# pgAdmin 4
PGADMIN_DEFAULT_EMAIL=admin@carz.local
PGADMIN_DEFAULT_PASSWORD=admin123
```

---

## 4. Healthcheck & Volumes Persistentes

* **Healthcheck do PostgreSQL:**
  ```yaml
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-carz_admin} -d ${POSTGRES_DB:-carz_db}"]
  interval: 5s
  timeout: 5s
  retries: 5
  ```
* **Volume Nomeado:** `postgres_data` persistido em driver local para retenção de dados entre restarts.
* **Rede Interna:** `carz_network` com bridge isolation.

---

## 5. Comandos Operacionais

```bash
# Iniciar os serviços em background
docker compose up -d

# Visualizar logs em tempo real do banco
docker compose logs -f postgres

# Parar os serviços preservando os dados
docker compose down

# Resetar completamente o banco (apaga dados do volume)
docker compose down -v
```
