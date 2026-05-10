import { useState, useRef } from "react";

// ─── FONTE E CORES ──────────────────────────────────────────────────
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:3px;background:#020507}::-webkit-scrollbar-thumb{background:#0D1525;border-radius:2px}`;

const C = {
  bg:"#020507",card:"#060C18",border:"#0C1628",
  text:"#DCE4F0",muted:"#344560",dim:"#08111E",
  gold:"#D4A017",green:"#10B981",red:"#EF4444",
  blue:"#3B82F6",orange:"#F59E0B",purple:"#8B5CF6",teal:"#06B6D4",
};

// ─── PARTIDOS ───────────────────────────────────────────────────────
const PARTIDOS = [
  {id:"pt",   nome:"PT",    full:"Partido dos Trabalhadores",     spec:"esquerda",       cor:"#CC0000",icon:"⭐"},
  {id:"psol", nome:"PSOL",  full:"Part. Socialismo e Liberdade",  spec:"esquerda",       cor:"#E05000",icon:"🌅"},
  {id:"rede", nome:"REDE",  full:"Rede Sustentabilidade",         spec:"esquerda",       cor:"#009966",icon:"🌿"},
  {id:"mdb",  nome:"MDB",   full:"Mov. Democrático Brasileiro",   spec:"centro",         cor:"#4A90D9",icon:"🔷"},
  {id:"psd",  nome:"PSD",   full:"Partido Social Democrático",    spec:"centro",         cor:"#2E7D32",icon:"🌱"},
  {id:"uniao",nome:"UNIÃO", full:"União Brasil",                  spec:"centro-direita", cor:"#1565C0",icon:"🇧🇷"},
  {id:"pp",   nome:"PP",    full:"Progressistas",                 spec:"centro-direita", cor:"#0D47A1",icon:"🏛️"},
  {id:"pl",   nome:"PL",    full:"Partido Liberal",               spec:"direita",        cor:"#1A237E",icon:"🦁"},
  {id:"novo", nome:"NOVO",  full:"Partido Novo",                  spec:"direita",        cor:"#E65100",icon:"🆕"},
  {id:"rep",  nome:"REP",   full:"Republicanos",                  spec:"direita",        cor:"#37474F",icon:"✝️"},
];

// ─── PERSONALIDADES ─────────────────────────────────────────────────
const PERSONALIDADES = [
  {id:"ideologo",  nome:"Ideólogo",    icon:"📖",cor:C.blue, bonus:{integridade:20,popularidade:5,dinheiro:0}},
  {id:"pragmatico",nome:"Pragmático",  icon:"🤝",cor:C.teal, bonus:{integridade:0,popularidade:5,dinheiro:40000}},
  {id:"populista", nome:"Populista",   icon:"📢",cor:C.orange,bonus:{integridade:-5,popularidade:25,dinheiro:0}},
  {id:"corrupto",  nome:"Oportunista", icon:"💸",cor:C.gold,  bonus:{integridade:-20,popularidade:0,dinheiro:100000}},
  {id:"tecnico",   nome:"Técnico",     icon:"📊",cor:C.purple,bonus:{integridade:15,popularidade:-5,dinheiro:0}},
];

// ─── BANCADAS ───────────────────────────────────────────────────────
const BANCADAS = [
  {id:"evangelica", nome:"Evangélica", icon:"✝️", cor:"#7C3AED"},
  {id:"ruralista",  nome:"Ruralista", icon:"🌾", cor:"#92400E"},
  {id:"trabalhista",nome:"Trabalhista",icon:"⚒️", cor:"#DC2626"},
  {id:"empresarial",nome:"Empresarial",icon:"💼", cor:"#059669"},
  {id:"seguranca",  nome:"Segurança Pública",icon:"🚔",cor:"#374151"},
  {id:"ambiental",  nome:"Ambiental", icon:"🌿", cor:"#10B981"},
  {id:"lgbtq",      nome:"Diversidade",icon:"🏳️‍🌈",cor:"#EC4899"},
  {id:"progressista",nome:"Progressista",icon:"✊", cor:"#F59E0B"},
];

// ─── CARGOS ─────────────────────────────────────────────────────────
const CARGOS = {
  vereador:    {nome:"Vereador",icon:"🏙️",mandato:4,salarioMensal:12000,minIdade:18,eleicaoBase:40},
  deputado:    {nome:"Deputado Estadual",icon:"🏛️",mandato:4,salarioMensal:30000,minIdade:18,eleicaoBase:50},
  deputadoFed: {nome:"Deputado Federal",icon:"🏟️",mandato:4,salarioMensal:40000,minIdade:21,eleicaoBase:55},
  senador:     {nome:"Senador",icon:"⭐",mandato:8,salarioMensal:40000,minIdade:35,eleicaoBase:60},
  governador:  {nome:"Governador",icon:"🗺️",mandato:4,salarioMensal:35000,minIdade:30,eleicaoBase:58},
  prefeito:    {nome:"Prefeito",icon:"🏢",mandato:4,salarioMensal:25000,minIdade:21,eleicaoBase:55},
  presidente:  {nome:"Presidente",icon:"🎖️",mandato:4,salarioMensal:40000,minIdade:35,eleicaoBase:65},
};

// ─── AÇÕES DE PODER ─────────────────────────────────────────────────
const ACOES_CARGO = {
  presidente:[
    {id:"vetar",nome:"Vetar projeto",efeito:(c,n)=> { n("Veto aplicado."); c.popularidade-=3; c.integridade+=5; }},
    {id:"mp",nome:"Medida Provisória",efeito:(c,n)=>{ n("MP editada."); c.popularidade+=5; c.visibilidade+=15; }},
    {id:"stf",nome:"Indicar STF",efeito:(c,n)=>{ n("Indicação enviada."); c.visibilidade+=20; }},
    {id:"acordo",nome:"Acordo empresarial",efeito:(c,n)=>{ c.dinheiro+=150000; c.popularidade-=5; c.integridade-=10; n("+R$150k"); }},
  ],
  governador:[
    {id:"vetarEst",nome:"Vetar lei",efeito:(c,n)=>{ n("Veto estadual."); c.popularidade-=3; c.integridade+=5; }},
    {id:"calamidade",nome:"Decretar calamidade",efeito:(c,n)=>{ if(c.dinheiro<50000)return n("Sem verba!","err"); c.dinheiro-=50000; c.popularidade+=12; n("Calamidade."); }},
    {id:"concessao",nome:"Concessão de rodovia",efeito:(c,n)=>{ c.dinheiro+=200000; c.popularidade-=10; n("+R$200k"); }},
  ],
  prefeito:[
    {id:"sancionar",nome:"Sancionar lei",efeito:(c,n)=>{ n("Lei sancionada."); c.popularidade+=3; }},
    {id:"decreto",nome:"Decreto",efeito:(c,n)=>{ c.visibilidade+=12; c.dinheiro-=20000; n("Decreto publicado."); }},
    {id:"iptu",nome:"Aumentar IPTU",efeito:(c,n)=>{ c.dinheiro+=80000; c.popularidade-=8; n("+R$80k"); }},
  ],
  senador:[
    {id:"sabatina",nome:"Sabatina",efeito:(c,n)=>{ c.visibilidade+=25; n("Sabatina iniciada."); }},
    {id:"cpi",nome:"CPI",efeito:(c,n)=>{ c.visibilidade+=20; c.integridade+=8; n("CPI instaurada."); }},
    {id:"relatoria",nome:"Relatoria",efeito:(c,n)=>{ c.visibilidade+=15; c.dinheiro+=50000; n("+R$50k"); }},
  ],
  deputadoFed:[
    {id:"emenda",nome:"Emenda parlamentar",efeito:(c,n)=>{ if(c.dinheiro<50000)return n("Sem verba!","err"); c.dinheiro-=50000; c.dinheiro+=150000; c.popularidade+=10; n("+R$100k"); }},
    {id:"articular",nome:"Articular líderes",efeito:(c,n)=>{ c.dinheiro+=30000; c.visibilidade+=5; n("+R$30k"); }},
  ],
  deputado:[
    {id:"fiscalizar",nome:"Fiscalizar",efeito:(c,n)=>{ c.visibilidade+=15; c.integridade+=5; n("Denúncia repercute."); }},
    {id:"comissao",nome:"Comissão especial",efeito:(c,n)=>{ c.dinheiro+=40000; c.visibilidade+=10; n("+R$40k"); }},
  ],
  vereador:[
    {id:"requerimento",nome:"Requerimento",efeito:(c,n)=>{ c.visibilidade+=10; n("Requerimento."); }},
    {id:"emendaLocal",nome:"Emenda local",efeito:(c,n)=>{ c.dinheiro+=20000; c.popularidade+=5; n("+R$20k"); }},
  ],
};

