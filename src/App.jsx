import { useState, useRef } from "react";

// ─── ESTILOS E FONTE ─────────────────────────────────────────────────
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:3px;background:#020507}::-webkit-scrollbar-thumb{background:#0D1525;border-radius:2px}`;

const C = {
  bg: "#020507", card: "#060C18", border: "#0C1628",
  text: "#DCE4F0", muted: "#344560", dim: "#08111E",
  gold: "#D4A017", green: "#10B981", red: "#EF4444",
  blue: "#3B82F6", orange: "#F59E0B", purple: "#8B5CF6", teal: "#06B6D4",
};

// ─── PARTIDOS ─────────────────────────────────────────────────────────
const PARTIDOS = [
  { id: "pt", nome: "PT", full: "Partido dos Trabalhadores", spec: "esquerda", cor: "#CC0000", icon: "⭐" },
  { id: "psol", nome: "PSOL", full: "Part. Socialismo e Liberdade", spec: "esquerda", cor: "#E05000", icon: "🌅" },
  { id: "rede", nome: "REDE", full: "Rede Sustentabilidade", spec: "esquerda", cor: "#009966", icon: "🌿" },
  { id: "mdb", nome: "MDB", full: "Mov. Democrático Brasileiro", spec: "centro", cor: "#4A90D9", icon: "🔷" },
  { id: "psd", nome: "PSD", full: "Partido Social Democrático", spec: "centro", cor: "#2E7D32", icon: "🌱" },
  { id: "uniao", nome: "UNIÃO", full: "União Brasil", spec: "centro-direita", cor: "#1565C0", icon: "🇧🇷" },
  { id: "pp", nome: "PP", full: "Progressistas", spec: "centro-direita", cor: "#0D47A1", icon: "🏛️" },
  { id: "pl", nome: "PL", full: "Partido Liberal", spec: "direita", cor: "#1A237E", icon: "🦁" },
  { id: "novo", nome: "NOVO", full: "Partido Novo", spec: "direita", cor: "#E65100", icon: "🆕" },
  { id: "rep", nome: "REP", full: "Republicanos", spec: "direita", cor: "#37474F", icon: "✝️" },
];

// ─── PERSONALIDADES ───────────────────────────────────────────────────
const PERSONALIDADES = [
  { id: "ideologo", nome: "Ideólogo", icon: "📖", cor: C.blue,
    desc: "Vota pela convicção. Rígido nos princípios, mas genuíno.",
    bonus: { integridade: 20, popularidade: 5, dinheiro: 0 },
    passiva: "Trair ideologia: -15 integridade." },
  { id: "pragmatico", nome: "Pragmático", icon: "🤝", cor: C.teal,
    desc: "Negocia qualquer coisa. Eficiente, mas sem princípios fixos.",
    bonus: { integridade: 0, popularidade: 5, dinheiro: 40000 },
    passiva: "Mídia vigia com lupa." },
  { id: "populista", nome: "Populista", icon: "📢", cor: C.orange,
    desc: "Diz o que o povo quer ouvir.",
    bonus: { integridade: -5, popularidade: 25, dinheiro: 0 },
    passiva: "Popularidade cai o dobro quando a realidade bate." },
  { id: "corrupto", nome: "Oportunista", icon: "💸", cor: C.gold,
    desc: "Aceita favores. Cresce rápido. Vive com medo da imprensa.",
    bonus: { integridade: -20, popularidade: 0, dinheiro: 100000 },
    passiva: "30% de chance de escândalo por mandato." },
  { id: "tecnico", nome: "Técnico", icon: "📊", cor: C.purple,
    desc: "Sabe de tudo mas não sabe fazer política.",
    bonus: { integridade: 15, popularidade: -5, dinheiro: 0 },
    passiva: "Leis com +20% de chance de aprovação." },
];

// ─── BANCADAS / PAUTAS ────────────────────────────────────────────────
const BANCADAS = [
  { id: "evangelica", nome: "Evangélica", icon: "✝️", cor: "#7C3AED" },
  { id: "ruralista", nome: "Ruralista", icon: "🌾", cor: "#92400E" },
  { id: "trabalhista", nome: "Trabalhista", icon: "⚒️", cor: "#DC2626" },
  { id: "empresarial", nome: "Empresarial", icon: "💼", cor: "#059669" },
  { id: "seguranca", nome: "Segurança Pública", icon: "🚔", cor: "#374151" },
  { id: "ambiental", nome: "Ambiental", icon: "🌿", cor: "#10B981" },
  { id: "lgbtq", nome: "Diversidade", icon: "🏳️‍🌈", cor: "#EC4899" },
  { id: "progressista", nome: "Progressista", icon: "✊", cor: "#F59E0B" },
];

// ─── CARGOS ───────────────────────────────────────────────────────────
const CARGOS = {
  vereador: { nome: "Vereador", icon: "🏙️", nivel: 1, mandato: 4, salarioMensal: 8000, minIdade: 18, eleicaoBase: 40,
    descricao: "Câmara Municipal. Legisla localmente." },
  deputado: { nome: "Deputado Estadual", icon: "🏛️", nivel: 2, mandato: 4, salarioMensal: 25000, minIdade: 18, eleicaoBase: 50,
    descricao: "Assembleia Legislativa." },
  deputadoFed: { nome: "Deputado Federal", icon: "🏟️", nivel: 3, mandato: 4, salarioMensal: 35000, minIdade: 21, eleicaoBase: 55,
    descricao: "Câmara dos Deputados." },
  senador: { nome: "Senador", icon: "⭐", nivel: 4, mandato: 8, salarioMensal: 35000, minIdade: 35, eleicaoBase: 60,
    descricao: "Senado Federal." },
  governador: { nome: "Governador", icon: "🗺️", nivel: 4, mandato: 4, salarioMensal: 30000, minIdade: 30, eleicaoBase: 58,
    descricao: "Chefe do Executivo estadual." },
  prefeito: { nome: "Prefeito", icon: "🏢", nivel: 2, mandato: 4, salarioMensal: 20000, minIdade: 21, eleicaoBase: 55,
    descricao: "Prefeito municipal. Administra a cidade, sanciona leis." },
  presidente: { nome: "Presidente", icon: "🎖️", nivel: 5, mandato: 4, salarioMensal: 30934, minIdade: 35, eleicaoBase: 65,
    descricao: "Chefe de Estado e de Governo." },
};

