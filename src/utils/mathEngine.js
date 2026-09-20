// Helper para gerar número inteiro aleatório entre min e max (inclusive)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper para escolher item aleatório de um array
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function gerarPergunta(tema = 'equacao_1grau', dificuldade = 'Fácil') {
  const multXp = dificuldade === 'Fácil' ? 1 : dificuldade === 'Médio' ? 2 : 3;

  // 1. Equação do 1º Grau
  if (tema === 'equacao_1grau') {
    const a = randomInt(2, 5);
    const xReal = randomInt(1, 10);
    const b = randomInt(1, 20);
    const c = a * xReal + b;

    const cenarios = [
      `[${dificuldade}] 📝 Resolva a equação direta: ${a}x + ${b} = ${c}`,
      `[${dificuldade}] 📦 No inventário de um jogo, ${a} baús misteriosos mais ${b} moedas dão um total de ${c} itens. Quantos itens (x) tem cada baú?`,
      `[${dificuldade}] 💻 Um script Python roda ${a} ciclos com atraso fixo de ${b} ms, totalizando ${c} ms. Qual o tempo (x) de cada ciclo?`,
      `[${dificuldade}] 🎬 Na timeline de edição, ${a} clipes iguais mais uma intro de ${b} s somam ${c} s. Qual o tamanho (x) de cada clipe?`,
      `[${dificuldade}] 📖 Você leu ${a} capítulos de um manhwa e um especial de ${b} páginas, totalizando ${c} páginas. Quantas páginas (x) tem cada capítulo?`,
      `[${dificuldade}] 🖱️ Um auto-clicker deu ${a} rajadas automáticas mais ${b} cliques manuais, somando ${c} cliques. Quantos cliques (x) possui cada rajada?`,
      `[${dificuldade}] 🛒 Você comprou ${a} memórias RAM iguais e pagou frete de R$ ${b}, totalizando R$ ${c}. Qual o valor (x) de cada memória?`,
      `[${dificuldade}] 🌐 Em um servidor, ${a} clãs com mesmo nº de players mais ${b} players sem clã formam ${c} jogadores. Quantos (x) por clã?`,
      `[${dificuldade}] 🌐 Uma página HTML tem ${a} divs iguais mais uma margem de ${b} px, ocupando ${c} px. Qual a largura (x) de cada div?`,
      `[${dificuldade}] ⚖️ Uma balança está equilibrada com ${a} caixas misteriosas e ${b} kg de um lado, e ${c} kg do outro. Qual o peso (x) de cada caixa?`
    ];

    return {
      tema,
      formula: '📐 Fórmula Padrão: ax + b = c',
      texto: randomChoice(cenarios),
      resposta: xReal,
      xpBase: 10 * multXp,
      dicas: [
        `💡 Dica 1 (Conceito): O objetivo é isolar 'x'. Passe ${b} para o outro lado trocando o sinal.`,
        `💡 Dica 2 (Estrutura): ${a}x = ${c} - ${b} => ${a}x = ${c - b}.`,
        `💡 Dica 3 (Passo a Passo): Divida ${c - b} por ${a}. O resultado é x = ${(c - b) / a}.`
      ]
    };
  }

  // 2. Função Quadrática
  if (tema === 'funcao_quadratica') {
    const b = randomChoice([4, 6, 8, 10]);
    const xvReal = b / 2;

    const cenarios = [
      `[${dificuldade}] 🛹 O pulo de um skatista segue h(x) = -x² + ${b}x.\nEm qual ponto x ele atinge a altura máxima (Vértice)?`,
      `[${dificuldade}] 🚀 Uma animação de um projétil usa h(x) = -x² + ${b}x.\nEm qual frame (x) o projétil atinge o pico da tela?`,
      `[${dificuldade}] ⚽ O chute de um jogador segue h(x) = -x² + ${b}x.\nQual é o valor de x no vértice da parábola?`,
      `[${dificuldade}] 🧪 O pulo de um personagem com 'Jump Boost' segue h(x) = -x² + ${b}x.\nEm qual bloco (x) atinge a altura máxima?`,
      `[${dificuldade}] 📈 O gráfico de lucro na venda de itens varia por L(x) = -x² + ${b}x.\nQual a quantidade (x) para lucro máximo?`,
      `[${dificuldade}] 🎬 A curva de velocidade de uma transição de vídeo segue h(x) = -x² + ${b}x.\nEm qual segundo (x) o efeito é mais rápido?`,
      `[${dificuldade}] ⚔️ O golpe do protagonista faz a parábola h(x) = -x² + ${b}x.\nQual a distância (x) do ponto mais alto?`,
      `[${dificuldade}] 🎨 Uma animação CSS em arco obedece h(x) = -x² + ${b}x.\nQual o ponto x correspondente ao pico?`,
      `[${dificuldade}] 🎮 O pulo do avatar no motor de física é h(x) = -x² + ${b}x.\nQual o valor de x no ápice do salto?`,
      `[${dificuldade}] 🗄️ O tráfego no banco de dados gerou a curva h(x) = -x² + ${b}x.\nEm qual segundo (x) ocorreu o tráfego máximo?`
    ];

    return {
      tema,
      formula: '📐 Fórmula Padrão (Vértice): Xv = -b / (2a)',
      texto: randomChoice(cenarios),
      resposta: xvReal,
      xpBase: 20 * multXp,
      dicas: [
        '💡 Dica 1 (Conceito): A altura máxima de uma curva parabólica ocorre no Vértice (Xv).',
        `💡 Dica 2 (Estrutura): Use a fórmula do Vértice: Xv = -b / (2a). Aqui, a = -1 e b = ${b}.`,
        `💡 Dica 3 (Passo a Passo): Xv = -(${b}) / (2 * -1) => -${b} / -2 => x = ${xvReal}.`
      ]
    };
  }

  // 3. Porcentagem
  if (tema === 'porcentagem') {
    const valor = randomChoice([50, 100, 200, 300]);
    const porc = randomChoice([10, 20, 25, 50]);
    const resp = (valor * porc) / 100;

    const cenarios = [
      `[${dificuldade}] 👟 Um tênis custa R$ ${valor}. Com ${porc}% de desconto, de quanto será o desconto?`,
      `[${dificuldade}] 📦 Um modpack tem ${valor} MB. O gerenciador baixou ${porc}%. Quantos MB foram baixados?`,
      `[${dificuldade}] 📹 Você está renderizando um vídeo de ${valor} frames. O progresso é ${porc}%. Quantos frames foram feitos?`,
      `[${dificuldade}] 🗄️ Uma tabela MySQL tem ${valor} linhas. Uma consulta retornou ${porc}% dos dados. Quantas linhas foram retornadas?`,
      `[${dificuldade}] 🔌 Um servidor aguenta ${valor} players, mas teve instabilidade reduzindo em ${porc}%. Quantos slots caíram?`,
      `[${dificuldade}] 📱 Um capítulo de manhwa tem ${valor} painéis. Você já leu ${porc}%. Quantos painéis leu?`,
      `[${dificuldade}] 🐍 Um script precisa analisar ${valor} logs. Já processou ${porc}%. Quantos arquivos concluiu?`,
      `[${dificuldade}] ⛏️ Você coletou ${valor} minérios. Ao refinar, perdeu ${porc}% em impurezas. Quantos minérios perdeu?`,
      `[${dificuldade}] 🎵 O tempo total de uma edit é ${valor} s. A batida forte ocorre em ${porc}% do vídeo. Em qual segundo cai?`,
      `[${dificuldade}] 💻 Uma placa de vídeo custa R$ ${valor}. Pagando no PIX tem ${porc}% de desconto. Qual o valor do desconto?`
    ];

    return {
      tema,
      formula: '📐 Fórmula Padrão: Desconto = (Valor Total × Porcentagem) / 100',
      texto: randomChoice(cenarios),
      resposta: resp,
      xpBase: 10 * multXp,
      dicas: [
        `💡 Dica 1 (Conceito): Porcentagem é uma fração com base 100 (${porc}/100).`,
        `💡 Dica 2 (Estrutura): Multiplique o valor total (${valor}) por ${porc} e divida por 100.`,
        `💡 Dica 3 (Passo a Passo): ${valor} * ${porc} = ${valor * porc}. Dividido por 100 = R$ ${resp}.`
      ]
    };
  }
}