// ─── CRISES ──────────────────────────────────────────────────────────
const CRISES = {
  vereador:[
    {id:"v1",titulo:"Buraco na Rua do Bairro Popular",icon:"🕳️",desc:"Moradores pedem ajuda.",opcoes:[
      {texto:"Protocolar requerimento",efeitos:{popularidade:15,integridade:8,dinheiro:-1000}},
      {texto:"Vídeo nas redes",efeitos:{popularidade:20,integridade:-3,visibilidade:25}},
      {texto:"Contratar obra com emenda",efeitos:{popularidade:25,integridade:12,dinheiro:-15000}},
      {texto:"Ignorar",efeitos:{popularidade:-20,integridade:-10}},
    ]},
    {id:"v2",titulo:"Empresário Oferece Propina",icon:"💼",desc:"R$80.000 por licitação suspeita.",opcoes:[
      {texto:"Aceitar",efeitos:{popularidade:-5,integridade:-40,dinheiro:80000},riscoInvestigacao:60},
      {texto:"Recusar e denunciar",efeitos:{popularidade:15,integridade:25},riscoInvestigacao:0},
      {texto:"Aceitar e gravar chantagem",efeitos:{integridade:-20,dinheiro:80000},riscoInvestigacao:30},
    ]},
    {id:"v3",titulo:"UBS Fechada por Falta de Médico",icon:"🏥",desc:"Sem médico há 3 meses.",opcoes:[
      {texto:"Propor lei obrigando",efeitos:{popularidade:18,integridade:10}},
      {texto:"Mutirão de saúde",efeitos:{popularidade:28,integridade:15,dinheiro:-8000}},
      {texto:"Convocar secretário",efeitos:{popularidade:12,integridade:8}},
      {texto:"Acordo com prefeito",efeitos:{popularidade:-5,integridade:-18,dinheiro:20000}},
    ]},
    {id:"v4",titulo:"Escola Sem Professor",icon:"📚",desc:"600 alunos sem aulas.",opcoes:[
      {texto:"Marcha com os pais",efeitos:{popularidade:22,integridade:12}},
      {texto:"Contratar com verba própria",efeitos:{popularidade:20,integridade:18,dinheiro:-12000}},
      {texto:"Discurso na tribuna",efeitos:{popularidade:10,integridade:5}},
      {texto:"Culpar governo federal",efeitos:{popularidade:5,integridade:-15}},
    ]},
    {id:"v5",titulo:"Protesto na Câmara",icon:"📣",desc:"Servidores pedem reajuste.",opcoes:[
      {texto:"Apoiar reajuste",efeitos:{popularidade:20,integridade:10}},
      {texto:"Apoiar prefeito contra reajuste",efeitos:{popularidade:-15,integridade:-8,dinheiro:15000}},
      {texto:"Propor meio-termo",efeitos:{popularidade:8,integridade:5}},
      {texto:"Fugir pelos fundos",efeitos:{popularidade:-18,integridade:-12}},
    ]},
    {id:"v6",titulo:"Bar do Tráfico",icon:"🚨",desc:"Aliado envolvido.",opcoes:[
      {texto:"Denunciar",efeitos:{popularidade:15,integridade:20}},
      {texto:"Avisar aliado discretamente",efeitos:{popularidade:-5,integridade:-15,dinheiro:10000}},
      {texto:"Abaixo-assinado",efeitos:{popularidade:12,integridade:10}},
      {texto:"Ignorar",efeitos:{popularidade:-20,integridade:-15}},
    ]},
    {id:"v7",titulo:"Muro Irregular de Aliado",icon:"🏗️",desc:"Aliado invadiu calçada.",opcoes:[
      {texto:"Denunciar formalmente",efeitos:{popularidade:15,integridade:25}},
      {texto:"Conversar em particular",efeitos:{integridade:-5}},
      {texto:"Defender aliado",efeitos:{popularidade:-20,integridade:-20,dinheiro:8000}},
      {texto:"Se ausentar",efeitos:{popularidade:-10,integridade:-12}},
    ]},
    {id:"v8",titulo:"Ciclovia na Avenida Central",icon:"🚲",desc:"Ciclistas vs. comércio.",opcoes:[
      {texto:"Apoiar ciclovia",efeitos:{popularidade:10,integridade:8,dinheiro:-3000}},
      {texto:"Proteger comércio",efeitos:{popularidade:-5,integridade:-5,dinheiro:12000}},
      {texto:"Rua alternativa",efeitos:{popularidade:5,integridade:5}},
      {texto:"Não votar",efeitos:{popularidade:-8,integridade:-10}},
    ]},
    {id:"v9",titulo:"Foto em Festa de Empresário",icon:"📸",desc:"Imagem comprometedora.",opcoes:[
      {texto:"Entrevista explicando",efeitos:{popularidade:-5,integridade:12}},
      {texto:"Nota de inocência",efeitos:{popularidade:-3}},
      {texto:"Contra-atacar",efeitos:{popularidade:-10,integridade:-12}},
      {texto:"Contratar assessor",efeitos:{popularidade:-8,integridade:-5,dinheiro:-5000}},
    ]},
    {id:"v10",titulo:"Nepotismo na Família",icon:"👨‍👩‍👧",desc:"Cunhado pede cargo.",opcoes:[
      {texto:"Recusar",efeitos:{popularidade:5,integridade:20}},
      {texto:"Indicar discretamente",efeitos:{popularidade:-8,integridade:-20}},
      {texto:"Qualificar formalmente",efeitos:{popularidade:5,integridade:10,dinheiro:-2000}},
      {texto:"Fingir que vai tentar",efeitos:{popularidade:-3,integridade:-8}},
    ]},
    {id:"v11",titulo:"Falta de Medicamentos",icon:"💊",desc:"Posto sem remédios.",opcoes:[
      {texto:"Cobrar secretário",efeitos:{popularidade:8,integridade:5}},
      {texto:"Doar com verba",efeitos:{popularidade:15,integridade:12,dinheiro:-5000}},
      {texto:"Culpar prefeito nas redes",efeitos:{popularidade:10,integridade:-5}},
      {texto:"Ignorar",efeitos:{popularidade:-12,integridade:-8}},
    ]},
    {id:"v12",titulo:"Corte de Árvore Histórica",icon:"🌳",desc:"Prefeitura quer derrubar.",opcoes:[
      {texto:"Liderar protesto",efeitos:{popularidade:18,integridade:15}},
      {texto:"Apoiar avenida",efeitos:{popularidade:-10,dinheiro:10000}},
      {texto:"Transplante da árvore",efeitos:{popularidade:12,integridade:10,dinheiro:-8000}},
      {texto:"Não se envolver",efeitos:{popularidade:-5}},
    ]},
    {id:"v13",titulo:"Câmeras em Banheiros de Escola",icon:"🏫",desc:"Polêmica entre pais.",opcoes:[
      {texto:"Votar contra",efeitos:{popularidade:8,integridade:15}},
      {texto:"Votar a favor",efeitos:{popularidade:-8,integridade:-15}},
      {texto:"Câmeras só nos corredores",efeitos:{popularidade:10,integridade:8}},
      {texto:"Adiar votação",efeitos:{popularidade:-5,integridade:-3}},
    ]},
    {id:"v14",titulo:"Enchente no Bairro",icon:"🌊",desc:"Famílias desabrigadas.",opcoes:[
      {texto:"Coordenar ajuda",efeitos:{popularidade:20,integridade:12,dinheiro:-10000}},
      {texto:"Pedir verbas ao governador",efeitos:{popularidade:5,integridade:5}},
      {texto:"Usar fundo partidário",efeitos:{popularidade:15,integridade:-5,dinheiro:-5000}},
      {texto:"Dizer que é culpa da prefeitura",efeitos:{popularidade:-5,integridade:-10}},
    ]},
    {id:"v15",titulo:"Jornalista Descobre Esquema",icon:"📰",desc:"Informações sobre corrupção.",opcoes:[
      {texto:"Subornar jornalista",efeitos:{popularidade:-10,integridade:-25,dinheiro:-30000},riscoInvestigacao:50},
      {texto:"Dar entrevista e negar tudo",efeitos:{popularidade:-5,integridade:-15}},
      {texto:"Colaborar com investigação",efeitos:{popularidade:10,integridade:20}},
      {texto:"Ameaçar processar",efeitos:{popularidade:-8,integridade:-10}},
    ]},
  ],
  // Outros cargos teriam arrays semelhantes. Para manter o exemplo completo e funcional,
  // replicaremos a mesma estrutura genérica para todos (20 crises cada).
  deputado: genCrises("deputado",20),
  deputadoFed: genCrises("deputado_federal",20),
  senador: genCrises("senador",20),
  governador: genCrises("governador",20),
  prefeito: genCrises("prefeito",20),
  presidente: genCrises("presidente",20),
};

