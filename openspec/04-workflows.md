# CarZ - OpenSpec: 04. Fluxos Operacionais & Máquinas de Estado

## 1. Ciclo de Vida do Veículo em 3 Etapas

O ciclo de vida dos veículos na garagem é simplificado e direto, composto estritamente por **3 etapas**:

```mermaid
stateDiagram-v2
    [*] --> PREPARACAO : Entrada / Cadastro do Veículo (Compra / Troca)
    
    state PREPARACAO {
        [*] --> Oficina_Mecanica
        Oficina_Mecanica --> Funilaria_Pintura
        Funilaria_Pintura --> Estetica_Lavagem
        Estetica_Lavagem --> Checklist_Final
    }
    
    PREPARACAO --> A_VENDA : Conclusão da Preparação & Preço Definido
    
    A_VENDA --> PREPARACAO : Retorno para Ajuste / Reparo Adicional
    
    A_VENDA --> VENDIDO : Conclusão da Venda e Quitação Financeira
    
    VENDIDO --> [*] : Veículo entregue ao Cliente
```

---

### Detalhamento das 3 Etapas:

| Etapa | Status | Ações Permitidas no Sistema |
| :--- | :--- | :--- |
| **1ª Etapa: Preparação** | `PREPARACAO` | • Entrada e registro do veículo na garagem.<br>• Aplicação de peças do almoxarifado (debitando saldo).<br>• Lançamento de despesas diretas (funilaria, mecânica, laudo, IPVA).<br>• Registro do custo acumulado em tempo real. |
| **2ª Etapa: À Venda** | `A_VENDA` | • Veículo disponível no pátio físico e nos anúncios (Webmotors, etc.).<br>• Ficha do veículo com custo base acumulado travado para consulta da equipe.<br>• Vendedores realizam simulações de proposta e margem de lucro. |
| **3ª Etapa: Vendido** | `VENDIDO` | • Registro do cliente comprador e forma de pagamento.<br>• Abatimento por veículo na troca (*Trade-in*, se houver).<br>• Apuração e congelamento do **Lucro Bruto e Líquido Realizado**.<br>• Baixa final no estoque de veículos da garagem. |

---

## 2. Fluxo de Aplicação de Peças em Veículo (Durante a Preparação)

```mermaid
sequenceDiagram
    autonumber
    actor Prep as Mecânico / Preparador
    participant Sys as Sistema CarZ
    participant Stock as Almoxarifado de Peças
    participant Fin as Custos do Veículo
    
    Prep->>Sys: Seleciona Veículo em [PREPARACAO]
    Prep->>Sys: Solicita Peça (Ex: Pastilha de Freio) + Quantidade
    Sys->>Stock: Verifica Saldo em Estoque
    alt Estoque Insuficiente
        Stock-->>Sys: Alerta: Saldo Insuficiente no Almoxarifado
        Sys-->>Prep: Solicitar compra direta ou reposição de estoque
    else Estoque Disponível
        Stock->>Stock: Debita Saldo e Recalcula Custo Médio
        Stock->>Fin: Cria movimentação (SAIDA_APLICACAO_VEICULO)
        Fin->>Fin: Cria VehicleExpense automático (Qtd * Custo Médio)
        Fin->>Sys: Atualiza Custo Acumulado do Veículo
        Sys-->>Prep: Peça aplicada com sucesso!
    end
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
    
    Sys->>Sys: 1. Altera Veículo A para status [VENDIDO]
    Sys->>Sys: 2. Grava SaleTransaction com Lucro do Veículo A
    Sys->>Yard: 3. Cadastra automaticamente Veículo B no pátio com status [PREPARACAO] e Custo = R$ 35.000
    Sys-->>Vend: Venda finalizada com sucesso!
```
