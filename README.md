# Pesagem de Gado

Este é um sistema para o gerenciamento de vendas de gado, permitindo adicionar, editar e excluir vendas e caminhões, além de calcular o valor total da venda com base no peso do gado e no valor da arroba.

## Funcionalidades

- **Adicionar Venda:** Permite ao usuário adicionar novas vendas de gado, associando um nome e uma data.
- **Gerenciar Caminhões:** O usuário pode adicionar caminhões a uma venda, informando o peso bruto, tara e número de cabeças de gado transportadas.
- **Cálculos Automáticos:** O sistema realiza cálculos automáticos como:
  - Peso total do gado.
  - Quantidade de arrobas.
  - Valor total baseado no preço da arroba.
  - Desconto de 1,5% para o FUNRURAL.
- **Armazenamento Local:** As informações de vendas e caminhões são armazenadas no `localStorage` do navegador.

## Tecnologias Utilizadas

- **HTML5**: Estrutura das páginas.
- **CSS3**: Estilização responsiva e moderna.
- **JavaScript (ES6)**: Lógica do sistema, cálculos e manipulação do DOM.
- **Bootstrap 4.5**: Framework CSS para design responsivo.
- **LocalStorage**: Armazenamento local das vendas e caminhões.

## Estrutura do Projeto

```bash
├── css/
│   └── styles.css          # Estilos do sistema
├── js/
│   ├── sales/
│   │   ├── salesManager.js  # Gerenciamento de vendas
│   │   ├── truckManager.js  # Gerenciamento de caminhões
│   │   ├── summaryManager.js# Exibição do resumo da venda
│   ├── utils/
│   │   ├── formatUtils.js   # Funções utilitárias de formatação
│   │   └── storageUtils.js  # Manipulação do localStorage
│   └── app.js               # Arquivo inicial do app
├── adicionar-caminhao.html   # Página de adicionar caminhão
├── adicionar-venda.html      # Página de adicionar venda
├── pesagem-gado.html         # Página principal com a lista de vendas
├── resumo-da-venda.html      # Página de resumo de uma venda específica
└── README.md                 # Este arquivo
