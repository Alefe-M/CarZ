# CarZ - OpenSpec: 04. Fluxos Operacionais & Máquinas de Estado

## 1. Ciclo de Vida do Veículo em 3 Etapas

```mermaid
stateDiagram-v2
    [*] --> PREPARACAO : Entrada / Cadastro do Veículo (Compra / Troca)
    
    state PREPARACAO {
        [*] --> Lancamento_Manutencoes : Lançamento Direto de Peças & Mão de Obra
        Lancamento_Manutencoes --> Funilaria_Pintura : Serviços de Terceiros
        Funilaria_Pintura --> Estetica_Lavagem : Higienização & Polimento
        Estetica_Lavagem --> Checklist_Final : Vistoria Concluída
    }
    
    PREPARACAO --> A_VENDA : Conclusão da Preparação & Preço Definido
    A_VENDA --> PREPARACAO : Retorno para Ajuste Adicional
    A_VENDA --> VENDIDO : Conclusão da Venda e Quitação
    VENDIDO --> [*] : Veículo Entregue ao Cliente
```

---

## 2. Fluxo de Lançamento de Peças e Serviços no Veículo

```mermaid
sequenceDiagram
    autonumber
    actor Operador as Mecânico / Gestor de Pátio
    participant Sys as Sistema CarZ
    participant Fin as Dossiê de Custos do Carro
    
    Operador->>Sys: Seleciona Veículo em [PREPARACAO]
    Operador->>Sys: Lança Manutenção (Ex: "Troca de pastilhas de freio")
    Operador->>Sys: Informa Valor da Peça (R$ 20,00) + Mão de Obra (R$ 50,00)
    Sys->>Fin: Grava VehicleExpense com Detalhamento
    Fin->>Fin: Recalcula Total em Peças, Total em Mão de Obra e Custo Total
    Sys-->>Operador: Gasto salvo com sucesso! Dossiê do carro atualizado em tempo real.
```

---

## 3. Fluxo de Venda com Veículo na Troca (Trade-in)

```mermaid
sequenceDiagram
    autonumber
    actor Vend as Vendedor
    participant Sys as Sistema CarZ
    participant Yard as Pátio da Garagem
    
    Vend->>Sys: Seleciona Veículo A [A_VENDA] (Ex: R$ 80.000)
    Vend->>Sys: Registra Venda com "Veículo na Troca"
    Vend->>Sys: Informa Dados do Veículo B (Troca) e Valor Acordado (Ex: R$ 35.000)
    Vend->>Sys: Informa Saldo Restante (R$ 45.000 via PIX/Financiamento)
    Vend->>Sys: Confirma e Finaliza Venda
    
    Sys->>Sys: 1. Altera Veículo A para [VENDIDO] e congela lucro
    Sys->>Yard: 2. Cadastra automaticamente Veículo B no pátio com status [PREPARACAO] e Custo = R$ 35.000
    Sys-->>Vend: Venda finalizada com sucesso!
```
