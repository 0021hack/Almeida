// Lista única de categorias usada no menu desktop e no menu mobile.
// Mantendo em um só lugar evita ter que editar o HTML de cada página
// sempre que uma categoria mudar.
const CATEGORIAS = [
  { nome: 'Motor', link: '/resultados.html?categoria=Motor' },
  { nome: 'Transmissão', link: '/resultados.html?categoria=Transmiss%C3%A3o' },
  { nome: 'Elétrica', link: '/resultados.html?categoria=El%C3%A9trica' },
  { nome: 'Iluminação', link: '/resultados.html?categoria=Ilumina%C3%A7%C3%A3o' },
  { nome: 'Módulos', link: '/resultados.html?categoria=M%C3%B3dulos' },
  { nome: 'Carroceria', link: '/resultados.html?categoria=Carroceria' },
  { nome: 'Acabamento', link: '/resultados.html?categoria=Acabamento' },
  { nome: 'Sobre Nós', link: '/sobre.html' },
  { nome: 'Contato', link: '/contato.html' }
];

function montarNavegacao() {
  const navDesktop = document.getElementById('nav-categorias-lista');
  const navMobile = document.getElementById('menu-mobile');

  if (navDesktop) {
    navDesktop.innerHTML = CATEGORIAS
      .map((c) => `<a href="${c.link}">${c.nome.toUpperCase()}</a>`)
      .join('');
  }

  if (navMobile) {
    navMobile.innerHTML = CATEGORIAS
      .map((c) => `<a href="${c.link}">${c.nome.toUpperCase()}</a>`)
      .join('');
  }
}

function ativarMenuMobile() {
  const botao = document.getElementById('botao-hamburguer');
  const menu = document.getElementById('menu-mobile');
  if (!botao || !menu) return;

  botao.addEventListener('click', () => {
    menu.classList.toggle('aberto');
  });
}

function ativarFormularioBusca() {
  const forms = document.querySelectorAll('.busca-form');
  forms.forEach((form) => {
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const campo = form.querySelector('input[name="q"]');
      const termo = campo.value.trim();
      if (termo) {
        window.location.href = `/resultados.html?q=${encodeURIComponent(termo)}`;
      }
    });
  });
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// Monta o cartão de um produto para as grades de listagem
function criarCartaoProduto(produto) {
  return `
    <a class="cartao-produto" href="/produto.html?id=${produto.id}">
      <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
      <div class="info">
        <h3>${produto.nome}</h3>
        <div class="preco">${formatarPreco(produto.preco)}</div>
      </div>
    </a>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  montarNavegacao();
  ativarMenuMobile();
  ativarFormularioBusca();
});
