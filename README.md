# Almeida Autopeças e Desmanche (Projeto Acadêmico)

Site de auto peças inspirado no [almeidaautopecasedesmanche.com.br](https://almeidaautopecasedesmanche.com.br),
feito em **Node.js puro** (sem frameworks como Express), **HTML** e **CSS**.

## Como rodar

Pré-requisito: ter o [Node.js](https://nodejs.org) instalado (versão 14 ou superior).

```bash
node server.js
```

Depois abra no navegador: http://localhost:3000

Para trocar a porta: `PORT=8080 node server.js`

## Estrutura do projeto

```
almeida-autopecas-desmanche/
├── server.js              → servidor HTTP puro (arquivos estáticos + API)
├── package.json
├── data/
│   └── produtos.json      → "banco de dados" dos produtos (JSON)
└── public/
    ├── index.html          → página inicial (mostra produtos da categoria Motor)
    ├── resultados.html     → resultados de busca ou de categoria
    ├── produto.html        → página de detalhe do produto
    ├── sobre.html
    ├── contato.html
    ├── 404.html
    ├── css/style.css
    ├── js/
    │   ├── comum.js        → menu, categorias e busca (usado em todas as páginas)
    │   ├── home.js          → carrega os produtos de Motor na home
    │   ├── resultados.js    → busca/filtro por categoria
    │   └── produto.js       → carrega os dados do produto e monta o link do WhatsApp
    └── img/
        ├── logo.svg         → logo provisória (troque pela sua)
        ├── banner.svg        → banner provisório da home
        └── produtos/         → imagens provisórias por categoria (svg)
```

## Como funciona

- **Produtos**: todos ficam salvos em `data/produtos.json`. Para adicionar, editar ou
  remover peças, basta editar esse arquivo (cada produto tem `id`, `nome`, `categoria`,
  `preco`, `partNumber`, `sku`, `imagem` e `descricao`).
- **API interna** (usada pelo próprio front-end):
  - `GET /api/produtos` → lista todos os produtos
  - `GET /api/produtos?categoria=Motor` → filtra por categoria
  - `GET /api/produtos?busca=termo` → busca por nome/categoria/part number/SKU
  - `GET /api/produtos/:id` → retorna um produto específico
- **Busca sem acento/maiúscula**: o servidor normaliza tanto o termo buscado quanto os
  dados salvos (remove acentos e converte para minúsculo) antes de comparar, então
  "motor", "Motor" ou "MOTÓR" encontram os mesmos resultados.
- **Compra**: não existe carrinho nem checkout. Cada produto tem um botão de WhatsApp
  que abre uma conversa já com uma mensagem pronta, citando o nome e o part number da
  peça. Os botões "Ligar na Loja" e "Email" aparecem na tela (fiéis ao site original),
  mas estão desativados por enquanto, como pedido.
- **Menu mobile**: abaixo de 768px de largura o menu de categorias vira um ícone de
  três linhas (hambúrguer); ao clicar, aparece a lista de categorias em um menu suspenso.

## Personalização

- **Logo**: troque o arquivo `public/img/logo.svg` pela logo real (pode ser `.png` ou
  `.svg` — só ajuste o `src` no `<img>` de cada página se mudar a extensão).
- **Número do WhatsApp**: edite a constante `WHATSAPP_LOJA` em `public/js/produto.js`
  (e os links `https://wa.me/...` no `index.html`, `resultados.html`, `contato.html`
  e `produto.html`).
- **Imagens dos produtos**: troque os SVGs de `public/img/produtos/` por fotos reais,
  atualizando o campo `imagem` de cada produto em `data/produtos.json`.