// ─── AÇÕES EXCLUSIVAS POR CARGO ───────────────────────────────────────
const ACOES_CARGO = {
  presidente: [
    { id: "vetar", nome: "Vetar projeto", desc: "Veta uma lei do Congresso.", efeito: (char, notify, upChar) => {
      notify("Você vetou o projeto.", "warn");
      upChar(c => { c.popularidade = clamp(c.popularidade - 3); c.integridade = clamp(c.integridade + 5); });
    }},
    { id: "mp", nome: "Medida Provisória", desc: "Edita MP com força de lei.", efeito: (char, notify, upChar) => {
      notify("MP editada!", "ok");
      upChar(c => { c.popularidade = clamp(c.popularidade + 5); c.visibilidade = clamp(c.visibilidade + 15); });
    }},
    { id: "indicarSTF", nome: "Indicar ministro do STF", desc: "Nomeia novo ministro.", efeito: (char, notify, upChar) => {
      notify("Indicação enviada ao Senado.", "ok");
      upChar(c => { c.visibilidade = clamp(c.visibilidade + 20); });
    }},
  ],
  governador: [
    { id: "vetarEst", nome: "Vetar lei estadual", desc: "Veta projeto da Assembleia.", efeito: (char, notify, upChar) => {
      notify("Veto estadual aplicado.", "warn");
      upChar(c => { c.popularidade = clamp(c.popularidade - 3); c.integridade = clamp(c.integridade + 5); });
    }},
    { id: "decretarCalamidade", nome: "Decretar calamidade", desc: "Ajuda áreas afetadas.", efeito: (char, notify, upChar) => {
      if (char.dinheiro < 50000) return notify("Sem verba!", "err");
      upChar(c => { c.dinheiro -= 50000; c.popularidade = clamp(c.popularidade + 12); });
      notify("Calamidade decretada.", "ok");
    }},
  ],
  prefeito: [
    { id: "sancionar", nome: "Sancionar lei municipal", desc: "Aprova projeto da Câmara.", efeito: (char, notify, upChar) => {
      notify("Lei municipal sancionada.", "ok");
      upChar(c => { c.popularidade = clamp(c.popularidade + 3); });
    }},
    { id: "decreto", nome: "Decreto de emergência", desc: "Ações rápidas em crise.", efeito: (char, notify, upChar) => {
      notify("Decreto municipal publicado.", "warn");
      upChar(c => { c.visibilidade = clamp(c.visibilidade + 12); c.dinheiro = Math.max(0, c.dinheiro - 20000); });
    }},
    { id: "orçamento", nome: "Realocar orçamento", desc: "Redistribui verbas.", efeito: (char, notify, upChar) => {
      notify("Acesse a aba Orçamento para ajustar as verbas.", "info");
    }},
  ],
  senador: [
    { id: "sabatina", nome: "Convocar sabatina", desc: "Sabatina de autoridade indicada.", efeito: (char, notify, upChar) => {
      upChar(c => { c.visibilidade = clamp(c.visibilidade + 25); });
      notify("Sabatina iniciada.", "ok");
    }},
    { id: "cpi", nome: "Instaurar CPI", desc: "CPI para investigar escândalo.", efeito: (char, notify, upChar) => {
      upChar(c => { c.visibilidade = clamp(c.visibilidade + 20); c.integridade = clamp(c.integridade + 8); });
      notify("CPI instaurada.", "ok");
    }},
  ],
  deputadoFed: [
    { id: "emenda", nome: "Emenda parlamentar", desc: "R$100 mil para sua base.", efeito: (char, notify, upChar) => {
      if (char.dinheiro < 100000) return notify("Saldo insuficiente!", "err");
      upChar(c => { c.dinheiro -= 100000; c.popularidade = clamp(c.popularidade + 15); });
      notify("Emenda enviada.", "ok");
    }},
  ],
  deputado: [
    { id: "fiscalizar", nome: "Fiscalizar governo", desc: "Denunciar irregularidades.", efeito: (char, notify, upChar) => {
      upChar(c => { c.visibilidade = clamp(c.visibilidade + 15); c.integridade = clamp(c.integridade + 5); });
      notify("Denúncia repercute.", "ok");
    }},
  ],
  vereador: [
    { id: "requerimento", nome: "Requerimento", desc: "Questionar prefeitura.", efeito: (char, notify, upChar) => {
      upChar(c => { c.visibilidade = clamp(c.visibilidade + 10); });
      notify("Requerimento protocolado.", "ok");
    }},
  ],
};

// ─── LEIS ──────────────────────────────────────────────────────────────
const LEIS = {
  vereador: [
    { id: "lv1", titulo: "Lei do Silêncio Noturno", desc: "Proibir ruídos após 22h.", efeitos: { popularidade: 8, integridade: 5, dinheiro: -500 } },
    { id: "lv2", titulo: "Gratuidade no Ônibus para Idosos", desc: "Isenção de tarifa para maiores de 65 anos.", efeitos: { popularidade: 18, integridade: 8, dinheiro: -8000 } },
  ],
  deputado: [
    { id: "ld1", titulo: "Cotas Estaduais para PCDs", desc: "10% das vagas em concursos para PCDs.", efeitos: { popularidade: 12, integridade: 10, dinheiro: -5000 } },
  ],
  deputadoFed: [
    { id: "ldf1", titulo: "Piso da Enfermagem Federal", desc: "R$4.750 para enfermeiros do SUS.", efeitos: { popularidade: 20, integridade: 15, dinheiro: -50000 } },
  ],
  senador: [
    { id: "ls1", titulo: "Lei de Responsabilidade Climática", desc: "Metas obrigatórias de emissão.", efeitos: { popularidade: 10, integridade: 15, dinheiro: -15000 } },
  ],
  governador: [
    { id: "lg1", titulo: "Programa Estadual de Renda Mínima", desc: "R$200/mês para famílias carentes.", efeitos: { popularidade: 22, integridade: 12, dinheiro: -200000 } },
  ],
  prefeito: [
    { id: "lp1", titulo: "IPTU Verde", desc: "Desconto no IPTU para imóveis com práticas sustentáveis.", efeitos: { popularidade: 15, integridade: 10, dinheiro: -30000 } },
  ],
  presidente: [
    { id: "lpr1", titulo: "Sancionei: Piso da Enfermagem", desc: "Transformei em lei o piso dos enfermeiros.", efeitos: { popularidade: 18, integridade: 15, dinheiro: -100000 } },
  ],
};

