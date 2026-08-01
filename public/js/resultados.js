// Mesmo número usado no botão de WhatsApp da página de produto.
const WHATSAPP_LOJA_RESULTADOS = '5511999999999';

function criarBlocoItemIndisponivel(termo) {
  const mensagem = termo
    ? `Olá! Procurei por "${termo}" no site, mas não encontrei essa peça disponível. Vocês têm em estoque?`
    : 'Olá! Não encontrei a peça que eu procurava no site. Vocês têm em estoque?';
  const link = `https://wa.me/${WHATSAPP_LOJA_RESULTADOS}?text=${encodeURIComponent(mensagem)}`;

  return `
    <div class="item-indisponivel">
      <p>Este item não está disponível no site, mas há estoque disponível com o
      agente no WhatsApp.</p>
      <a class="botao botao-whatsapp" href="${link}" target="_blank" rel="noopener">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="#fff"><path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.362.687 4.564 1.872 6.417L4 29l7.77-1.84A11.93 11.93 0 0 0 16 27c6.628 0 12-5.373 12-12S22.629 3 16.001 3zm0 21.75c-1.94 0-3.75-.55-5.28-1.5l-.38-.23-4.62 1.09 1.11-4.5-.25-.4A9.7 9.7 0 0 1 5.25 15c0-5.93 4.82-10.75 10.75-10.75S26.75 9.07 26.75 15 21.93 24.75 16 24.75zm5.98-8.02c-.32-.16-1.9-.94-2.2-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.55-1.58-.94-.84-1.58-1.87-1.76-2.19-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.75-1-2.4-.26-.63-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.63s1.14 3.05 1.3 3.26c.16.21 2.24 3.43 5.43 4.81.76.33 1.35.53 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37z"/></svg>
        Falar com um agente no WhatsApp
      </a>
    </div>
  `;
}

async function carregarResultados() {
  const params = new URLSearchParams(window.location.search);
  const termo = params.get('q');
  const categoria = params.get('categoria');

  const titulo = document.getElementById('titulo-resultados');
  const subtitulo = document.getElementById('subtitulo-resultados');
  const container = document.getElementById('grade-resultados');
  const campoBusca = document.querySelector('.busca-form input[name="q"]');

  let urlApi = '/api/produtos?';
  if (termo) {
    urlApi += `busca=${encodeURIComponent(termo)}`;
    titulo.textContent = `Resultados para "${termo}"`;
    if (campoBusca) campoBusca.value = termo;
  } else if (categoria) {
    urlApi += `categoria=${encodeURIComponent(categoria)}`;
    titulo.textContent = categoria;
  } else {
    titulo.textContent = 'Todos os produtos';
  }

  try {
    const resposta = await fetch(urlApi);
    const produtos = await resposta.json();

    subtitulo.textContent = `${produtos.length} produto(s) encontrado(s)`;

    if (!produtos.length) {
      container.innerHTML = termo
        ? criarBlocoItemIndisponivel(termo)
        : '<p class="sem-resultados">Nenhum produto encontrado nessa categoria.</p>';
      return;
    }

    container.innerHTML = produtos.map(criarCartaoProduto).join('');
  } catch (erro) {
    container.innerHTML = '<p class="sem-resultados">Não foi possível carregar os resultados agora.</p>';
  }
}

document.addEventListener('DOMContentLoaded', carregarResultados);
