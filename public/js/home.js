async function carregarOfertasMotor() {
  const container = document.getElementById('grade-ofertas');
  if (!container) return;

  try {
    const resposta = await fetch('/api/produtos?categoria=Motor&limit=8');
    const produtos = await resposta.json();

    if (!produtos.length) {
      container.innerHTML = '<p class="sem-resultados">Nenhum produto encontrado nessa categoria.</p>';
      return;
    }

    container.innerHTML = produtos.map(criarCartaoProduto).join('');
  } catch (erro) {
    container.innerHTML = '<p class="sem-resultados">Não foi possível carregar os produtos agora.</p>';
  }
}

document.addEventListener('DOMContentLoaded', carregarOfertasMotor);