// ─── CRISES ────────────────────────────────────────────────────────────
const CRISES = {
  vereador: [
    { id: "v1", titulo: "Buraco na Rua do Bairro Popular", icon: "🕳️",
      desc: "Moradores do Jardim Esperança te pedem ajuda. Um buraco enorme causa acidentes.",
      opcoes: [
        { texto: "Protocolar requerimento e pressionar secretário", efeitos: { popularidade: 15, integridade: 8, dinheiro: -1000, visibilidade: 10 },
          memoria: "Você foi atrás do buraco.", consequencia: "Viralizou nas redes locais." },
        { texto: "Gravar vídeo explosivo nas redes", efeitos: { popularidade: 20, integridade: -3, dinheiro: 0, visibilidade: 25 },
          memoria: "Você fez barulho, mas a rua continua igual.", consequencia: "Viral, mas sem solução." },
        { texto: "Usar emenda para contratar obra", efeitos: { popularidade: 25, integridade: 12, dinheiro: -15000, visibilidade: 8 },
          memoria: "Você pagou a obra do próprio bolso.", consequencia: "Rua consertada. Bairro grato." },
        { texto: "Ignorar — pequeno demais para seu cargo", efeitos: { popularidade: -20, integridade: -10, dinheiro: 0, visibilidade: 3 },
          memoria: "Você ignorou.", consequencia: "Moradores fazem faixa contra você." },
      ] },
    { id: "v_propina", titulo: "Empresário Oferece Propina", icon: "💼",
      desc: "Empresário local oferece R$80.000 por sua aprovação em licitação superfaturada.",
      opcoes: [
        { texto: "Aceitar e aprovar a licitação", efeitos: { popularidade: -5, integridade: -40, dinheiro: 80000 },
          memoria: "Você vendeu seu voto.", consequencia: "Licitação aprovada. Um jornalista fareja.",
          riscoInvestigacao: 60 },
        { texto: "Recusar e denunciar ao MP", efeitos: { popularidade: 15, integridade: 25, dinheiro: 0 },
          memoria: "Você recusou a propina e denunciou.", consequencia: "Empresário investigado.",
          riscoInvestigacao: 0 },
        { texto: "Aceitar, mas gravar para chantagem", efeitos: { popularidade: 0, integridade: -20, dinheiro: 80000 },
          memoria: "Você ficou com a gravação.", consequencia: "Empresário nas suas mãos. Risco se vazar.",
          riscoInvestigacao: 30 },
      ] },
  ],
  deputado: [
    { id: "d1", titulo: "Privatização do Transporte Estadual", icon: "🚌",
      desc: "O governador quer privatizar o transporte. Greve na rua, empresários apoiam.",
      opcoes: [
        { texto: "Votar contra e liderar resistência", efeitos: { popularidade: 15, integridade: 10, dinheiro: 0, visibilidade: 20 },
          memoria: "Você liderou a resistência.", consequencia: "Projeto derrotado." },
        { texto: "Votar a favor com emendas", efeitos: { popularidade: 5, integridade: 5, dinheiro: 30000, visibilidade: 10 },
          memoria: "Privatização aprovada com emendas.", consequencia: "Emendas descumpridas." },
        { texto: "Propor concessão público-privada", efeitos: { popularidade: 8, integridade: 8, dinheiro: 0, visibilidade: 15 },
          memoria: "Modelo alternativo aprovado.", consequencia: "Seu modelo vira referência." },
        { texto: "Aceitar financiamento da empresa", efeitos: { popularidade: -15, integridade: -25, dinheiro: 80000, visibilidade: 5 },
          memoria: "Você vendeu seu voto.", consequencia: "CPI ameaça." },
      ] },
  ],
  prefeito: [
    { id: "pr1", titulo: "Enchente no Município", icon: "🌊",
      desc: "Chuvas deixaram 500 famílias desabrigadas. O governador oferece ajuda, mas quer controlar a verba.",
      opcoes: [
        { texto: "Aceitar ajuda estadual", efeitos: { popularidade: 10, integridade: -5, dinheiro: 50000 },
          memoria: "Verba chegou rápido, mas o governador levou o crédito.", consequencia: "Você ficou à sombra." },
        { texto: "Usar reservas municipais e liderar", efeitos: { popularidade: 20, integridade: 12, dinheiro: -80000 },
          memoria: "Você coordenou a resposta.", consequencia: "População ovaciona você." },
        { texto: "Criar campanha de doação nacional", efeitos: { popularidade: 15, integridade: 15, dinheiro: -5000, visibilidade: 20 },
          memoria: "Campanha viralizou.", consequencia: "Recursos vieram sem depender do estado." },
      ] },
  ],
  presidente: [
    { id: "p1", titulo: "Crise Econômica: Dólar a R$8", icon: "💵",
      desc: "Dólar disparou. Inflação em 12%. FMI oferece empréstimo com condicionantes sociais.",
      opcoes: [
        { texto: "Aceitar o corte para estabilizar a moeda", efeitos: { popularidade: -20, integridade: -5, dinheiro: 200000 },
          memoria: "Cortou programas sociais.", consequencia: "Moeda estabiliza, povo paga a conta." },
        { texto: "Rejeitar cortes e taxar fortunas", efeitos: { popularidade: 15, integridade: 12, dinheiro: -50000, visibilidade: 20 },
          memoria: "Taxou os ricos.", consequencia: "Mercado agita, mas receita evita pior." },
        { texto: "Renegociar com FMI sem condicionantes", efeitos: { popularidade: 8, integridade: 10, dinheiro: 80000, visibilidade: 15 },
          memoria: "Negociação diplomática.", consequencia: "Acordo melhor que o esperado." },
        { texto: "Decretar controle de capitais", efeitos: { popularidade: -5, integridade: 5, dinheiro: 0, visibilidade: 15 },
          memoria: "Controle de capitais.", consequencia: "Especulação parou, dólar caiu 15%." },
      ] },
  ],
};

// ─── PARLAMENTARES (suborno) ──────────────────────────────────────────
const PARLAMENTARES = [
  { id: "dep1", nome: "Dep. Francisco Neto", preco: 50000, risco: 15, votos: 3 },
  { id: "dep2", nome: "Dep. Maria do Rosário", preco: 80000, risco: 10, votos: 5 },
  { id: "dep3", nome: "Sen. Carlos Bitencourt", preco: 150000, risco: 20, votos: 8 },
  { id: "dep4", nome: "Dep. Jair Barbosa", preco: 30000, risco: 25, votos: 2 },
  { id: "dep5", nome: "Sen. Ana Lúcia", preco: 120000, risco: 12, votos: 6 },
];

// ─── MINISTÉRIOS (coalizão) ────────────────────────────────────────────
const MINISTERIOS = [
  { id: "saude", nome: "Saúde", verba: 50000000, partidos: ["pt", "psd", "mdb"] },
  { id: "fazenda", nome: "Fazenda", verba: 30000000, partidos: ["psd", "uniao", "pp"] },
  { id: "educacao", nome: "Educação", verba: 20000000, partidos: ["pt", "psol", "rede"] },
  { id: "infra", nome: "Infraestrutura", verba: 40000000, partidos: ["pp", "pl", "uniao"] },
];

