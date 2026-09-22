import React, { useState, useEffect } from 'react';
import { Trophy, Lightbulb, BarChart2, HelpCircle, RotateCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import confetti from 'canvas-confetti';
import { gerarPergunta } from './utils/mathEngine';

export default function App() {
  // 1. Persistência do XP
  const [xp, setXp] = useState(() => {
    const xpSalvo = localStorage.getItem('mathbridge_xp');
    return xpSalvo ? JSON.parse(xpSalvo) : 0;
  });

  // Modal do Jogo Arcade
  const [exibirJogoArcade, setExibirJogoArcade] = useState(false);
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [questao, setQuestao] = useState(null);
  const [respostaUsuario, setRespostaUsuario] = useState('');
  const [dicaNivel, setDicaNivel] = useState(0);
  
  // Modais e Diálogos
  const [mensagemStatus, setMensagemStatus] = useState(null);
  const [exibirDicaModal, setExibirDicaModal] = useState(false);
  const [exibirPainelProfessor, setExibirPainelProfessor] = useState(false);

  // 2. Persistência das Estatísticas
  const [stats, setStats] = useState(() => {
    const statsSalvas = localStorage.getItem('mathbridge_stats');
    return statsSalvas ? JSON.parse(statsSalvas) : {
      totalRespondidas: 0,
      acertos: 0,
      erros: 0,
      errosPorTema: { equacao_1grau: 0, funcao_quadratica: 0, porcentagem: 0 },
      dicasUsadas: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('mathbridge_xp', JSON.stringify(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('mathbridge_stats', JSON.stringify(stats));
  }, [stats]);

  const handleGerarPergunta = (tema) => {
    const novaQuestao = gerarPergunta(tema, dificuldade);
    setQuestao(novaQuestao);
    setDicaNivel(0);
    setRespostaUsuario('');
    setMensagemStatus(null);
  };

  const handlePedirDica = () => {
    if (!questao) return;
    if (dicaNivel < 3) {
      setDicaNivel(prev => prev + 1);
      setStats(prev => ({ ...prev, dicasUsadas: prev.dicasUsadas + 1 }));
      setExibirDicaModal(true);
    } else {
      setExibirDicaModal(true);
    }
  };

  const handleVerificarResposta = (e) => {
    e.preventDefault();
    if (!questao || !respostaUsuario) return;

    const valUsuario = parseFloat(respostaUsuario.replace(',', '.'));
    const acertou = valUsuario === questao.resposta;

    setStats(prev => ({
      ...prev,
      totalRespondidas: prev.totalRespondidas + 1,
      acertos: acertou ? prev.acertos + 1 : prev.acertos,
      erros: !acertou ? prev.erros + 1 : prev.erros,
      errosPorTema: !acertou 
        ? { ...prev.errosPorTema, [questao.tema]: prev.errosPorTema[questao.tema] + 1 }
        : prev.errosPorTema
    }));

    if (acertou) {
      // Dispara a animação de confetes no acerto
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.65 }
      });

      const ganho = Math.max(3, questao.xpBase - (dicaNivel * 3));
      setXp(prev => prev + ganho);
      setMensagemStatus({
        tipo: 'sucesso',
        texto: `Mandou muito bem! Ponte construída com sucesso! 🎉 (+${ganho} XP)`
      });
      setTimeout(() => handleGerarPergunta(questao.tema), 1800);
    } else {
      setMensagemStatus({
        tipo: 'erro',
        texto: `Quase lá! 🌱 A resposta esperada era ${questao.resposta}. Tente o próximo desafio!`
      });
      setTimeout(() => handleGerarPergunta(questao.tema), 2200);
    }
  };

  const handleResetarDados = () => {
    if (window.confirm('Tem certeza que deseja resetar todo o progresso (XP e Diagnósticos)?')) {
      localStorage.removeItem('mathbridge_xp');
      localStorage.removeItem('mathbridge_stats');
      setXp(0);
      setStats({
        totalRespondidas: 0,
        acertos: 0,
        erros: 0,
        errosPorTema: { equacao_1grau: 0, funcao_quadratica: 0, porcentagem: 0 },
        dicasUsadas: 0
      });
      setExibirPainelProfessor(false);
    }
  };

  // Dados formatados para o gráfico do Recharts
  const dadosGraficoErros = [
    { nome: 'Eq. 1º Grau', erros: stats.errosPorTema.equacao_1grau, cor: '#60a5fa' },
    { nome: 'Função Quad.', erros: stats.errosPorTema.funcao_quadratica, cor: '#c084fc' },
    { nome: 'Porcentagem', erros: stats.errosPorTema.porcentagem, cor: '#f59e0b' },
  ];

  const taxaAproveitamento = stats.totalRespondidas > 0 
    ? ((stats.acertos / stats.totalRespondidas) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 flex flex-col items-center">
      <div className="w-full max-w-lg bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-6">
        
        {/* Cabeçalho */}
        <header className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-50 flex items-center gap-2">
              MathBridge
            </h1>
            <p className="text-xs text-slate-400">A Ponte da Matemática</p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full font-semibold text-sm">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>{xp} XP</span>
          </div>
        </header>

        {/* Seleção de Dificuldade */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
            Dificuldade:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Fácil', 'Médio', 'Difícil'].map((nivel) => (
              <button
                key={nivel}
                onClick={() => setDificuldade(nivel)}
                className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  dificuldade === nivel
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {nivel}
              </button>
            ))}
          </div>
        </div>

        {/* Seleção de Conteúdo */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
            Escolha o Tópico:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleGerarPergunta('equacao_1grau')}
              className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-xs font-medium text-center transition"
            >
              Equação 1º Grau
            </button>
            <button
              onClick={() => handleGerarPergunta('funcao_quadratica')}
              className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-xs font-medium text-center transition"
            >
              Função Quadrática
            </button>
            <button
              onClick={() => handleGerarPergunta('porcentagem')}
              className="p-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-xs font-medium text-center transition"
            >
              Porcentagem
            </button>
          </div>
        </div>

        {/* Card do Desafio */}
        {questao ? (
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5 mb-6">
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
              {questao.formula}
            </span>

            <p className="mt-4 text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {questao.texto}
            </p>

            <form onSubmit={handleVerificarResposta} className="mt-6 flex flex-col gap-3">
              <input
                type="number"
                step="any"
                value={respostaUsuario}
                onChange={(e) => setRespostaUsuario(e.target.value)}
                placeholder="Sua resposta..."
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-center text-lg text-white focus:outline-none focus:border-blue-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePedirDica}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg py-2 text-xs font-semibold transition"
                >
                  <Lightbulb className="w-4 h-4" />
                  Dica ({dicaNivel}/3)
                </button>

                <button
                  type="submit"
                  className="flex-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg py-2 text-sm transition"
                >
                  Verificar
                </button>
              </div>
            </form>

            {/* Feedback Visual */}
            {mensagemStatus && (
              <div className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
                mensagemStatus.tipo === 'sucesso' 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
              }`}>
                {mensagemStatus.texto}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-900/30 border border-dashed border-slate-700 rounded-xl mb-6">
            <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Selecione um tópico acima para iniciar o desafio!</p>
          </div>
        )}

        {/* Botão para abrir o Minigame Arcade */}
        <button
          onClick={() => setExibirJogoArcade(true)}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-xs font-semibold transition mb-3"
        >
          🎮 Jogar Modo Arcade (Digitação & Ação)
        </button>

        {/* Acesso ao Diagnóstico do Professor */}
        <button
          onClick={() => setExibirPainelProfessor(true)}
          className="w-full flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 py-2.5 rounded-lg text-xs font-semibold transition"
        >
          <BarChart2 className="w-4 h-4" />
          Diagnóstico do Professor
        </button>

      </div>

      {/* Modal de Dicas */}
      {exibirDicaModal && questao && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5" /> Ajuda Pedagógica
            </h3>
            <div className="space-y-3">
              {questao.dicas.slice(0, dicaNivel).map((dica, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3 rounded-lg text-xs text-slate-300 border border-slate-700">
                  {dica}
                </div>
              ))}
              {dicaNivel === 0 && (
                <p className="text-xs text-slate-400">Clique em 'Pedir Dica' para desbloquear o primeiro nível de ajuda.</p>
              )}
            </div>
            <button
              onClick={() => setExibirDicaModal(false)}
              className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold py-2 rounded-lg"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

          {/* Modal do Jogo Arcade (HTML em iframe) */}
      {exibirJogoArcade && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 z-50 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 max-w-md w-full my-auto flex flex-col items-center shadow-2xl">
            
            {/* Cabeçalho do Modal */}
            <div className="flex justify-between items-center w-full mb-3">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                🎮 MathBridge - Modo Arcade
              </h3>
              <button
                onClick={() => setExibirJogoArcade(false)}
                className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 text-xs px-3 py-1 rounded-lg transition"
              >
                Fechar
              </button>
            </div>
            
            {/* Frame do Jogo Ajustado */}
          <iframe
            src={`${import.meta.env.BASE_URL}jogo_matematica.html`}
            title="MathBridge Arcade Game"
            className="w-full h-[730px] rounded-lg border border-slate-700 bg-[#0f172a]"
          />
          </div>
        </div>
      )}

      {/* Modal do Painel do Professor */}
      {exibirPainelProfessor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-blue-400" /> Diagnóstico de Defasagens
            </h3>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Respondidas</span>
                <span className="text-sm font-bold text-white">{stats.totalRespondidas}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Aproveit.</span>
                <span className="text-sm font-bold text-emerald-400">{taxaAproveitamento}%</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block uppercase">Dicas Usadas</span>
                <span className="text-sm font-bold text-amber-400">{stats.dicasUsadas}</span>
              </div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 mb-6">
              <span className="text-xs font-semibold text-slate-300 block mb-3">
                Distribuição de Erros por Conteúdo:
              </span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficoErros} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="nome" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#f8fafc' }}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    <Bar dataKey="erros" radius={[4, 4, 0, 0]}>
                      {dadosGraficoErros.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleResetarDados}
                className="flex items-center justify-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold px-3 py-2 rounded-lg transition"
                title="Resetar dados"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Resetar
              </button>
              <button
                onClick={() => setExibirPainelProfessor(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>

        
      )}

    </div>
  );
}