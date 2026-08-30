# CarZ - OpenSpec: 03. Motor de Cálculo e Regras Financeiras

## 1. Visão Geral
Este documento define as fórmulas matemáticas adotadas no **CarZ** para apuração do custo total acumulado de cada veículo, permitindo a separação e consolidação transparente de **gastos com peças**, **gastos com mão de obra / serviços** e **taxas**.

---

## 2. Fórmulas de Custos por Veículo

### 2.1. Custo Direto Acumulado ($C_{\text{direto}}$)
O custo total do veículo é a soma do valor de aquisição com todas as despesas diretas lançadas em sua ficha:

$$C_{\text{direto}} = V_{\text{aquisicao}} + \sum G_{\text{despesas}}$$

### 2.2. Detalhamento por Natureza do Gasto (Dossiê do Carro)
Cada gasto direto $G$ pode discriminar o valor das peças aplicadas e o valor da mão de obra/serviço:

$$G = \text{ValorPeças} + \text{ValorMãoDeObra}$$

* **Total Investido em Peças:**
  $$\text{TotalPeças}(v) = \sum_{i=1}^{n} \text{partsCost}(i)$$
* **Total Investido em Mão de Obra / Serviços:**
  $$\text{TotalMãoDeObra}(v) = \sum_{i=1}^{n} \text{laborCost}(i)$$
* **Total em Taxas e Outros (IPVA, Laudo, Guincho):**
  $$\text{TotalOutros}(v) = \sum_{i=1}^{n} \text{otherCost}(i)$$

> **Exemplo Prático:**
> * Compra: R\$ 95.000,00
> * Gasto 1 (Troca de Pastilhas): Peças = R\$ 20,00 / Mão de Obra = R\$ 50,00 (Subtotal = R\$ 70,00)
> * Gasto 2 (Pintura do Parachoque): Peças = R\$ 150,00 / Mão de Obra = R\$ 450,00 (Subtotal = R\$ 600,00)
> * Gasto 3 (Laudo Cautelar): Taxa = R\$ 350,00
> * **Dossiê na Tela do Carro:**
>   * *Total em Peças:* R\$ 170,00
>   * *Total em Serviços:* R\$ 500,00
>   * *Total em Taxas/Outros:* R\$ 350,00
>   * *Custo Total Acumulado:* **R\$ 96.020,00**

---

## 3. Métricas de Venda e Lucratividade

Quando o veículo é vendido por $P_{\text{venda}}$:

### 3.1. Lucro Bruto ($L_{\text{bruto}}$)
$$L_{\text{bruto}} = P_{\text{venda}} - C_{\text{direto}}$$

### 3.2. Margem Bruta de Venda ($\% M_{\text{bruta}}$)
$$M_{\text{bruta}} = \left( \frac{L_{\text{bruto}}}{P_{\text{venda}}} \right) \times 100$$

### 3.3. Markup Realizado ($\% \text{Markup}$)
$$\text{Markup} = \left( \frac{P_{\text{venda}} - C_{\text{direto}}}{C_{\text{direto}}} \right) \times 100$$

### 3.4. Lucro Líquido Unitário ($L_{\text{liquido}}$)
$$L_{\text{liquido}} = L_{\text{bruto}} - \text{ComissãoVendedor} - \text{ImpostosNota} - \text{OutrasDeduções}$$