// ─── JORNAIS ──────────────────────────────────────────────────────────
const JORNAIS = [
  { nome: "Folha de São Paulo", vies: "centro", cor: "#1A237E" },
  { nome: "O Globo", vies: "centro-direita", cor: "#006437" },
  { nome: "Estadão", vies: "direita", cor: "#CC0000" },
  { nome: "Brasil 247", vies: "esquerda", cor: "#E53935" },
  { nome: "Jornal Nacional", vies: "centro", cor: "#0D47A1" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────
const clamp = (v, mn = 0, mx = 100) => Math.max(mn, Math.min(mx, v));
const fmt = n => n >= 1e6 ? `R$${(n / 1e6).toFixed(1)}M` : n >= 1000 ? `R$${(n / 1000).toFixed(0)}k` : `R$${n}`;
const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const getPartido = id => PARTIDOS.find(p => p.id === id);
const getCargo = id => CARGOS[id];

const chancesEleicao = (char, cargo, gasto = 0) => {
  const info = getCargo(cargo);
  if (!info) return 5;
  const base = info.eleicaoBase || 50;
  const pop = char.popularidade, vis = char.visibilidade, intg = char.integridade;
  const exp = char.historicoCargos.filter(h => h.cargo === cargo).length * 5;
  const salarioRef = info.salarioMensal * 12;
  const gastoRatio = Math.min(gasto / Math.max(salarioRef, 1), 3);
  const bonusDinheiro = Math.round(gastoRatio * 12);
  const espectroCargo = {
    vereador: { esquerda: 40, centro: 40, direita: 20 },
    deputado: { esquerda: 45, centro: 35, direita: 20 },
    deputadoFed: { esquerda: 45, centro: 30, direita: 25 },
    senador: { esquerda: 40, centro: 30, direita: 30 },
    governador: { esquerda: 35, centro: 35, direita: 30 },
    prefeito: { esquerda: 40, centro: 35, direita: 25 },
    presidente: { esquerda: 40, centro: 30, direita: 30 },
  }[cargo] || { esquerda: 33, centro: 34, direita: 33 };
  const partido = getPartido(char.partido);
  const spec = partido?.spec || "centro";
  const alinhamento = espectroCargo[spec] || 33;
  const bonusIdeologia = Math.round((alinhamento - 33) * 0.5);
  const raw = (pop * 0.25) + (vis * 0.15) + (intg * 0.1) + exp + bonusDinheiro + bonusIdeologia - base + 40;
  return clamp(Math.round(raw), 5, 92);
};

// ─── COMPONENTES DE UI ────────────────────────────────────────────────
const Pill = ({ c, children, sm }) => (
  <span style={{ fontSize: sm ? 9 : 10, padding: sm ? "1px 7px" : "2px 9px", borderRadius: 12,
    background: c + "18", color: c, border: `1px solid ${c}28`, fontFamily: "'Space Mono',monospace", whiteSpace: "nowrap" }}>
    {children}
  </span>
);
const Notif = ({ n }) => n ? (
  <div style={{ position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: C.card,
    border: `1px solid ${n.t === "err" ? C.red : n.t === "ok" ? C.green : n.t === "warn" ? C.orange : C.blue}`,
    borderRadius: 10, padding: "10px 22px", fontSize: 11, color: C.text, maxWidth: "92vw", textAlign: "center",
    boxShadow: "0 8px 40px #000000AA", fontFamily: "'Space Mono',monospace" }}>
    {n.m}
  </div>
) : null;
const MiniBar = ({ v, c = C.blue, label, icon }) => {
  const pv = Math.max(0, Math.min(100, v));
  const col = pv >= 60 ? c : pv >= 35 ? C.orange : C.red;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: "'Space Mono',monospace" }}>{icon} {label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: col, fontFamily: "'Space Mono',monospace" }}>{pv}%</span>
      </div>
      <div style={{ height: 3, background: C.dim, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pv}%`, background: col, borderRadius: 2, transition: "width .6s ease" }} />
      </div>
    </div>
  );
};

// ════════════════════════ COMPONENTE PRINCIPAL ════════════════════════
export default function PoliticoGame() {
  const [state, setState] = useState("criacao");
  const [char, setChar] = useState({
    nome: "", idade: 18, ano: 2025,
    partido: null, personalidade: null, cargo: null,
    bancadaDefendida: [],
    popularidade: 20, visibilidade: 10, integridade: 70,
    dinheiro: 30000, patrimonio: 30000,
    mandatosRestantes: 0,
    historicoCargos: [], leisAprovadas: [], leisRejeitadas: [],
    decisoesTomadas: {}, memorias: [],
    totalVitoriasEleitorais: 0, totalDerrotasEleitorais: 0,
    logEventos: [], escandaloAtivo: false, aposentado: false,
    riscoInvestigacao: 0, lealdadePartido: 70, dossies: 0,
  });
  const [eleicaoCargo, setEleicaoCargo] = useState(null);
  const [criseAtual, setCriseAtual] = useState(null);
  const [leiAtual, setLeiAtual] = useState(null);
  const [tab, setTab] = useState("painel");
  const [notif, setNotif] = useState(null);
  const [trocaPartido, setTrocaPartido] = useState(false);
  const [criseUsadas, setCriseUsadas] = useState([]);
  const ntRef = useRef(null);

  const [aliados, setAliados] = useState([
    { id: "aliado1", nome: "Dep. Carlos Motta", cargo: "deputadoFed", partido: "mdb", exigencia: "Cargo de Ministro", satisfacao: 50 },
    { id: "aliado2", nome: "Sen. Lúcia Helena", cargo: "senador", partido: "psd", exigencia: "Verba para base", satisfacao: 50 },
  ]);
  const [parlamentaresComprados, setParlamentaresComprados] = useState([]);
  const [apoioCongresso, setApoioCongresso] = useState(20);
  const [orcamento, setOrcamento] = useState({ saude: 30, educacao: 25, seguranca: 20, infraestrutura: 15, outros: 10 });

  const notify = (m, t = "info") => {
    setNotif({ m, t });
    if (ntRef.current) clearTimeout(ntRef.current);
    ntRef.current = setTimeout(() => setNotif(null), 4000);
  };
  const upChar = (fn) => setChar(prev => { const n = { ...prev }; fn(n); return n; });
  const addLog = (c, texto) => {
    c.logEventos = [...c.logEventos, { texto, ano: c.ano, cargo: c.cargo || "civil" }];
  };

  // ── CRIAÇÃO ─────────────────────────────────────────────────────────
  const handleCriacao = (dados) => {
    const pers = PERSONALIDADES.find(p => p.id === dados.personalidade);
    setChar({
      ...char,
      ...dados,
      popularidade: clamp(20 + (pers?.bonus.popularidade || 0)),
      integridade: clamp(70 + (pers?.bonus.integridade || 0)),
      dinheiro: 30000 + (pers?.bonus.dinheiro || 0),
      patrimonio: 30000 + (pers?.bonus.dinheiro || 0),
      logEventos: [{ texto: `${dados.nome} inicia carreira pelo ${getPartido(dados.partido)?.full}`, ano: 2025, cargo: "civil" }],
    });
    setEleicaoCargo("vereador");
    setState("eleicao");
  };

  // ── ELEIÇÃO ─────────────────────────────────────────────────────────
  const handleEleicao = (cargo, gasto) => {
    const chance = chancesEleicao(char, cargo, gasto);
    const ganhou = Math.random() * 100 < chance;
    upChar(c => {
      c.dinheiro = Math.max(0, c.dinheiro - gasto);
      c.patrimonio = Math.max(0, c.patrimonio - gasto);
      if (ganhou) {
        c.cargo = cargo;
        c.mandatosRestantes = CARGOS[cargo].mandato;
        c.totalVitoriasEleitorais++;
        c.historicoCargos = [...c.historicoCargos, { cargo, ano: c.ano, partido: c.partido }];
        addLog(c, `✅ ELEITO ${CARGOS[cargo].nome} pelo ${getPartido(c.partido)?.nome}.`);
        notify(`🎉 ELEITO ${CARGOS[cargo].nome}!`, "ok");
      } else {
        c.totalDerrotasEleitorais++;
        c.popularidade = clamp(c.popularidade - 8);
        addLog(c, `❌ Derrota para ${CARGOS[cargo].nome}.`);
        notify("😞 Você perdeu a eleição.", "err");
      }
    });
    setState("mandato");
    setCriseUsadas([]);
    setTab("painel");
  };

  // ── CRISE ────────────────────────────────────────────────────────────
  const triggerCrise = () => {
    const pool = (CRISES[char.cargo] || []).filter(c => !criseUsadas.includes(c.id));
    if (!pool.length) { notify("Todas as crises deste mandato foram enfrentadas.", "info"); return; }
    const c = rand(pool);
    setCriseUsadas(p => [...p, c.id]);
    setCriseAtual(c);
    setState("crise");
  };

  const handleEscolhaCrise = (opcao) => {
    upChar(c => {
      c.popularidade = clamp(c.popularidade + (opcao.efeitos.popularidade || 0));
      c.integridade = clamp(c.integridade + (opcao.efeitos.integridade || 0));
      c.dinheiro = Math.max(0, c.dinheiro + (opcao.efeitos.dinheiro || 0));
      c.visibilidade = clamp(c.visibilidade + (opcao.efeitos.visibilidade || 0));
      c.memorias = [...c.memorias, { texto: opcao.memoria, ano: c.ano, cargo: c.cargo }];
      c.decisoesTomadas = { ...c.decisoesTomadas, [criseAtual.id]: opcao.texto };
      addLog(c, `⚡ ${criseAtual.titulo}: "${opcao.texto}" → ${opcao.consequencia}`);
      if (opcao.riscoInvestigacao) {
        c.riscoInvestigacao = clamp((c.riscoInvestigacao || 0) + opcao.riscoInvestigacao);
        if (c.riscoInvestigacao > 70 && Math.random() < 0.5) {
          addLog(c, "🚨 Risco acumulado! PF pode estar a caminho...");
          notify("🚔 Você está na mira da Polícia Federal!", "err");
        }
      }
      c.mandatosRestantes -= 1;
      c.ano += 1;
      c.idade += 1;
      if (c.mandatosRestantes <= 0) {
        addLog(c, `📅 Fim do mandato de ${getCargo(c.cargo)?.nome}.`);
        c.cargo = null;
        c.mandatosRestantes = 0;
        notify("Mandato encerrado.", "info");
      }
    });
    notify(opcao.consequencia, "warn");
    setCriseAtual(null);
    setState("mandato");
    setTab("painel");
  };

  // ── FIM DE MANDATO VOLUNTÁRIO ────────────────────────────────────────
  const fimDeMandato = () => {
    upChar(c => {
      const anosFaltantes = c.mandatosRestantes;
      c.ano += anosFaltantes;
      c.idade += anosFaltantes;
      c.mandatosRestantes = 0;
      addLog(c, `📅 Mandato encerrado voluntariamente.`);
      c.cargo = null;
    });
    notify("Mandato encerrado.", "info");
    setState("mandato");
  };

  // ── AVANÇAR ANO SEM MANDATO ─────────────────────────────────────────
  const avancarAno = (quantos = 1) => {
    upChar(c => {
      c.ano += quantos;
      c.idade += quantos;
      addLog(c, `⏳ Avançou ${quantos} ano(s) como civil.`);
      c.dinheiro = Math.max(0, c.dinheiro - 5000 * quantos); // gastos básicos
    });
    notify(`Avançou ${quantos} ano(s).`);
  };

  // ── LEIS ──────────────────────────────────────────────────────────────
  const handleVotarLei = (lei, votar, votosComprados = 0) => {
    if (!votar) {
      upChar(c => {
        c.leisRejeitadas = [...c.leisRejeitadas, lei.titulo];
        addLog(c, `🚫 Lei rejeitada: ${lei.titulo}`);
      });
      notify("Lei não proposta.", "info");
      setLeiAtual(null); setState("mandato"); return;
    }
    const base = 40 + (char.popularidade * 0.3) + (char.visibilidade * 0.2) + (votosComprados * 4);
    const aprov = Math.random() * 100 < Math.min(95, base);
    upChar(c => {
      if (aprov) {
        c.popularidade = clamp(c.popularidade + (lei.efeitos.popularidade || 0));
        c.integridade = clamp(c.integridade + (lei.efeitos.integridade || 0));
        c.dinheiro = Math.max(0, c.dinheiro + (lei.efeitos.dinheiro || 0));
        c.leisAprovadas = [...c.leisAprovadas, { titulo: lei.titulo, ano: c.ano }];
        addLog(c, `✅ Lei aprovada: ${lei.titulo}`);
      } else {
        c.leisRejeitadas = [...c.leisRejeitadas, lei.titulo];
        addLog(c, `❌ Lei rejeitada: ${lei.titulo}`);
      }
    });
    notify(aprov ? `✅ ${lei.titulo} aprovada!` : `❌ ${lei.titulo} rejeitada.`, aprov ? "ok" : "err");
    setLeiAtual(null);
    setState("mandato");
  };

  // ── TROCA DE PARTIDO ──────────────────────────────────────────────────
  const handleTrocaPartido = (novoPartido, razao) => {
    const r = [{ id: "ideologia", integridade: 5, popularidade: -5 }, { id: "oportunismo", integridade: -15, popularidade: 8 }].find(x => x.id === razao);
    upChar(c => {
      addLog(c, `🔄 Trocou do ${getPartido(c.partido)?.nome} para ${getPartido(novoPartido)?.nome}.`);
      c.partido = novoPartido;
      c.integridade = clamp(c.integridade + (r?.integridade || 0));
      c.popularidade = clamp(c.popularidade + (r?.popularidade || 0));
      c.lealdadePartido = 70;
    });
    notify(`Migrou para ${getPartido(novoPartido)?.nome}.`, "warn");
    setTrocaPartido(false);
  };

  // ── SUBORNO ──────────────────────────────────────────────────────────
  const comprarParlamentar = (parlamentar) => {
    if (char.dinheiro < parlamentar.preco) return notify("Sem dinheiro!", "err");
    const descoberto = Math.random() * 100 < parlamentar.risco;
    upChar(c => {
      c.dinheiro = Math.max(0, c.dinheiro - parlamentar.preco);
      c.integridade = clamp(c.integridade - 15);
      c.riscoInvestigacao = clamp((c.riscoInvestigacao || 0) + (descoberto ? 40 : 10));
      if (descoberto) {
        c.popularidade = clamp(c.popularidade - 20);
        addLog(c, `🚨 ESCÂNDALO! Suborno ao ${parlamentar.nome} vazou!`);
        notify("🚨 Suborno descoberto!", "err");
      } else {
        addLog(c, `💸 ${parlamentar.nome} comprado por R$${parlamentar.preco.toLocaleString()}.`);
        notify(`✅ ${parlamentar.nome} garantiu voto.`, "ok");
      }
    });
    setParlamentaresComprados(p => [...p, parlamentar.id]);
    setApoioCongresso(p => Math.min(100, p + parlamentar.votos));
  };

  const distribuirMinisterio = (min, partidoId) => {
    if (char.dinheiro < 100000) return notify("Sem fundos!", "err");
    upChar(c => {
      c.dinheiro -= 100000;
      c.visibilidade = clamp(c.visibilidade + 8);
      addLog(c, `🏛️ Ministério da ${min.nome} entregue ao ${getPartido(partidoId)?.nome}`);
    });
    setApoioCongresso(p => Math.min(100, p + 12));
    notify(`✅ ${getPartido(partidoId)?.nome} apoia seu governo!`, "ok");
  };

  const cumprirPromessa = (aliadoId) => {
    upChar(c => {
      c.dinheiro = Math.max(0, c.dinheiro - 50000);
      addLog(c, `✅ Promessa cumprida com ${aliados.find(a => a.id === aliadoId)?.nome}.`);
      setAliados(prev => prev.map(a => a.id === aliadoId ? { ...a, satisfacao: 100 } : a));
      notify(`Promessa cumprida!`, "ok");
    });
  };
  const trairAliado = (aliadoId) => {
    upChar(c => {
      c.popularidade = clamp(c.popularidade - 10);
      c.integridade = clamp(c.integridade - 15);
      addLog(c, `💔 Traiu ${aliados.find(a => a.id === aliadoId)?.nome}.`);
      setAliados(prev => prev.map(a => a.id === aliadoId ? { ...a, satisfacao: 0 } : a));
    });
    notify(`Aliado traído!`, "err");
  };

  const executarAcaoPoder = (acao) => acao.efeito(char, notify, upChar);

  // ─── JORNAIS ────────────────────────────────────────────────────
  const gerarManchete = (evento, jornal) => {
    const noticia = evento.texto.split("→")[1] || evento.texto;
    return `${jornal.nome}: ${noticia.length > 80 ? noticia.slice(0, 77) + "..." : noticia}`;
  };

  // ═══════════════════════ RENDER ═════════════════════════════════════
  const partido = getPartido(char.partido);
  const cargo = char.cargo ? getCargo(char.cargo) : null;
  const leisDisponiveis = char.cargo ? (LEIS[char.cargo] || []).filter(l => !char.leisAprovadas.find(x => x.titulo === l.titulo) && !char.leisRejeitadas.includes(l.titulo)) : [];
  const acoesCargo = char.cargo ? ACOES_CARGO[char.cargo] || [] : [];
  const podeNegociar = char.cargo && ["presidente", "governador", "prefeito", "deputadoFed", "senador", "deputado"].includes(char.cargo);
  const podeOrcamento = ["presidente", "governador", "prefeito"].includes(char.cargo);

  if (state === "criacao") return <TelaCriacao onConfirm={handleCriacao} />;
  if (state === "eleicao") return <TelaEleicao char={char} cargo={eleicaoCargo} onConfirm={handleEleicao} />;
  if (state === "crise" && criseAtual) return <TelaCrise crise={criseAtual} char={char} partido={partido} cargo={cargo} onEscolha={handleEscolhaCrise} />;
  if (state === "lei" && leiAtual) return <TelaLei lei={leiAtual} char={char} cargo={cargo} onVotar={handleVotarLei} comprarParlamentar={comprarParlamentar} parlamentaresComprados={parlamentaresComprados} />;
  if (state === "aposentadoria") return <TelaAposentadoria char={char} partido={partido} onReinicio={() => { setChar({ ...char, nome: "", idade: 18, ano: 2025 }); setState("criacao"); }} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Syne',sans-serif" }}>
      <style>{FONT}</style>
      <Notif n={notif} />
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "12px 18px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 2 }}>
              {cargo?.icon || "🏠"} {char.nome}
            </div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2, fontFamily: "'Space Mono',monospace" }}>
              {cargo ? cargo.nome : "Sem cargo"} · {partido?.nome || "—"} · {Math.round(char.idade)} anos · {char.ano}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.gold, fontFamily: "'Space Mono',monospace" }}>{fmt(char.dinheiro)}</div>
            {cargo && <div style={{ fontSize: 9, color: C.muted, fontFamily: "'Space Mono',monospace" }}>{char.mandatosRestantes} ano(s) de mandato</div>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {[["pop.", char.popularidade, C.green], ["vis.", char.visibilidade, C.blue], ["integ.", char.integridade, C.gold]].map(([l, v, c]) => (
            <div key={l} style={{ flex: 1 }}>
              <div style={{ fontSize: 8, color: C.muted, marginBottom: 2, fontFamily: "'Space Mono',monospace" }}>{l} {Math.round(v)}%</div>
              <div style={{ height: 3, background: C.dim, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${clamp(v)}%`, background: v >= 60 ? c : v >= 35 ? C.orange : C.red, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", background: C.card, borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
        {[["painel", "⚡ Painel"], ["leis", "📜 Legislar"], ["poder", "⚡ Poder"], ["negociar", "💰 Negociar"],
        ["aliancas", "🤝 Alianças"], ["orcamento", "📊 Orçamento"], ["noticias", "📰 Notícias"],
        ["carreira", "🗺️ Carreira"], ["bancadas", "🤝 Bancadas"], ["historico", "📋 Histórico"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding: "9px 14px", background: "none", border: "none", borderBottom: `2px solid ${tab === id ? C.blue : "transparent"}`,
              color: tab === id ? C.blue : C.muted, fontSize: 10, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Space Mono',monospace" }}>
            {lbl}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: 18 }}>

        {tab === "painel" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[["👥 Popularidade", char.popularidade, C.green], ["📺 Visibilidade", char.visibilidade, C.blue],
              ["⚖️ Integridade", char.integridade, C.gold], ["💰 Dinheiro", Math.min(100, char.dinheiro / 100000 * 100), C.teal]].map(([l, v, c]) => (
                <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: "12px 14px" }}>
                  <div style={{ fontSize: 9, color: C.muted, marginBottom: 4, fontFamily: "'Space Mono',monospace" }}>{l}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: v >= 60 ? c : v >= 35 ? C.orange : C.red, fontFamily: "'Space Mono',monospace" }}>
                    {l.includes("Dinheiro") ? fmt(char.dinheiro) : `${Math.round(v)}%`}
                  </div>
                </div>
              ))}
            </div>
            {char.memorias.length > 0 && (
              <div style={{ background: `${C.purple}11`, border: `1px solid ${C.purple}33`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: C.purple, marginBottom: 8, fontFamily: "'Space Mono',monospace", letterSpacing: 1 }}>💭 MEMÓRIAS</div>
                {char.memorias.slice(-3).map((m, i) => (
                  <div key={i} style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>({m.ano}) {m.texto}</div>
                ))}
              </div>
            )}
            {cargo ? (
              <div style={{ background: C.card, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{cargo.icon} {cargo.nome}</span>
                  <Pill c={C.gold}>{char.mandatosRestantes} ano(s)</Pill>
                </div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>{cargo.descricao}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Pill c={partido?.cor || C.blue}>{partido?.icon} {partido?.nome}</Pill>
                  <Pill c={C.green}>{fmt(cargo.salarioMensal)}/mês</Pill>
                </div>
                <div style={{ marginTop: 8, fontSize: 10, color: C.muted }}>Risco de investigação: {char.riscoInvestigacao || 0}%</div>
              </div>
            ) : (
              <div style={{ background: `${C.red}11`, border: `1px solid ${C.red}33`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: C.red, fontWeight: 700, marginBottom: 4 }}>⚠️ Sem cargo ativo</div>
                <div style={{ fontSize: 11, color: C.muted }}>Vá à aba Carreira para se candidatar a um novo cargo ou avance o tempo.</div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {cargo && char.mandatosRestantes > 0 && (
                <button onClick={triggerCrise} style={{ padding: 16, background: `linear-gradient(135deg,#4A0010,${C.red})`, border: "none", borderRadius: 10, color: "#fff", fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: 2, cursor: "pointer", gridColumn: "1/-1" }}>⚡ NOVA SITUAÇÃO / CRISE</button>
              )}
              {cargo && char.mandatosRestantes > 0 && (
                <button onClick={fimDeMandato} style={{ padding: 14, background: `linear-gradient(135deg,#001A4A,${C.blue})`, border: "none", borderRadius: 10, color: "#fff", fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 2, cursor: "pointer" }}>📅 ENCERRAR MANDATO</button>
              )}
              {!cargo && (
                <button onClick={() => avancarAno(1)} style={{ padding: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.muted, fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 2, cursor: "pointer" }}>⏩ AVANÇAR 1 ANO</button>
              )}
              {!cargo && (
                <button onClick={() => avancarAno(4)} style={{ padding: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.muted, fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 2, cursor: "pointer" }}>⏩ AVANÇAR 4 ANOS</button>
              )}
              <button onClick={() => setTrocaPartido(true)} style={{ padding: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.muted, fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 2, cursor: "pointer" }}>🔄 TROCAR PARTIDO</button>
              <button onClick={() => setState("aposentadoria")} style={{ padding: 14, background: `${C.red}11`, border: `1px solid ${C.red}33`, borderRadius: 10, color: C.red, fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 2, cursor: "pointer" }}>🧓 APOSENTAR</button>
            </div>
          </div>
        )}

        {tab === "leis" && (
          <div>
            <p style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>
              {char.cargo === "presidente" ? "Sancione ou vete projetos." : "Proponha leis para votação."}
            </p>
            {leisDisponiveis.map(l => (
              <div key={l.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{l.titulo}</div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{l.desc}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => { setLeiAtual(l); setState("lei"); }} style={{ flex: 1, padding: "9px", background: `${C.gold}18`, border: `1px solid ${C.gold}44`, borderRadius: 8, color: C.gold, fontSize: 11, cursor: "pointer" }}>{char.cargo === "presidente" ? "✍️ SANCIONAR" : "📜 PROPOR"}</button>
                  <button onClick={() => { upChar(c => { c.leisRejeitadas = [...c.leisRejeitadas, l.titulo]; addLog(c, `🚫 ${l.titulo} não proposta.`); }); notify("Arquivada.", "info"); }} style={{ padding: "9px 14px", background: `${C.red}11`, border: `1px solid ${C.red}33`, borderRadius: 8, color: C.red, fontSize: 11, cursor: "pointer" }}>{char.cargo === "presidente" ? "VETAR" : "ARQUIVAR"}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "poder" && cargo && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>{cargo.icon} PODER DE {cargo.nome.toUpperCase()}</h2>
            {acoesCargo.map(acao => (
              <button key={acao.id} onClick={() => executarAcaoPoder(acao)} style={{ display: "block", width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 10, color: C.text, textAlign: "left", cursor: "pointer" }}>
                <div style={{ fontWeight: 700 }}>{acao.nome}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{acao.desc}</div>
              </button>
            ))}
          </div>
        )}

        {tab === "negociar" && podeNegociar && (
          <div>
            <div style={{ background: `linear-gradient(135deg,#1A0F00,#0A0500)`, border: `1px solid ${C.gold}44`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: 3, color: C.gold, marginBottom: 4 }}>💰 SALA DE NEGOCIAÇÃO</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Apoio: {apoioCongresso}%</div>
              <div style={{ height: 6, background: C.dim, borderRadius: 3, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ height: "100%", width: `${apoioCongresso}%`, background: apoioCongresso > 60 ? C.green : apoioCongresso > 35 ? C.orange : C.red, borderRadius: 3, transition: "width .6s ease" }} />
              </div>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, marginBottom: 14 }}>PARLAMENTARES DISPONÍVEIS</div>
              {PARLAMENTARES.filter(p => !parlamentaresComprados.includes(p.id)).map(p => (
                <div key={p.id} style={{ background: C.dim, border: `1px solid ${C.border}`, borderRadius: 9, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div><strong>{p.nome}</strong><br /><span style={{ fontSize: 10 }}>Votos: {p.votos}</span></div>
                    <Pill c={C.gold}>{fmt(p.preco)}</Pill>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 9 }}>Risco:</span>
                    <div style={{ height: 4, flex: 1, background: C.dim, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p.risco}%`, background: p.risco > 20 ? C.red : p.risco > 10 ? C.orange : C.green, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 9, color: p.risco > 20 ? C.red : p.risco > 10 ? C.orange : C.green }}>{p.risco}%</span>
                  </div>
                  <button onClick={() => comprarParlamentar(p)} style={{ width: "100%", padding: 9, background: `linear-gradient(135deg,#2A1800,${C.gold})`, border: "none", borderRadius: 8, color: "#fff", fontSize: 11, cursor: "pointer" }}>💸 COMPRAR VOTO</button>
                </div>
              ))}
            </div>
            {(char.cargo === "presidente" || char.cargo === "governador") && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: 3, color: C.blue, marginBottom: 4 }}>🏛️ DISTRIBUIR MINISTÉRIOS</div>
                {MINISTERIOS.map(min => (
                  <div key={min.id} style={{ background: C.dim, border: `1px solid ${C.border}`, borderRadius: 9, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 700 }}>📋 {min.nome}</span>
                      <Pill c={C.muted}>{fmt(min.verba)}</Pill>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                      {min.partidos.map(pid => {
                        const p = getPartido(pid);
                        return p ? <button key={pid} onClick={() => distribuirMinisterio(min, pid)} style={{ padding: "8px 6px", background: `${p.cor}22`, border: `1px solid ${p.cor}44`, borderRadius: 6, color: p.cor, fontSize: 10, cursor: "pointer", fontFamily: "'Space Mono',monospace" }}>{p.icon} {p.nome}</button> : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "aliancas" && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>🤝 SEUS ALIADOS</h2>
            {aliados.map(aliado => (
              <div key={aliado.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700 }}>{aliado.nome}</span>
                  <Pill c={aliado.satisfacao > 70 ? C.green : aliado.satisfacao > 30 ? C.orange : C.red}>{aliado.satisfacao}% satisfação</Pill>
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{aliado.exigencia} · {aliado.cargo} ({getPartido(aliado.partido)?.nome})</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => cumprirPromessa(aliado.id)} style={{ flex: 1, padding: 8, background: `${C.green}22`, border: `1px solid ${C.green}44`, borderRadius: 6, color: C.green, cursor: "pointer" }}>Cumprir promessa</button>
                  <button onClick={() => trairAliado(aliado.id)} style={{ flex: 1, padding: 8, background: `${C.red}22`, border: `1px solid ${C.red}44`, borderRadius: 6, color: C.red, cursor: "pointer" }}>Trair</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "orcamento" && podeOrcamento && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 2, marginBottom: 16 }}>📊 ORÇAMENTO PÚBLICO</h2>
            {Object.entries(orcamento).map(([area, valor]) => (
              <div key={area} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ textTransform: "capitalize", fontSize: 13 }}>{area}</span>
                  <span style={{ color: C.gold, fontFamily: "'Space Mono',monospace" }}>{Math.round(valor)}%</span>
                </div>
                <input type="range" min={0} max={100} value={valor}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value);
                    const diff = newVal - valor;
                    const others = Object.keys(orcamento).filter(k => k !== area);
                    const totalOthers = others.reduce((sum, k) => sum + orcamento[k], 0);
                    if ((totalOthers === 0 && diff < 0) || (totalOthers < Math.abs(diff) && diff > 0)) return;
                    const newOrc = { ...orcamento, [area]: newVal };
                    others.forEach(k => {
                      newOrc[k] = Math.max(0, orcamento[k] - diff * (orcamento[k] / totalOthers));
                    });
                    setOrcamento(newOrc);
                  }} style={{ width: "100%" }} />
              </div>
            ))}
            <button onClick={() => {
              notify("Orçamento aplicado. Verbas redistribuídas!", "ok");
              upChar(c => { c.popularidade = clamp(c.popularidade + 2); });
            }} style={{ width: "100%", padding: 12, background: C.gold, border: "none", borderRadius: 8, color: "#000", fontWeight: 700, cursor: "pointer" }}>
              APLICAR ORÇAMENTO
            </button>
          </div>
        )}

        {tab === "noticias" && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 2, marginBottom: 16 }}>📰 ÚLTIMAS NOTÍCIAS</h2>
            {char.logEventos.slice(-5).reverse().map((evento, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 8 }}>{evento.ano}</div>
                {JORNAIS.map(j => (
                  <div key={j.nome} style={{ background: C.card, borderLeft: `4px solid ${j.cor}`, borderRadius: 6, padding: "10px 14px", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: j.cor, marginBottom: 2 }}>{j.nome}</div>
                    <div style={{ fontSize: 11, lineHeight: 1.4 }}>{gerarManchete(evento, j)}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tab === "carreira" && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>🗺️ CARREIRA</h2>
            {Object.entries(CARGOS).map(([id, info]) => {
              const disabled = Math.round(char.idade) < info.minIdade;
              const chance = disabled ? 0 : chancesEleicao(char, id, 0);
              return (
                <div key={id} style={{ background: C.dim, border: `1px solid ${disabled ? C.dim : C.border}`, borderRadius: 9, padding: 12, marginBottom: 8, opacity: disabled ? 0.4 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 18, marginRight: 8 }}>{info.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 13, color: disabled ? C.muted : C.text }}>{info.nome}</span>
                      {char.cargo === id && <Pill c={C.gold} sm>cargo atual</Pill>}
                    </div>
                    {disabled ? <Pill c={C.muted} sm>mín. {info.minIdade} anos</Pill> : <Pill c={chance >= 60 ? C.green : chance >= 40 ? C.orange : C.red} sm>{chance}% chance</Pill>}
                  </div>
                  {!disabled && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><Pill c={C.muted} sm>{fmt(info.salarioMensal)}/mês</Pill> <Pill c={C.muted} sm>{info.mandato} anos</Pill></div>
                      <button onClick={() => { setEleicaoCargo(id); setState("eleicao"); }}
                        style={{ padding: "6px 14px", background: `${C.blue}22`, border: `1px solid ${C.blue}`, borderRadius: 6, color: C.blue, cursor: "pointer", fontFamily: "'Space Mono',monospace" }}>
                        CANDIDATAR
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "bancadas" && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>🤝 BANCADAS</h2>
            {BANCADAS.map(b => {
              const score = 50; // simplificado
              return (
                <div key={b.id} style={{ background: C.card, border: `1px solid ${b.cor}33`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span><span style={{ fontSize: 20, marginRight: 8 }}>{b.icon}</span><span style={{ fontWeight: 700, color: b.cor }}>{b.nome}</span></span>
                    <Pill c={b.cor}>{score >= 60 ? "apoiador" : score >= 40 ? "neutro" : "opositor"}</Pill>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{b.desc}</div>
                  <div style={{ height: 4, background: C.dim, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${score}%`, background: b.cor, borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "historico" && (
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>📋 HISTÓRICO</h2>
            {char.logEventos.length === 0 ? <p style={{ color: C.muted }}>Nenhum evento.</p> :
              [...char.logEventos].reverse().map((e, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
                    <span>{e.ano}</span><span>{e.cargo || "civil"}</span>
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>{e.texto}</div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════ COMPONENTES AUXILIARES ══════════════════════
function TelaCriacao({ onConfirm }) {
  const [nome, setNome] = useState("");
  const [partido, setPartido] = useState(null);
  const [personalidade, setPersonalidade] = useState(null);
  const [bancadas, setBancadas] = useState([]);
  const toggle = id => setBancadas(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id].slice(0, 3));
  const ok = nome.trim().length >= 2 && partido && personalidade;
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif" }}>
      <style>{FONT}</style>
      <div style={{ maxWidth: 480, width: "100%", padding: 20 }}>
        <h1 style={{ textAlign: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 40 }}>🇧🇷 POLÍTICO</h1>
        <input placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #fff", color: "#fff", fontSize: 18, padding: 8, marginBottom: 20 }} />
        <div style={{ marginBottom: 20 }}>
          <h3>Personalidade</h3>
          {PERSONALIDADES.map(p => (
            <div key={p.id} onClick={() => setPersonalidade(p.id)} style={{ background: personalidade === p.id ? `${p.cor}22` : C.card, border: `1px solid ${personalidade === p.id ? p.cor : C.border}`, borderRadius: 8, padding: 10, marginBottom: 6, cursor: "pointer" }}>
              <strong>{p.icon} {p.nome}</strong>
              <p style={{ fontSize: 10 }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <h3>Partido</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 6 }}>
            {PARTIDOS.map(p => (
              <button key={p.id} onClick={() => setPartido(p.id)} style={{ background: partido === p.id ? `${p.cor}33` : C.card, border: `1px solid ${partido === p.id ? p.cor : C.border}`, borderRadius: 8, padding: 8, color: "#fff", cursor: "pointer" }}>
                {p.icon} {p.nome}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3>Bancadas (máx. 3)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {BANCADAS.map(b => (
              <button key={b.id} onClick={() => toggle(b.id)} style={{ background: bancadas.includes(b.id) ? `${b.cor}33` : C.card, border: `1px solid ${bancadas.includes(b.id) ? b.cor : C.border}`, borderRadius: 6, padding: 6, color: "#fff", cursor: "pointer" }}>
                {b.icon} {b.nome}
              </button>
            ))}
          </div>
        </div>
        <button disabled={!ok} onClick={() => onConfirm({ nome: nome.trim(), partido, personalidade, bancadaDefendida: bancadas })} style={{ width: "100%", padding: 14, background: ok ? C.blue : C.dim, color: "#fff", border: "none", borderRadius: 10, marginTop: 20, cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 22 }}>
          COMEÇAR COMO VEREADOR
        </button>
      </div>
    </div>
  );
}

function TelaEleicao({ char, cargo, onConfirm }) {
  const info = getCargo(cargo);
  const [gasto, setGasto] = useState(info?.salarioMensal * 2 || 20000);
  const chance = chancesEleicao(char, cargo, gasto);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif" }}>
      <style>{FONT}</style>
      <div style={{ maxWidth: 480, width: "100%", padding: 20 }}>
        <h2 style={{ textAlign: "center" }}>{info?.icon} {info?.nome}</h2>
        <p style={{ textAlign: "center", color: C.muted }}>{char.ano} · {getPartido(char.partido)?.icon} {getPartido(char.partido)?.nome}</p>
        <div style={{ background: C.card, borderRadius: 12, padding: 18, marginTop: 20 }}>
          <MiniBar v={char.popularidade} label="Popularidade" icon="👥" c={C.green} />
          <MiniBar v={char.visibilidade} label="Visibilidade" icon="📺" c={C.blue} />
          <MiniBar v={char.integridade} label="Integridade" icon="⚖️" c={C.gold} />
          <div style={{ marginTop: 20 }}>
            <label style={{ fontSize: 10 }}>INVESTIMENTO DE CAMPANHA</label>
            <input type="range" min={1000} max={Math.min(char.dinheiro, info?.salarioMensal * 10 || 100000)} value={gasto} onChange={e => setGasto(Number(e.target.value))} style={{ width: "100%" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
              <span>{fmt(gasto)}</span><span>Chance: {chance}%</span>
            </div>
          </div>
          <button onClick={() => onConfirm(cargo, gasto)} style={{ width: "100%", padding: 16, background: C.blue, border: "none", borderRadius: 10, color: "#fff", fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, marginTop: 20, cursor: "pointer" }}>
            DISPUTAR ELEIÇÃO
          </button>
        </div>
      </div>
    </div>
  );
}

function TelaCrise({ crise, char, partido, cargo, onEscolha }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif" }}>
      <style>{FONT}</style>
      <div style={{ maxWidth: 480, width: "100%", padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}><span style={{ fontSize: 40 }}>{crise.icon}</span></div>
        <h2>{crise.titulo}</h2>
        <p style={{ color: C.muted }}>{crise.desc}</p>
        {crise.opcoes.map((op, i) => (
          <button key={i} onClick={() => onEscolha(op)} style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginTop: 10, textAlign: "left", color: "#fff", cursor: "pointer" }}>
            <div style={{ fontWeight: 700 }}>{op.texto}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{op.consequencia}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TelaLei({ lei, char, cargo, onVotar, comprarParlamentar, parlamentaresComprados }) {
  const [votos, setVotos] = useState(0);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif" }}>
      <style>{FONT}</style>
      <div style={{ maxWidth: 480, width: "100%", padding: 20 }}>
        <h2>{lei.titulo}</h2>
        <p style={{ color: C.muted }}>{lei.desc}</p>
        <div style={{ background: C.card, borderRadius: 10, padding: 14, marginTop: 10 }}>
          <h4>Comprar apoio (+{votos * 4}% chance)</h4>
          {PARLAMENTARES.filter(p => !parlamentaresComprados.includes(p.id)).slice(0, 3).map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>{p.nome} ({p.votos} votos)</span>
              <button onClick={() => { comprarParlamentar(p); setVotos(v => v + p.votos); }} style={{ background: C.gold, border: "none", borderRadius: 4, color: "#000", cursor: "pointer" }}>{fmt(p.preco)}</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={() => onVotar(lei, true, votos)} style={{ flex: 1, padding: 14, background: C.green, border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18 }}>SANCIONAR/PROPOR</button>
          <button onClick={() => onVotar(lei, false, 0)} style={{ flex: 1, padding: 14, background: C.red, border: "none", borderRadius: 10, color: "#fff", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18 }}>VETAR/ARQUIVAR</button>
        </div>
      </div>
    </div>
  );
}

function TelaAposentadoria({ char, partido, onReinicio }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif" }}>
      <style>{FONT}</style>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <span style={{ fontSize: 48 }}>🧓</span>
        <h2>Fim da carreira</h2>
        <p>{char.nome}, ex-{getCargo(char.historicoCargos.slice(-1)[0]?.cargo)?.nome || "político"}, encerrou sua jornada em {char.ano}.</p>
        <button onClick={onReinicio} style={{ padding: 14, background: C.blue, border: "none", borderRadius: 10, color: "#fff", marginTop: 20, cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: 20 }}>JOGAR NOVAMENTE</button>
      </div>
    </div>
  );
}