// Função geradora de crises genéricas (para não repetir código)
function genCrises(cargo, qtd){
  const base = [];
  for(let i=0;i<qtd;i++){
    base.push({
      id:`${cargo}_${i}`,
      titulo:`Crise ${i+1} (${cargo.replace("_"," ").toUpperCase()})`,
      icon:"⚡",
      desc:`Descrição da crise ${i+1} para ${cargo}. Escolha sua ação.`,
      opcoes:[
        {texto:"Opção A (bom)",efeitos:{popularidade:10,integridade:8}},
        {texto:"Opção B (ruim)",efeitos:{popularidade:-10,integridade:-5}},
        {texto:"Opção C (dinheiro)",efeitos:{dinheiro:30000,integridade:-15},riscoInvestigacao:20},
        {texto:"Opção D (neutro)",efeitos:{popularidade:2}},
      ]
    });
  }
  return base;
}

// ─── LEIS ────────────────────────────────────────────────────────────
const LEIS = {
  vereador:[
    {id:"lv1",titulo:"Lei do Silêncio Noturno",desc:"Proibir ruídos após 22h.",efeitos:{popularidade:8,integridade:5,dinheiro:-500}},
    {id:"lv2",titulo:"Gratuidade no Ônibus para Idosos",desc:"Isenção de tarifa para +65 anos.",efeitos:{popularidade:18,integridade:8,dinheiro:-8000}},
    {id:"lv3",titulo:"Câmeras nos Corredores das Escolas",desc:"Segurança nas escolas municipais.",efeitos:{popularidade:8,integridade:5,dinheiro:-5000}},
    {id:"lv4",titulo:"Hortas Comunitárias nas Praças",desc:"10% das praças para hortas.",efeitos:{popularidade:10,integridade:8,dinheiro:-2000}},
  ],
  deputado:[
    {id:"ld1",titulo:"Cotas Estaduais para PCDs",desc:"10% das vagas em concursos estaduais.",efeitos:{popularidade:12,integridade:10,dinheiro:-5000}},
    {id:"ld2",titulo:"Proibição de Queimadas Estadual",desc:"Multas pesadas para queimadas.",efeitos:{popularidade:8,integridade:12,dinheiro:-3000}},
    {id:"ld3",titulo:"Tarifa Única no Transporte",desc:"Integração tarifária.",efeitos:{popularidade:15,integridade:10,dinheiro:-20000}},
  ],
  deputadoFed:[
    {id:"ldf1",titulo:"Piso da Enfermagem Federal",desc:"R$4.750 para enfermeiros do SUS.",efeitos:{popularidade:20,integridade:15,dinheiro:-50000}},
    {id:"ldf2",titulo:"Reforma Tributária",desc:"IVA unificado.",efeitos:{popularidade:5,integridade:10,dinheiro:-20000}},
  ],
  senador:[
    {id:"ls1",titulo:"Lei de Responsabilidade Climática",desc:"Metas obrigatórias de emissão.",efeitos:{popularidade:10,integridade:15,dinheiro:-15000}},
    {id:"ls2",titulo:"Reforma Política: Cláusula de Barreira",desc:"Partidos com menos de 2% extintos.",efeitos:{popularidade:5,integridade:10,dinheiro:0}},
  ],
  governador:[
    {id:"lg1",titulo:"Programa Estadual de Renda Mínima",desc:"R$200/mês para famílias carentes.",efeitos:{popularidade:22,integridade:12,dinheiro:-200000}},
  ],
  prefeito:[
    {id:"lp1",titulo:"IPTU Verde",desc:"Desconto para práticas sustentáveis.",efeitos:{popularidade:15,integridade:10,dinheiro:-30000}},
    {id:"lp2",titulo:"Zona Azul Gratuita",desc:"Estacionamento rotativo gratuito.",efeitos:{popularidade:20,integridade:8,dinheiro:-50000}},
  ],
  presidente:[
    {id:"lpr1",titulo:"Sancionei: Piso da Enfermagem",desc:"Transformei em lei o piso dos enfermeiros.",efeitos:{popularidade:18,integridade:15,dinheiro:-100000}},
    {id:"lpr2",titulo:"Vetei: Privatização dos Correios",desc:"Barrei a privatização total.",efeitos:{popularidade:10,integridade:12,dinheiro:0}},
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────
const clamp = (v,mn=0,mx=100)=>Math.max(mn,Math.min(mx,v));
const fmt = n=>n>=1e6?`R$${(n/1e6).toFixed(1)}M`:n>=1000?`R$${(n/1000).toFixed(0)}k`:`R$${n}`;
const rand = arr=>arr[Math.floor(Math.random()*arr.length)];
const getPartido = id=>PARTIDOS.find(p=>p.id===id);
const getCargo = id=>CARGOS[id];

const chancesEleicao=(char,cargo,gasto=0)=>{
  const info=getCargo(cargo);
  if(!info)return 5;
  const base=info.eleicaoBase||50;
  const pop=char.popularidade,vis=char.visibilidade,intg=char.integridade;
  const exp=char.historicoCargos.filter(h=>h.cargo===cargo).length*5;
  const salarioRef=info.salarioMensal*12;
  const gastoRatio=Math.min(gasto/Math.max(salarioRef,1),3);
  const bonusDinheiro=Math.round(gastoRatio*12);
  const espectroCargo={
    vereador:{esquerda:40,centro:40,direita:20},
    deputado:{esquerda:45,centro:35,direita:20},
    deputadoFed:{esquerda:45,centro:30,direita:25},
    senador:{esquerda:40,centro:30,direita:30},
    governador:{esquerda:35,centro:35,direita:30},
    prefeito:{esquerda:40,centro:35,direita:25},
    presidente:{esquerda:40,centro:30,direita:30},
  }[cargo]||{esquerda:33,centro:34,direita:33};
  const partido=getPartido(char.partido);
  const spec=partido?.spec||"centro";
  const alinhamento=espectroCargo[spec]||33;
  const bonusIdeologia=Math.round((alinhamento-33)*0.5);
  const raw=(pop*0.25)+(vis*0.15)+(intg*0.1)+exp+bonusDinheiro+bonusIdeologia-base+40;
  return clamp(Math.round(raw),5,92);
};

// ─── COMPONENTES DE UI ──────────────────────────────────────────────
const Pill=({c,children,sm})=>(
  <span style={{fontSize:sm?9:10,padding:sm?"1px 7px":"2px 9px",borderRadius:12,background:c+"18",color:c,border:`1px solid ${c}28`,fontFamily:"'Space Mono',monospace",whiteSpace:"nowrap"}}>{children}</span>
);
const Notif=({n})=>n?(
  <div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:C.card,
    border:`1px solid ${n.t==="err"?C.red:n.t==="ok"?C.green:n.t==="warn"?C.orange:C.blue}`,
    borderRadius:10,padding:"10px 22px",fontSize:11,color:C.text,maxWidth:"92vw",textAlign:"center",
    boxShadow:"0 8px 40px #000000AA",fontFamily:"'Space Mono',monospace"}}>{n.m}</div>
):null;
const MiniBar=({v,c=C.blue,label,icon})=>{
  const pv=Math.max(0,Math.min(100,v));
  const col=pv>=60?c:pv>=35?C.orange:C.red;
  return(
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:10,color:C.muted,fontFamily:"'Space Mono',monospace"}}>{icon} {label}</span>
        <span style={{fontSize:10,fontWeight:700,color:col,fontFamily:"'Space Mono',monospace"}}>{pv}%</span>
      </div>
      <div style={{height:3,background:C.dim,borderRadius:2,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pv}%`,background:col,borderRadius:2,transition:"width .6s ease"}}/>
      </div>
    </div>
  );
};

// ════════════════════ COMPONENTE PRINCIPAL ════════════════════════════
export default function PoliticoGame(){
  const [state,setState]=useState("criacao");
  const [char,setChar]=useState({
    nome:"",idade:18,ano:2025,
    partido:null,personalidade:null,cargo:null,
    bancadaDefendida:[],
    popularidade:20,visibilidade:10,integridade:70,
    dinheiro:50000,patrimonio:50000,
    mandatosRestantes:0,
    historicoCargos:[],leisAprovadas:[],leisRejeitadas:[],
    decisoesTomadas:{},memorias:[],
    totalVitoriasEleitorais:0,totalDerrotasEleitorais:0,
    logEventos:[],
    riscoInvestigacao:0,lealdadePartido:70,
  });
  const [eleicaoCargo,setEleicaoCargo]=useState(null);
  const [criseAtual,setCriseAtual]=useState(null);
  const [leiAtual,setLeiAtual]=useState(null);
  const [tab,setTab]=useState("painel");
  const [notif,setNotif]=useState(null);
  const [trocaPartido,setTrocaPartido]=useState(false);
  const [criseUsadas,setCriseUsadas]=useState([]);
  const ntRef=useRef(null);

  const [aliados] = useState([
    {id:"a1",nome:"Dep. Carlos Motta",cargo:"deputadoFed",partido:"mdb",exigencia:"Cargo",satisfacao:50},
    {id:"a2",nome:"Sen. Lúcia Helena",cargo:"senador",partido:"psd",exigencia:"Verba",satisfacao:50},
  ]);
  const [parlamentaresComprados,setParlamentaresComprados]=useState([]);
  const [apoioCongresso,setApoioCongresso]=useState(20);
  const [orcamento,setOrcamento]=useState({saude:30,educacao:25,seguranca:20,infraestrutura:15,outros:10});

  const notify=(m,t="info")=>{
    setNotif({m,t});
    if(ntRef.current)clearTimeout(ntRef.current);
    ntRef.current=setTimeout(()=>setNotif(null),3000);
  };
  const upChar=(fn)=>setChar(prev=>{const n={...prev};fn(n);return n;});
  const addLog=(c,texto)=>c.logEventos=[...c.logEventos,{texto,ano:c.ano,cargo:c.cargo||"civil"}];

  // Salário automático: ao iniciar cargo e a cada ano
  const receberSalario=(ch)=>{
    if(!ch.cargo)return;
    const info=getCargo(ch.cargo);
    const anual=info.salarioMensal*12;
    ch.dinheiro+=anual;
    addLog(ch,`💰 Salário anual de ${fmt(anual)} recebido.`);
  };

  const handleCriacao=(dados)=>{
    const pers=PERSONALIDADES.find(p=>p.id===dados.personalidade);
    setChar({
      ...char,...dados,
      popularidade:clamp(20+(pers?.bonus.popularidade||0)),
      integridade:clamp(70+(pers?.bonus.integridade||0)),
      dinheiro:50000+(pers?.bonus.dinheiro||0),
      logEventos:[{texto:`${dados.nome} inicia carreira pelo ${getPartido(dados.partido)?.full}`,ano:2025,cargo:"civil"}],
    });
    setEleicaoCargo("vereador");
    setState("eleicao");
  };

  const handleEleicao=(cargo,gasto)=>{
    const chance=chancesEleicao(char,cargo,gasto);
    const ganhou=Math.random()*100<chance;
    upChar(c=>{
      c.dinheiro=Math.max(0,c.dinheiro-gasto);
      c.patrimonio=Math.max(0,c.patrimonio-gasto);
      if(ganhou){
        c.cargo=cargo;
        c.mandatosRestantes=CARGOS[cargo].mandato;
        c.totalVitoriasEleitorais++;
        c.historicoCargos=[...c.historicoCargos,{cargo,ano:c.ano,partido:c.partido}];
        addLog(c,`✅ ELEITO ${getCargo(cargo)?.nome}`);
        notify(`🎉 Eleito ${getCargo(cargo)?.nome}!`,"ok");
        receberSalario(c);
      }else{
        c.totalDerrotasEleitorais++;
        c.popularidade=clamp(c.popularidade-8);
        addLog(c,`❌ Derrota para ${getCargo(cargo)?.nome}`);
        notify("Derrota eleitoral.","err");
      }
    });
    setState("mandato");
    setCriseUsadas([]);
    setTab("painel");
  };

  const triggerCrise=()=>{
    const pool=(CRISES[char.cargo]||[]).filter(c=>!criseUsadas.includes(c.id));
    if(!pool.length){notify("Todas as crises já enfrentadas!");return;}
    const c=rand(pool);
    setCriseUsadas(p=>[...p,c.id]);
    setCriseAtual(c);
    setState("crise");
  };

  const handleEscolhaCrise=(opcao)=>{
    upChar(c=>{
      c.popularidade=clamp(c.popularidade+(opcao.efeitos.popularidade||0));
      c.integridade=clamp(c.integridade+(opcao.efeitos.integridade||0));
      c.dinheiro=Math.max(0,c.dinheiro+(opcao.efeitos.dinheiro||0));
      c.visibilidade=clamp(c.visibilidade+(opcao.efeitos.visibilidade||0));
      c.memorias=[...c.memorias,{texto:opcao.memoria||"",ano:c.ano,cargo:c.cargo}];
      c.decisoesTomadas={...c.decisoesTomadas,[criseAtual.id]:opcao.texto};
      addLog(c,`⚡ ${criseAtual.titulo}: ${opcao.texto}`);
      if(opcao.riscoInvestigacao){
        c.riscoInvestigacao=clamp((c.riscoInvestigacao||0)+opcao.riscoInvestigacao);
        if(c.riscoInvestigacao>70)notify("🚔 Risco de investigação altíssimo!","err");
      }
      c.mandatosRestantes-=1;
      c.ano+=1;
      c.idade+=1;
      receberSalario(c); // salário anual após cada ano de mandato
      if(c.mandatosRestantes<=0){
        addLog(c,`📅 Fim do mandato de ${getCargo(c.cargo)?.nome}.`);
        c.cargo=null;c.mandatosRestantes=0;
        notify("Mandato encerrado.","info");
      }
    });
    setCriseAtual(null);
    setState("mandato");
    setTab("painel");
  };

  const fimDeMandato=()=>{
    upChar(c=>{
      const anosFalt=c.mandatosRestantes;
      c.ano+=anosFalt;c.idade+=anosFalt;
      c.mandatosRestantes=0;
      addLog(c,`📅 Mandato encerrado voluntariamente.`);
      c.cargo=null;
    });
    notify("Mandato encerrado.","info");
    setState("mandato");
  };

  const avancarAno=(qtd=1)=>{
    upChar(c=>{
      c.ano+=qtd;c.idade+=qtd;
      addLog(c,`⏳ Avançou ${qtd} ano(s) como civil.`);
      c.dinheiro=Math.max(0,c.dinheiro-5000*qtd);
    });
    notify(`Avançou ${qtd} ano(s).`);
  };

  const handleVotarLei=(lei,votar,votosComprados=0)=>{
    if(!votar){
      upChar(c=>{c.leisRejeitadas=[...c.leisRejeitadas,lei.titulo];addLog(c,`🚫 Lei rejeitada: ${lei.titulo}`);});
      notify("Lei não proposta.","info");
      setLeiAtual(null);setState("mandato");return;
    }
    const base=40+(char.popularidade*0.3)+(char.visibilidade*0.2)+(votosComprados*4);
    const aprov=Math.random()*100<Math.min(95,base);
    upChar(c=>{
      if(aprov){
        c.popularidade=clamp(c.popularidade+(lei.efeitos.popularidade||0));
        c.integridade=clamp(c.integridade+(lei.efeitos.integridade||0));
        c.dinheiro=Math.max(0,c.dinheiro+(lei.efeitos.dinheiro||0));
        c.leisAprovadas=[...c.leisAprovadas,{titulo:lei.titulo,ano:c.ano}];
        addLog(c,`✅ Lei aprovada: ${lei.titulo}`);
      }else{
        c.leisRejeitadas=[...c.leisRejeitadas,lei.titulo];
        addLog(c,`❌ Lei rejeitada: ${lei.titulo}`);
      }
    });
    notify(aprov?"✅ Lei aprovada!":"❌ Lei rejeitada.",aprov?"ok":"err");
    setLeiAtual(null);
    setState("mandato");
  };

  const comprarParlamentar=(p)=>{
    if(char.dinheiro<p.preco)return notify("Sem dinheiro!","err");
    const descoberto=Math.random()*100<p.risco;
    upChar(c=>{
      c.dinheiro-=p.preco;c.integridade-=15;
      c.riscoInvestigacao=clamp((c.riscoInvestigacao||0)+(descoberto?40:10));
      if(descoberto){c.popularidade-=20;addLog(c,`🚨 Suborno ao ${p.nome} descoberto!`);}
    });
    setParlamentaresComprados(prev=>[...prev,p.id]);
    setApoioCongresso(prev=>Math.min(100,prev+p.votos));
    notify(descoberto?"🚨 Escândalo!":"✅ Voto comprado.","ok");
  };

  const executarAcao=(acao)=>{
    upChar(c=>{
      const original={...c};
      acao.efeito(c,notify);
      if(c.dinheiro!==original.dinheiro||c.popularidade!==original.popularidade)addLog(c,`⚡ Ação: ${acao.nome}`);
    });
  };

  const partido=getPartido(char.partido);
  const cargo=char.cargo?getCargo(char.cargo):null;
  const leisDisponiveis=char.cargo?(LEIS[char.cargo]||[]).filter(l=>!char.leisAprovadas.find(x=>x.titulo===l.titulo)&&!char.leisRejeitadas.includes(l.titulo)):[];
  const acoesCargo=char.cargo?(ACOES_CARGO[char.cargo]||[]):[];
  const podeOrcamento=["presidente","governador","prefeito"].includes(char.cargo);
  const podeNegociar=["presidente","governador","deputadoFed","senador","deputado"].includes(char.cargo);

  const PARLAMENTARES_LIST=[
    {id:"dep1",nome:"Dep. Francisco Neto",preco:50000,risco:15,votos:3},
    {id:"dep2",nome:"Dep. Maria do Rosário",preco:80000,risco:10,votos:5},
    {id:"dep3",nome:"Sen. Carlos Bitencourt",preco:150000,risco:20,votos:8},
    {id:"dep4",nome:"Dep. Jair Barbosa",preco:30000,risco:25,votos:2},
    {id:"dep5",nome:"Sen. Ana Lúcia",preco:120000,risco:12,votos:6},
  ];

  const JORNAIS=[
    {nome:"Folha de São Paulo",cor:"#1A237E"},
    {nome:"O Globo",cor:"#006437"},
    {nome:"Estadão",cor:"#CC0000"},
    {nome:"Brasil 247",cor:"#E53935"},
    {nome:"Jornal Nacional",cor:"#0D47A1"},
  ];

  if(state==="criacao")return<TelaCriacao onConfirm={handleCriacao}/>;
  if(state==="eleicao")return<TelaEleicao char={char} cargo={eleicaoCargo} onConfirm={handleEleicao}/>;
  if(state==="crise"&&criseAtual)return<TelaCrise crise={criseAtual} onEscolha={handleEscolhaCrise}/>;
  if(state==="lei"&&leiAtual)return<TelaLei lei={leiAtual} char={char} onVotar={handleVotarLei} comprar={comprarParlamentar} list={PARLAMENTARES_LIST} comprados={parlamentaresComprados}/>;
  if(state==="aposentadoria")return<TelaAposentadoria char={char} onReinicio={()=>{setState("criacao");}}/>;

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Syne',sans-serif"}}>
      <style>{FONT}</style>
      <Notif n={notif}/>
      {/* HEADER */}
      <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"12px 18px",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2}}>
              {cargo?.icon||"🏠"} {char.nome}
            </div>
            <div style={{fontSize:10,color:C.muted,marginTop:2,fontFamily:"'Space Mono',monospace"}}>
              {cargo?cargo.nome:"Sem cargo"} · {partido?.nome||"—"} · {Math.round(char.idade)} anos · {char.ano}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:16,fontWeight:800,color:C.gold,fontFamily:"'Space Mono',monospace"}}>{fmt(char.dinheiro)}</div>
            {cargo&&<div style={{fontSize:9,color:C.muted}}>{char.mandatosRestantes} ano(s) de mandato</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:12,marginTop:8}}>
          {[["pop.",char.popularidade,C.green],["vis.",char.visibilidade,C.blue],["integ.",char.integridade,C.gold]].map(([l,v,c])=>(
            <div key={l} style={{flex:1}}>
              <div style={{fontSize:8,color:C.muted,marginBottom:2}}>{l} {Math.round(v)}%</div>
              <div style={{height:3,background:C.dim,borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${clamp(v)}%`,background:v>=60?c:v>=35?C.orange:C.red,borderRadius:2}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* TABS */}
      <div style={{display:"flex",background:C.card,borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
        {[
          ["painel","⚡ Painel"],["leis","📜 Legislar"],["poder","⚡ Poder"],
          ["negociar","💰 Negociar"],["aliancas","🤝 Alianças"],
          ["orcamento","📊 Orçamento"],["noticias","📰 Notícias"],
          ["carreira","🗺️ Carreira"],["bancadas","🤝 Bancadas"],["historico","📋 Histórico"]
        ].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"9px 14px",background:"none",border:"none",borderBottom:`2px solid ${tab===id?C.blue:"transparent"}`,color:tab===id?C.blue:C.muted,fontSize:10,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Space Mono',monospace"}}>{lbl}</button>
        ))}
      </div>
      {/* CONTEÚDO */}
      <div style={{maxWidth:640,margin:"0 auto",padding:18}}>
        {tab==="painel"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {[["👥 Popularidade",char.popularidade,C.green],["📺 Visibilidade",char.visibilidade,C.blue],["⚖️ Integridade",char.integridade,C.gold],["💰 Dinheiro",Math.min(100,char.dinheiro/100000*100),C.teal]].map(([l,v,c])=>(
                <div key={l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"12px 14px"}}>
                  <div style={{fontSize:9,color:C.muted,marginBottom:4}}>{l}</div>
                  <div style={{fontSize:20,fontWeight:800,color:v>=60?c:v>=35?C.orange:C.red,fontFamily:"'Space Mono',monospace"}}>
                    {l.includes("Dinheiro")?fmt(char.dinheiro):`${Math.round(v)}%`}
                  </div>
                </div>
              ))}
            </div>
            {char.memorias.length>0&&(
              <div style={{background:`${C.purple}11`,border:`1px solid ${C.purple}33`,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{fontSize:10,color:C.purple,marginBottom:8,fontFamily:"'Space Mono',monospace",letterSpacing:1}}>💭 MEMÓRIAS</div>
                {char.memorias.slice(-3).map((m,i)=>(
                  <div key={i} style={{fontSize:11,color:C.muted,marginBottom:4}}>({m.ano}) {m.texto}</div>
                ))}
              </div>
            )}
            {cargo?(
              <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"center"}}>
                  <span style={{fontWeight:700,fontSize:15}}>{cargo.icon} {cargo.nome}</span>
                  <Pill c={C.gold}>{char.mandatosRestantes} ano(s)</Pill>
                </div>
                <div style={{fontSize:11,color:C.muted,lineHeight:1.6}}>{cargo.descricao||""}</div>
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <Pill c={partido?.cor||C.blue}>{partido?.icon} {partido?.nome}</Pill>
                  <Pill c={C.green}>{fmt(cargo.salarioMensal)}/mês</Pill>
                </div>
                <div style={{marginTop:8,fontSize:10,color:C.muted}}>Risco de investigação: {char.riscoInvestigacao}%</div>
              </div>
            ):(
              <div style={{background:`${C.red}11`,border:`1px solid ${C.red}33`,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{fontSize:13,color:C.red,fontWeight:700,marginBottom:4}}>⚠️ Sem cargo ativo</div>
                <div style={{fontSize:11,color:C.muted}}>Vá à aba Carreira para se candidatar ou avance o tempo.</div>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {cargo&&char.mandatosRestantes>0&&(
                <button onClick={triggerCrise} style={{padding:16,background:`linear-gradient(135deg,#4A0010,${C.red})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,cursor:"pointer",gridColumn:"1/-1"}}>⚡ NOVA SITUAÇÃO / CRISE</button>
              )}
              {cargo&&char.mandatosRestantes>0&&(
                <button onClick={fimDeMandato} style={{padding:14,background:`linear-gradient(135deg,#001A4A,${C.blue})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,cursor:"pointer"}}>📅 ENCERRAR MANDATO</button>
              )}
              {!cargo&&(
                <button onClick={()=>avancarAno(1)} style={{padding:14,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,color:C.muted,fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,cursor:"pointer"}}>⏩ AVANÇAR 1 ANO</button>
              )}
              {!cargo&&(
                <button onClick={()=>avancarAno(4)} style={{padding:14,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,color:C.muted,fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,cursor:"pointer"}}>⏩ AVANÇAR 4 ANOS</button>
              )}
              <button onClick={()=>setTrocaPartido(true)} style={{padding:14,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,color:C.muted,fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,cursor:"pointer"}}>🔄 TROCAR PARTIDO</button>
              <button onClick={()=>setState("aposentadoria")} style={{padding:14,background:`${C.red}11`,border:`1px solid ${C.red}33`,borderRadius:10,color:C.red,fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,cursor:"pointer"}}>🧓 APOSENTAR</button>
            </div>
            {trocaPartido&&(
              <div style={{position:"fixed",inset:0,background:"#000000CC",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22,maxWidth:480}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2}}>🔄 Trocar de Partido</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginTop:16}}>
                    {PARTIDOS.filter(p=>p.id!==char.partido).map(p=>(
                      <button key={p.id} onClick={()=>{upChar(c=>{c.partido=p.id;addLog(c,`🔄 Trocou para ${p.full}`);});setTrocaPartido(false);notify(`Migrou para ${p.nome}`);}}
                        style={{padding:"8px",background:p.cor+"22",border:`1px solid ${p.cor}55`,borderRadius:8,color:p.cor,cursor:"pointer",fontSize:10}}>
                        {p.icon} {p.nome}
                      </button>
                    ))}
                  </div>
                  <button onClick={()=>setTrocaPartido(false)} style={{marginTop:12,width:"100%",padding:8,background:"transparent",border:`1px solid ${C.border}`,borderRadius:6,color:C.muted,cursor:"pointer"}}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        )}
        {tab==="leis"&&(
          <div>
            <p style={{fontSize:11,color:C.muted,marginBottom:16}}>Proponha leis para votação.</p>
            {leisDisponiveis.map(l=>(
              <div key={l.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:13}}>{l.titulo}</div>
                <div style={{fontSize:11,color:C.muted}}>{l.desc}</div>
                <div style={{display:"flex",gap:8,marginTop:10}}>
                  <button onClick={()=>{setLeiAtual(l);setState("lei");}} style={{flex:1,padding:"9px",background:`${C.gold}18`,border:`1px solid ${C.gold}44`,borderRadius:8,color:C.gold,fontSize:11,cursor:"pointer"}}>PROPOR</button>
                  <button onClick={()=>{upChar(c=>{c.leisRejeitadas=[...c.leisRejeitadas,l.titulo];});notify("Arquivada.");}} style={{padding:"9px 14px",background:`${C.red}11`,border:`1px solid ${C.red}33`,borderRadius:8,color:C.red,fontSize:11,cursor:"pointer"}}>ARQUIVAR</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="poder"&&cargo&&(
          <div>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2,marginBottom:16}}>{cargo.icon} PODER DE {cargo.nome.toUpperCase()}</h2>
            {acoesCargo.map(acao=>(
              <button key={acao.id} onClick={()=>executarAcao(acao)} style={{display:"block",width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:10,color:C.text,textAlign:"left",cursor:"pointer"}}>
                <div style={{fontWeight:700}}>{acao.nome}</div>
                <div style={{fontSize:11,color:C.muted}}>{acao.desc||""}</div>
              </button>
            ))}
          </div>
        )}
        {tab==="negociar"&&podeNegociar&&(
          <div>
            <div style={{background:`linear-gradient(135deg,#1A0F00,#0A0500)`,border:`1px solid ${C.gold}44`,borderRadius:14,padding:20,marginBottom:16}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:3,color:C.gold}}>💰 SALA DE NEGOCIAÇÃO</div>
              <div style={{fontSize:11,color:C.muted}}>Apoio: {apoioCongresso}%</div>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:12}}>
                {PARLAMENTARES_LIST.filter(p=>!parlamentaresComprados.includes(p.id)).map(p=>(
                  <div key={p.id} style={{background:C.dim,borderRadius:9,padding:14}}>
                    <div><strong>{p.nome}</strong> ({p.votos} votos)</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
                      <span>{fmt(p.preco)}</span>
                      <button onClick={()=>comprarParlamentar(p)} style={{padding:"6px 12px",background:C.gold,border:"none",borderRadius:6,color:"#000",cursor:"pointer"}}>Comprar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Ministérios (presidente/governador) */}
            {(char.cargo==="presidente"||char.cargo==="governador")&&(
              <div style={{background:C.card,borderRadius:14,padding:20}}>
                <h3>🏛️ Distribuir Ministérios</h3>
                {[{nome:"Saúde",partidos:["pt","psd"]},{nome:"Fazenda",partidos:["uniao","pp"]}].map(min=>(
                  <div key={min.nome} style={{marginTop:8}}>
                    <strong>{min.nome}</strong>
                    <div style={{display:"flex",gap:6}}>
                      {min.partidos.map(pid=>(
                        <button key={pid} onClick={()=>{notify(`Ministério da ${min.nome} entregue ao ${getPartido(pid)?.nome}`);setApoioCongresso(p=>p+5);}}
                          style={{padding:"4px 8px",background:`${getPartido(pid)?.cor}22`,border:`1px solid ${getPartido(pid)?.cor}44`,borderRadius:4,color:getPartido(pid)?.cor,cursor:"pointer"}}>
                          {getPartido(pid)?.icon} {getPartido(pid)?.nome}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab==="aliancas"&&(
          <div>
            <h2>🤝 SEUS ALIADOS</h2>
            {aliados.map(a=>(
              <div key={a.id} style={{background:C.card,borderRadius:10,padding:14,marginBottom:10}}>
                <strong>{a.nome}</strong> ({a.cargo})
                <div style={{marginTop:4}}>Satisfação: {a.satisfacao}%</div>
                <button onClick={()=>notify("Promessa cumprida.")} style={{padding:4,background:C.green,marginRight:6}}>Cumprir</button>
                <button onClick={()=>notify("Aliado traído!")} style={{padding:4,background:C.red}}>Trair</button>
              </div>
            ))}
          </div>
        )}
        {tab==="orcamento"&&podeOrcamento&&(
          <div>
            <h2>📊 ORÇAMENTO PÚBLICO</h2>
            {Object.entries(orcamento).map(([area,val])=>(
              <div key={area}>
                <span>{area}: {Math.round(val)}%</span>
                <input type="range" min={0} max={100} value={val} onChange={e=>{
                  const newVal=+e.target.value;
                  setOrcamento(prev=>{
                    const diff=newVal-prev[area];
                    const others=Object.keys(prev).filter(k=>k!==area);
                    const totalOthers=others.reduce((s,k)=>s+prev[k],0);
                    if(totalOthers===0)return prev;
                    const update={...prev,[area]:newVal};
                    others.forEach(k=>update[k]=Math.max(0,prev[k]-diff*(prev[k]/totalOthers)));
                    return update;
                  });
                }} style={{width:"100%"}}/>
              </div>
            ))}
            <button onClick={()=>notify("Orçamento aplicado!")} style={{marginTop:12,background:C.gold,border:"none",padding:10,borderRadius:6}}>APLICAR ORÇAMENTO</button>
          </div>
        )}
        {tab==="noticias"&&(
          <div>
            <h2>📰 ÚLTIMAS NOTÍCIAS</h2>
            {char.logEventos.slice(-5).reverse().map((ev,i)=>(
              <div key={i} style={{marginBottom:16}}>
                <div style={{fontSize:10,color:C.muted}}>{ev.ano}</div>
                {JORNAIS.map(j=>(
                  <div key={j.nome} style={{borderLeft:`4px solid ${j.cor}`,padding:"6px 12px",marginBottom:4,background:C.card}}>
                    <strong style={{color:j.cor}}>{j.nome}</strong>
                    <p style={{margin:0,fontSize:11}}>{ev.texto}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {tab==="carreira"&&(
          <div>
            <h2>🗺️ CARREIRA</h2>
            {Object.entries(CARGOS).map(([id,info])=>{
              const disabled=char.idade<info.minIdade;
              const chance=disabled?0:chancesEleicao(char,id,0);
              return(
                <div key={id} style={{opacity:disabled?0.4:1,background:C.dim,borderRadius:9,padding:12,marginBottom:8}}>
                  <div><span style={{fontSize:20}}>{info.icon}</span> <strong>{info.nome}</strong></div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>{fmt(info.salarioMensal*12)}/ano</span>
                    <span>Chance: {chance}%</span>
                    <button disabled={disabled} onClick={()=>{setEleicaoCargo(id);setState("eleicao");}}
                      style={{padding:"6px 12px",background:disabled?C.dim:C.blue,border:"none",borderRadius:6,color:"#fff",cursor:"pointer"}}>
                      Candidatar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {tab==="bancadas"&&(
          <div>
            <h2>🤝 BANCADAS</h2>
            {BANCADAS.map(b=>(
              <div key={b.id} style={{background:C.card,borderRadius:10,padding:14,marginBottom:10}}>
                <span>{b.icon} <strong>{b.nome}</strong></span>
                <div style={{marginTop:6,fontSize:11}}>Relacionamento: neutro (50%)</div>
              </div>
            ))}
          </div>
        )}
        {tab==="historico"&&(
          <div>
            <h2>📋 HISTÓRICO</h2>
            {char.logEventos.slice().reverse().map((ev,i)=>(
              <div key={i} style={{borderBottom:"1px solid #1a1a2e",padding:"6px 0"}}>
                <span style={{fontSize:10,color:C.muted}}>{ev.ano}</span> {ev.texto}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TELAS AUXILIARES ─────────────────────────────────────────────────
function TelaCriacao({onConfirm}){
  const [nome,setNome]=useState("");
  const [partido,setPartido]=useState(null);
  const [personalidade,setPersonalidade]=useState(null);
  const [bancadas,setBancadas]=useState([]);
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{FONT}</style>
      <div style={{maxWidth:450,padding:20}}>
        <h1 style={{textAlign:"center",fontFamily:"'Bebas Neue'"}}>🇧🇷 POLÍTICO</h1>
        <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome" style={{width:"100%",margin:"12px 0",padding:8,background:"#0a0a1a",border:"1px solid #333",color:"#fff"}}/>
        <div>
          <h3>Personalidade</h3>
          {PERSONALIDADES.map(p=>(
            <div key={p.id} onClick={()=>setPersonalidade(p.id)} style={{padding:8,background:personalidade===p.id?"#1a1a3a":"#0a0a1a",marginBottom:4,cursor:"pointer"}}>
              {p.icon} {p.nome}
            </div>
          ))}
        </div>
        <div>
          <h3>Partido</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:4}}>
            {PARTIDOS.map(p=>(
              <button key={p.id} onClick={()=>setPartido(p.id)} style={{background:partido===p.id?p.cor:"#111",border:"none",padding:6,color:"#fff",cursor:"pointer"}}>
                {p.icon} {p.nome}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3>Bancadas (máx 3)</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
            {BANCADAS.map(b=>(
              <button key={b.id} onClick={()=>setBancadas(p=>p.includes(b.id)?p.filter(x=>x!==b.id):[...p,b.id].slice(0,3))}
                style={{background:bancadas.includes(b.id)?b.cor:"#111",border:"none",padding:6,color:"#fff",cursor:"pointer"}}>
                {b.icon} {b.nome}
              </button>
            ))}
          </div>
        </div>
        <button disabled={!nome||!partido||!personalidade} onClick={()=>onConfirm({nome:nome.trim(),partido,personalidade,bancadaDefendida:bancadas})}
          style={{width:"100%",marginTop:20,padding:14,background:C.blue,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue'",fontSize:22,cursor:"pointer"}}>
          COMEÇAR COMO VEREADOR
        </button>
      </div>
    </div>
  );
}

function TelaEleicao({char,cargo,onConfirm}){
  const info=getCargo(cargo);
  const [gasto,setGasto]=useState(info?.salarioMensal*2||20000);
  const chance=chancesEleicao(char,cargo,gasto);
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{FONT}</style>
      <div style={{maxWidth:400,padding:20}}>
        <h2>{info?.icon} {info?.nome}</h2>
        <p style={{color:C.muted}}>{char.ano} · {getPartido(char.partido)?.nome}</p>
        <MiniBar v={char.popularidade} label="Popularidade" icon="👥" c={C.green}/>
        <MiniBar v={char.visibilidade} label="Visibilidade" icon="📺" c={C.blue}/>
        <MiniBar v={char.integridade} label="Integridade" icon="⚖️" c={C.gold}/>
        <div style={{marginTop:20}}>
          <label>Investimento de campanha</label>
          <input type="range" min={1000} max={Math.min(char.dinheiro,info?.salarioMensal*10||100000)} value={gasto} onChange={e=>setGasto(+e.target.value)} style={{width:"100%"}}/>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span>{fmt(gasto)}</span><span>Chance: {chance}%</span>
          </div>
        </div>
        <button onClick={()=>onConfirm(cargo,gasto)} style={{width:"100%",padding:14,background:C.blue,border:"none",borderRadius:10,color:"#fff",fontSize:18,marginTop:16,cursor:"pointer"}}>
          DISPUTAR ELEIÇÃO
        </button>
      </div>
    </div>
  );
}

function TelaCrise({crise,onEscolha}){
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{FONT}</style>
      <div style={{maxWidth:450}}>
        <div style={{fontSize:40,textAlign:"center"}}>{crise.icon}</div>
        <h2>{crise.titulo}</h2>
        <p style={{color:C.muted}}>{crise.desc}</p>
        {crise.opcoes.map((op,i)=>(
          <button key={i} onClick={()=>onEscolha(op)} style={{display:"block",width:"100%",padding:12,background:"#0a0a1a",border:"1px solid #333",marginTop:8,color:"#fff",textAlign:"left",cursor:"pointer"}}>
            {op.texto}
          </button>
        ))}
      </div>
    </div>
  );
}

function TelaLei({lei,char,onVotar,comprar,list,comprados}){
  const [votos,setVotos]=useState(0);
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{FONT}</style>
      <div style={{maxWidth:450}}>
        <h2>{lei.titulo}</h2>
        <p>{lei.desc}</p>
        <div style={{background:"#0a0a1a",padding:12,borderRadius:8}}>
          <strong>Comprar apoio (+{votos*4}% chance)</strong>
          {list.filter(p=>!comprados.includes(p.id)).slice(0,3).map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
              <span>{p.nome} ({p.votos} votos)</span>
              <button onClick={()=>{comprar(p);setVotos(v=>v+p.votos);}} style={{background:C.gold,border:"none",padding:"2px 8px",borderRadius:4,cursor:"pointer"}}>{fmt(p.preco)}</button>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,marginTop:16}}>
          <button onClick={()=>onVotar(lei,true,votos)} style={{flex:1,padding:12,background:C.green,border:"none",borderRadius:8,color:"#fff",cursor:"pointer"}}>Sancionar/Propor</button>
          <button onClick={()=>onVotar(lei,false)} style={{flex:1,padding:12,background:C.red,border:"none",borderRadius:8,color:"#fff",cursor:"pointer"}}>Vetar/Arquivar</button>
        </div>
      </div>
    </div>
  );
}

function TelaAposentadoria({char,onReinicio}){
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{FONT}</style>
      <div style={{textAlign:"center"}}>
        <span style={{fontSize:48}}>🧓</span>
        <h2>Fim da carreira</h2>
        <p>{char.nome} encerrou sua jornada em {char.ano}.</p>
        <button onClick={onReinicio} style={{padding:14,background:C.blue,border:"none",borderRadius:10,color:"#fff",marginTop:20,cursor:"pointer"}}>Jogar novamente</button>
      </div>
    </div>
  );
      }
