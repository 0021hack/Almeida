// Número de WhatsApp da loja (formato internacional, só dígitos).
// Troque pelo número real da loja quando for publicar o site.
const WHATSAPP_LOJA = '5511985577002';

async function carregarProduto() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const conteudo = document.getElementById('conteudo-produto');

  if (!id) {
    conteudo.innerHTML = '<p class="sem-resultados">Produto não informado.</p>';
    return;
  }

  try {
    const resposta = await fetch(`/api/produtos/${id}`);
    if (!resposta.ok) {
      conteudo.innerHTML = '<p class="sem-resultados">Produto não encontrado.</p>';
      return;
    }
    const produto = await resposta.json();
    montarPagina(produto);
  } catch (erro) {
    conteudo.innerHTML = '<p class="sem-resultados">Não foi possível carregar o produto agora.</p>';
  }
}

function montarPagina(produto) {
  document.title = `${produto.nome} - Almeida Autopeças e Desmanche`;

  document.getElementById('trilha-categoria').textContent = produto.categoria;
  document.getElementById('trilha-categoria').href =
    `/resultados.html?categoria=${encodeURIComponent(produto.categoria)}`;
  document.getElementById('trilha-produto').textContent = produto.nome;

  document.getElementById('imagem-produto').src = produto.imagem;
  document.getElementById('imagem-produto').alt = produto.nome;

  document.getElementById('nome-produto').textContent = produto.nome;
  document.getElementById('preco-produto').textContent = formatarPreco(produto.preco);

  const parcela = produto.preco / 12;
  document.getElementById('parcelamento-produto').textContent =
    `Em até 12x de ${formatarPreco(parcela)} no cartão`;

  document.getElementById('part-number-produto').textContent =
    `Part Number: ${produto.partNumber}`;

  document.getElementById('sku-produto').textContent = `SKU: ${produto.sku}`;
  document.getElementById('categoria-produto').textContent = `Categoria: ${produto.categoria}`;

  const linkWhatsapp = document.getElementById('botao-whatsapp');
  const mensagem = `Olá! Tenho interesse na peça "${produto.nome}" (Part Number: ${produto.partNumber}), anunciada por ${formatarPreco(produto.preco)}. Poderiam me passar mais informações?`;
  linkWhatsapp.href = `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(mensagem)}`;

  document.getElementById('conteudo-produto').style.display = '';
}

function ativarCalculoFrete() {
  const botao = document.getElementById('botao-calcular-frete');
  const campoCep = document.getElementById('campo-cep');
  const resultado = document.getElementById('resultado-frete');
  if (!botao) return;

  botao.addEventListener('click', () => {
    const cep = campoCep.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      resultado.textContent = 'Informe um CEP válido para calcular o frete.';
      return;
    }
    resultado.textContent = 'Calculando frete para o CEP informado...';
    // Simulação simples de frete, apenas para fins do projeto acadêmico.
    setTimeout(() => {
      resultado.textContent = 'Frete estimado: R$ 49,90 - Entrega em até 7 dias úteis.';
    }, 600);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  carregarProduto();
  ativarCalculoFrete();
});
