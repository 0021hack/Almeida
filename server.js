/**
 * Almeida Autopeças e Desmanche - Servidor
 * Node.js puro (sem frameworks). Serve os arquivos estáticos da pasta /public
 * e expõe uma API simples para listar/filtrar/buscar produtos salvos em
 * /data/produtos.json.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const PRODUTOS_PATH = path.join(__dirname, 'data', 'produtos.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Remove acentos e deixa em minúsculo, para permitir busca "insensível"
// a maiúsculas/minúsculas e a acentuação.
function normalizar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function carregarProdutos() {
  const raw = fs.readFileSync(PRODUTOS_PATH, 'utf-8');
  return JSON.parse(raw);
}

function enviarJSON(res, statusCode, dados) {
  const body = JSON.stringify(dados);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function tratarApiProdutos(req, res, query) {
  let produtos;
  try {
    produtos = carregarProdutos();
  } catch (erro) {
    enviarJSON(res, 500, { erro: 'Não foi possível carregar os produtos.' });
    return;
  }

  const { categoria, busca, limit } = query;

  if (categoria) {
    const categoriaAlvo = normalizar(categoria);
    produtos = produtos.filter((p) => normalizar(p.categoria) === categoriaAlvo);
  }

  if (busca) {
    const termo = normalizar(busca);
    produtos = produtos.filter((p) => {
      return (
        normalizar(p.nome).includes(termo) ||
        normalizar(p.categoria).includes(termo) ||
        normalizar(p.partNumber || '').includes(termo) ||
        normalizar(p.sku || '').includes(termo)
      );
    });
  }

  if (limit) {
    const n = parseInt(limit, 10);
    if (!Number.isNaN(n) && n > 0) {
      produtos = produtos.slice(0, n);
    }
  }

  enviarJSON(res, 200, produtos);
}

function tratarApiProdutoPorId(req, res, id) {
  let produtos;
  try {
    produtos = carregarProdutos();
  } catch (erro) {
    enviarJSON(res, 500, { erro: 'Não foi possível carregar os produtos.' });
    return;
  }

  const produto = produtos.find((p) => String(p.id) === String(id));
  if (!produto) {
    enviarJSON(res, 404, { erro: 'Produto não encontrado.' });
    return;
  }
  enviarJSON(res, 200, produto);
}

function servirArquivoEstatico(req, res, pathname) {
  let caminhoRelativo = pathname === '/' ? '/index.html' : pathname;
  // Remove query strings residuais e evita "path traversal" (../)
  caminhoRelativo = caminhoRelativo.split('?')[0];
  const caminhoSeguro = path.normalize(caminhoRelativo).replace(/^(\.\.[/\\])+/, '');
  let caminhoCompleto = path.join(PUBLIC_DIR, caminhoSeguro);

  fs.stat(caminhoCompleto, (erro, stats) => {
    if (erro || !stats.isFile()) {
      // Se não achar arquivo, tenta servir index.html (útil para rotas amigáveis)
      const caminho404 = path.join(PUBLIC_DIR, '404.html');
      fs.readFile(caminho404, (erro404, conteudo404) => {
        if (erro404) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 - Página não encontrada');
        } else {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(conteudo404);
        }
      });
      return;
    }

    const ext = path.extname(caminhoCompleto).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(caminhoCompleto).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  if (pathname === '/api/produtos' && req.method === 'GET') {
    tratarApiProdutos(req, res, query);
    return;
  }

  const matchProdutoId = pathname.match(/^\/api\/produtos\/(\d+)$/);
  if (matchProdutoId && req.method === 'GET') {
    tratarApiProdutoPorId(req, res, matchProdutoId[1]);
    return;
  }

  servirArquivoEstatico(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`Almeida Autopeças e Desmanche rodando em http://localhost:${PORT}`);
});
