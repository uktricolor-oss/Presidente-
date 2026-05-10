import { useState, useRef, useEffect } from "react";

// ─── ESTILOS E FONTE ─────────────────────────────────────────────────
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:3px;background:#020507}::-webkit-scrollbar-thumb{background:#0D1525;border-radius:2px}`;

const C = {
  bg:"#020507",card:"#060C18",border:"#0C1628",
  text:"#DCE4F0",muted:"#344560",dim:"#08111E",
  gold:"#D4A017",green:"#10B981",red:"#EF4444",
  blue:"#3B82F6",orange:"#F59E0B",purple:"#8B5CF6",teal:"#06B6D4",
};

// ─── PARTIDOS ─────────────────────────────────────────────────────────
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

// ─── PERSONALIDADES ───────────────────────────────────────────────────
const PERSONALIDADES = [
  {id:"ideologo",  nome:"Ideólogo",    icon:"📖",cor:C.blue,
   desc:"Vota pela convicção. Rígido nos princípios, mas genuíno. Perde aliados, ganha admiradores.",
   bonus:{integridade:20,popularidade:5,dinheiro:0},
   passiva:"Sempre que trair sua ideologia, perde 15 de integridade automaticamente."},
  {id:"pragmatico",nome:"Pragmático",  icon:"🤝",cor:C.teal,
   desc:"Negocia qualquer coisa. Eficiente, mas sem princípios fixos. Chamado de fisiológico.",
   bonus:{integridade:0,popularidade:5,dinheiro:40000},
   passiva:"Tem bônus em acordos, mas a mídia te vigia com lupa."},
  {id:"populista", nome:"Populista",   icon:"📢",cor:C.orange,
   desc:"Diz o que o povo quer ouvir. Adorado pelas redes, odiado pelos técnicos e imprensa séria.",
   bonus:{integridade:-5,popularidade:25,dinheiro:0},
   passiva:"Quando a realidade bate na sua promessa, sua popularidade cai o dobro."},
  {id:"corrupto",  nome:"Oportunista", icon:"💸",cor:C.gold,
   desc:"Aceita favores. Cresce rápido. Vive com medo da imprensa. Um dia o recibo aparece.",
   bonus:{integridade:-20,popularidade:0,dinheiro:100000},
   passiva:"A cada mandato, 30% de chance de surgir um escândalo."},
  {id:"tecnico",   nome:"Técnico",     icon:"📊",cor:C.purple,
   desc:"Sabe de tudo mas não sabe fazer política. Propostas excelentes, articulação zero.",
   bonus:{integridade:15,popularidade:-5,dinheiro:0},
   passiva:"Suas leis têm 20% a mais de chance de aprovação, mas você não é querido."},
];

// ─── BANCADAS / PAUTAS ────────────────────────────────────────────────
const BANCADAS = [
  {id:"evangelica", nome:"Evangélica",     icon:"✝️", cor:"#7C3AED",desc:"Família, costumes tradicionais, contra aborto e drogas"},
  {id:"ruralista",  nome:"Ruralista",      icon:"🌾", cor:"#92400E",desc:"Agronegócio, propriedade privada, anti-regulação ambiental"},
  {id:"trabalhista",nome:"Trabalhista",    icon:"⚒️", cor:"#DC2626",desc:"Direitos trabalhistas, sindicatos, salário mínimo"},
  {id:"empresarial",nome:"Empresarial",    icon:"💼", cor:"#059669",desc:"Menos impostos, livre mercado, privatizações"},
  {id:"seguranca",  nome:"Segurança Pública",icon:"🚔",cor:"#374151",desc:"Armamento, penas duras, mão forte no crime"},
  {id:"ambiental",  nome:"Ambiental",      icon:"🌿", cor:"#10B981",desc:"Meio ambiente, sustentabilidade, contra garimpo"},
  {id:"lgbtq",      nome:"Diversidade",    icon:"🏳️‍🌈",cor:"#EC4899",desc:"Direitos LGBTQ+, diversidade e inclusão"},
  {id:"progressista",nome:"Progressista",  icon:"✊", cor:"#F59E0B",desc:"Reforma agrária, saúde pública, educação gratuita"},
];

// ─── CARGOS ───────────────────────────────────────────────────────────
const CARGOS = {
  vereador:    {nome:"Vereador",          icon:"🏙️",nivel:1,mandato:4,salarioMensal:8000,  minIdade:18,eleicaoBase:40,descricao:"Câmara Municipal. Legisla localmente, fiscaliza o prefeito, propõe leis para a cidade."},
  deputado:    {nome:"Deputado Estadual", icon:"🏛️",nivel:2,mandato:4,salarioMensal:25000, minIdade:18,eleicaoBase:50,descricao:"Assembleia Legislativa. Leis estaduais, orçamento do estado, fiscaliza o governador."},
  deputadoFed: {nome:"Deputado Federal",  icon:"🏟️",nivel:3,mandato:4,salarioMensal:35000, minIdade:21,eleicaoBase:55,descricao:"Câmara dos Deputados. Leis federais, orçamento nacional, pode pedir impeachment."},
  senador:     {nome:"Senador",           icon:"⭐",nivel:4,mandato:8,salarioMensal:35000, minIdade:35,eleicaoBase:60,descricao:"Senado Federal. Casa revisora, aprova indicações, ratifica tratados internacionais."},
  governador:  {nome:"Governador",        icon:"🗺️",nivel:4,mandato:4,salarioMensal:30000, minIdade:30,eleicaoBase:58,descricao:"Chefe do Executivo estadual. Governa o estado, assina ou veta leis estaduais."},
  presidente:  {nome:"Presidente",        icon:"🎖️",nivel:5,mandato:4,salarioMensal:30934, minIdade:35,eleicaoBase:65,descricao:"Chefe de Estado e de Governo. Comanda o Brasil, sanciona leis, representa internacionalmente."},
};

// ─── AÇÕES EXCLUSIVAS POR CARGO ───────────────────────────────────────
const ACOES_CARGO = {
  presidente: [
    {id:"vetar", nome:"Vetar projeto", desc:"Veta uma lei aprovada no Congresso (simulado)", efeito:(char,notify,upChar)=>{
      notify("Você vetou o projeto. Congresso pode derrubar o veto.", "warn");
      upChar(c=>{c.popularidade=clamp(c.popularidade-3); c.integridade=clamp(c.integridade+5);});
    }},
    {id:"mp", nome:"Editar MP", desc:"Medida Provisória com força de lei", efeito:(char,notify,upChar)=>{
      notify("MP editada. Válida por 60 dias. Visibilidade sobe.", "ok");
      upChar(c=>{c.popularidade=clamp(c.popularidade+5); c.visibilidade=clamp(c.visibilidade+15);});
    }},
    {id:"indicarSTF", nome:"Indicar STF", desc:"Nomear novo ministro do Supremo", efeito:(char,notify,upChar)=>{
      notify("Indicação enviada ao Senado. Mídia repercute.", "ok");
      upChar(c=>{c.visibilidade=clamp(c.visibilidade+20); c.integridade=clamp(c.integridade-3);});
    }},
  ],
  governador: [
    {id:"vetarEst", nome:"Vetar lei estadual", desc:"Veta projeto da Assembleia", efeito:(char,notify,upChar)=>{
      notify("Veto estadual. Perde popularidade, mas ganha integridade.", "warn");
      upChar(c=>{c.popularidade=clamp(c.popularidade-3); c.integridade=clamp(c.integridade+5);});
    }},
    {id:"decretarCalamidade", nome:"Decretar calamidade", desc:"Ajuda áreas afetadas, mas custa dinheiro", efeito:(char,notify,upChar)=>{
      if(char.dinheiro<50000) return notify("Sem verba suficiente!", "err");
      upChar(c=>{c.dinheiro-=50000; c.popularidade=clamp(c.popularidade+12); c.visibilidade=clamp(c.visibilidade+10);});
      notify("Estado de calamidade decretado. População agradece.", "ok");
    }},
  ],
  senador: [
    {id:"sabatina", nome:"Convocar sabatina", desc:"Sabatina de autoridade indicada", efeito:(char,notify,upChar)=>{
      upChar(c=>{c.visibilidade=clamp(c.visibilidade+25);});
      notify("Sabatina iniciada. Visibilidade dispara.", "ok");
    }},
    {id:"cpi", nome:"Instaurar CPI", desc:"CPI para investigar escândalo", efeito:(char,notify,upChar)=>{
      upChar(c=>{c.visibilidade=clamp(c.visibilidade+20); c.integridade=clamp(c.integridade+8);});
      notify("CPI instaurada. Mídia nacional acompanha.", "ok");
    }},
  ],
  deputadoFed: [
    {id:"emenda", nome:"Emenda parlamentar", desc:"R$100 mil para sua base eleitoral", efeito:(char,notify,upChar)=>{
      if(char.dinheiro<100000) return notify("Saldo insuficiente!", "err");
      upChar(c=>{c.dinheiro-=100000; c.popularidade=clamp(c.popularidade+15);});
      notify("Emenda enviada. Popularidade sobe na sua região.", "ok");
    }},
  ],
  deputado: [
    {id:"fiscalizar", nome:"Fiscalizar governo", desc:"Denunciar irregularidades", efeito:(char,notify,upChar)=>{
      upChar(c=>{c.visibilidade=clamp(c.visibilidade+15); c.integridade=clamp(c.integridade+5);});
      notify("Denúncia repercute na imprensa local.", "ok");
    }},
  ],
  vereador: [
    {id:"requerimento", nome:"Requerimento", desc:"Questionar prefeitura", efeito:(char,notify,upChar)=>{
      upChar(c=>{c.visibilidade=clamp(c.visibilidade+10);});
      notify("Requerimento protocolado. Prefeito terá que responder.", "ok");
    }},
  ],
};

// ─── PARLAMENTARES SUBAÇOS (para suborno) ─────────────────────────────
const PARLAMENTARES = [
  {id:"dep1", nome:"Dep. Francisco Neto", preco:50000,  risco:15, votos:3, partido:"uniao"},
  {id:"dep2", nome:"Dep. Maria do Rosário", preco:80000, risco:10, votos:5, partido:"pt"},
  {id:"dep3", nome:"Sen. Carlos Bitencourt", preco:150000, risco:20, votos:8, partido:"psd"},
  {id:"dep4", nome:"Dep. Jair Barbosa", preco:30000, risco:25, votos:2, partido:"pl"},
  {id:"dep5", nome:"Sen. Ana Lúcia", preco:120000, risco:12, votos:6, partido:"mdb"},
];

// ─── MINISTÉRIOS (coalizão) ────────────────────────────────────────────
const MINISTERIOS = [
  {id:"saude", nome:"Saúde", verba:50000000, partidos:["pt","psd","mdb"]},
  {id:"fazenda", nome:"Fazenda", verba:30000000, partidos:["psd","uniao","pp"]},
  {id:"educacao", nome:"Educação", verba:20000000, partidos:["pt","psol","rede"]},
  {id:"infra", nome:"Infraestrutura", verba:40000000, partidos:["pp","pl","uniao"]},
];

// ─── CRISES (com opções de propina/risco) ──────────────────────────────
const CRISES = {
  vereador:[
    {id:"v1",titulo:"Buraco na Rua do Bairro Popular",icon:"🕳️",
     desc:"Moradores do Jardim Esperança te procuram. Há um buraco enorme que causou acidentes.",
     opcoes:[
       {texto:"Protocolar requerimento e pressionar secretário",
        efeitos:{popularidade:+15,integridade:+8,dinheiro:-1000,visibilidade:+10},
        memoria:"Você foi atrás do buraco do Jardim Esperança. O bairro lembra.",
        consequencia:"Secretário de Obras te ignora. Você viraliza nas redes locais.",
        eficacia:70},
       {texto:"Gravar vídeo explosivo nas redes sociais",
        efeitos:{popularidade:+20,integridade:-3,dinheiro:0,visibilidade:+25},
        memoria:"Você fez barulho pelo buraco, mas a rua continua igual.",
        consequencia:"Viral nas redes! A prefeitura promete, mas não faz.",
        eficacia:30},
       {texto:"Usar sua emenda para contratar obra emergencial",
        efeitos:{popularidade:+25,integridade:+12,dinheiro:-15000,visibilidade:+8},
        memoria:"Você pagou do próprio bolso político para tapar o buraco.",
        consequencia:"Rua consertada. Bairro te adora.",
        eficacia:100},
       {texto:"Ignorar — pequeno demais para seu cargo",
        efeitos:{popularidade:-20,integridade:-10,dinheiro:0,visibilidade:+3},
        memoria:"Você ignorou o buraco. Eles não vão esquecer.",
        consequencia:"Moradores fazem faixa contra você.",
        eficacia:0},
     ]},
    {id:"v_propina",titulo:"Empresário Oferece Propina por Licitação",icon:"💼",
     desc:"Um empresário local oferece R$80.000 em troca de aprovar uma licitação superfaturada.",
     opcoes:[
       {texto:"Aceitar o dinheiro e aprovar a licitação",
        efeitos:{popularidade:-5,integridade:-40,dinheiro:+80000,visibilidade:-5},
        bancadas:{empresarial:+15,trabalhista:-20},
        memoria:"Você vendeu seu voto por R$80.000. A obra foi executada com qualidade duvidosa.",
        consequencia:"Licitação aprovada. Um jornalista começa a investigar...",
        riscoInvestigacao:60},
       {texto:"Recusar e denunciar ao Ministério Público",
        efeitos:{popularidade:+15,integridade:+25,dinheiro:0,visibilidade:+15},
        bancadas:{trabalhista:+20,progressista:+15},
        memoria:"Você recusou a propina e denunciou o esquema. Ganhou respeito.",
        consequencia:"Empresário é investigado. Você vira exemplo de integridade.",
        riscoInvestigacao:0},
       {texto:"Aceitar, mas gravar a conversa para chantageá-lo depois",
        efeitos:{popularidade:0,integridade:-20,dinheiro:+80000,visibilidade:0},
        memoria:"Você aceitou o dinheiro e ficou com a gravação. Agora tem poder sobre ele.",
        consequencia:"Empresário fica em suas mãos. Mas se a gravação vazar, você cai junto.",
        riscoInvestigacao:30},
     ]},
  ],
  deputado:[
    {id:"d1",titulo:"Privatização do Transporte Estadual",icon:"🚌",
     desc:"O governador propõe privatizar 100% do transporte. Trabalhadores em greve. Empresários apoiam.",
     opcoes:[
       {texto:"Votar contra e liderar resistência na Assembleia",
        efeitos:{popularidade:+15,integridade:+10,dinheiro:0,visibilidade:+20},
        memoria:"Você liderou a resistência à privatização do transporte. Ícone dos trabalhadores.",
        consequencia:"Projeto derrotado por 1 voto. Governador te coloca na lista negra.",
        eficacia:70},
       {texto:"Votar a favor com emendas de proteção aos trabalhadores",
        efeitos:{popularidade:+5,integridade:+5,dinheiro:+30000,visibilidade:+10},
        memoria:"Você aprovou a privatização com emendas. Ninguém ficou satisfeito.",
        consequencia:"Privatização aprovada. Emendas descumpridas 6 meses depois.",
        eficacia:100},
       {texto:"Propor modelo de concessão público-privado como alternativa",
        efeitos:{popularidade:+8,integridade:+8,dinheiro:0,visibilidade:+15},
        memoria:"Sua alternativa de concessão virou referência no estado.",
        consequencia:"Assembleia adota seu modelo. Você ganha destaque estadual.",
        eficacia:80},
       {texto:"Receber financiamento da empresa e votar a favor sem emendas",
        efeitos:{popularidade:-15,integridade:-25,dinheiro:+80000,visibilidade:+5},
        memoria:"Você vendeu seu voto na privatização. Valor exato: R$80.000.",
        consequencia:"Imprensa investiga depósito na sua conta. CPI ameaça.",
        eficacia:100},
     ]},
  ],
  deputadoFed:[
    {id:"df1",titulo:"Votação: Reforma da Previdência",icon:"👴",
     desc:"Governo federal pressiona para aumentar idade mínima de aposentadoria. Sindicatos na rua.",
     opcoes:[
       {texto:"Votar contra seguindo sua base e os sindicatos",
        efeitos:{popularidade:+15,integridade:+10,dinheiro:0,visibilidade:+20},
        memoria:"Você votou contra a reforma da previdência. Sindicatos te aplaudem.",
        consequencia:"Governo te exclui das emendas parlamentares.",
        eficacia:0},
       {texto:"Votar a favor seguindo o governo",
        efeitos:{popularidade:-15,integridade:-8,dinheiro:+50000,visibilidade:+10},
        memoria:"Você votou pela reforma. Trabalhadores queimaram seu outdoor.",
        consequencia:"Reforma aprovada. Outdoor queimado.",
        eficacia:100},
       {texto:"Propor emenda de proteção a trabalhadores e votar a favor condicionado",
        efeitos:{popularidade:+5,integridade:+8,dinheiro:+20000,visibilidade:+15},
        memoria:"Você negociou emenda e aprovou com condições. Meio-termo.",
        consequencia:"Emenda aprovada parcialmente.",
        eficacia:75},
       {texto:"Faltar na votação por 'questões de saúde'",
        efeitos:{popularidade:-10,integridade:-12,dinheiro:0,visibilidade:-5},
        memoria:"Você faltou na votação mais importante do ano. Covardia política.",
        consequencia:"Jornalistas investigam seus voos nesse dia.",
        eficacia:0},
     ]},
  ],
  senador:[
    {id:"s1",titulo:"Sabatina: Indicado Polêmico para o STF",icon:"⚖️",
     desc:"O presidente indica para o STF um jurista com declarações problemáticas sobre democracia.",
     opcoes:[
       {texto:"Rejeitar a indicação após sabatina rigorosa",
        efeitos:{popularidade:+15,integridade:+20,dinheiro:0,visibilidade:+25},
        memoria:"Você rejeitou o indicado do STF. O presidente ficou furioso.",
        consequencia:"Presidência bloqueia suas emendas. Você vira símbolo de independência.",
        eficacia:100},
       {texto:"Aprovar após negociar garantias de conduta com o indicado",
        efeitos:{popularidade:-5,integridade:+5,dinheiro:+30000,visibilidade:+15},
        memoria:"Você aprovou o indicado com 'garantias'. Garantias não vieram.",
        consequencia:"Indicado aprovado. Suas 'garantias' foram ignoradas.",
        eficacia:100},
       {texto:"Sabatina sem fim — arrastar para desgastar a indicação",
        efeitos:{popularidade:+8,integridade:+8,dinheiro:0,visibilidade:+15},
        memoria:"Você usou o regimento para atrasar a aprovação. Tática parlamentar.",
        consequencia:"Governo cede e retira o nome.",
        eficacia:85},
       {texto:"Aprovar sem questionamentos para manter aliança com o governo",
        efeitos:{popularidade:-12,integridade:-18,dinheiro:+40000,visibilidade:+5},
        memoria:"Você aprovou sem questionar. Chamado de 'senador subserviente'.",
        consequencia:"Imprensa chama de aprovação automática.",
        eficacia:100},
     ]},
  ],
  governador:[
    {id:"g1",titulo:"Rebelião em Presídio Superlotado",icon:"🔒",
     desc:"Maior presídio do estado em rebelião. 800 presos amotinados, 12 reféns.",
     opcoes:[
       {texto:"Negociar pessoalmente indo ao local para acalmar a situação",
        efeitos:{popularidade:+20,integridade:+15,dinheiro:0,visibilidade:+35},
        memoria:"Você foi pessoalmente ao presídio negociar. Raro. Impactante.",
        consequencia:"Rebelião resolvida em 6h. Você vira referência nacional.",
        eficacia:85},
       {texto:"Enviar força de choque da PM para retomada imediata",
        efeitos:{popularidade:-5,integridade:-8,dinheiro:0,visibilidade:+20},
        memoria:"Você mandou a PM. Funcionou, mas houve mortos.",
        consequencia:"4 presos mortos. Direitos humanos protestam.",
        eficacia:90},
       {texto:"Acionar mediadores do Ministério da Justiça Federal",
        efeitos:{popularidade:+8,integridade:+10,dinheiro:0,visibilidade:+12},
        memoria:"Você chamou o governo federal. Resolvido, mas crédito foi deles.",
        consequencia:"Ministro federal fica com os holofotes.",
        eficacia:80},
       {texto:"Chamar exército e decretar intervenção federal no presídio",
        efeitos:{popularidade:+3,integridade:+3,dinheiro:0,visibilidade:+15},
        memoria:"Você chamou o exército. Rebelião resolvida. Precedente perigoso.",
        consequencia:"Exército resolve. Humanistas questionam uso das forças armadas.",
        eficacia:95},
     ]},
  ],
  presidente:[
    {id:"p1",titulo:"Crise Econômica: Dólar a R$8",icon:"💵",
     desc:"Dólar disparou. Inflação em 12%. FMI oferece empréstimo com condicionantes.",
     opcoes:[
       {texto:"Aceitar o corte para acalmar o mercado e estabilizar a moeda",
        efeitos:{popularidade:-20,integridade:-5,dinheiro:+200000,visibilidade:+20},
        memoria:"Você cortou programas sociais para salvar o dólar. O povo pagou a conta.",
        consequencia:"Moeda estabiliza. 3 milhões saem da linha de pobreza novamente.",
        eficacia:100},
       {texto:"Rejeitar os cortes e criar novo imposto sobre fortunas",
        efeitos:{popularidade:+15,integridade:+12,dinheiro:-50000,visibilidade:+20},
        memoria:"Você taxou os ricos em vez de cortar os pobres. Mercado não gostou.",
        consequencia:"Mercado agita mais. Mas nova receita evita o pior. Equilíbrio difícil.",
        eficacia:60},
       {texto:"Renegociar com o FMI sem as condicionantes sociais",
        efeitos:{popularidade:+8,integridade:+10,dinheiro:+80000,visibilidade:+15},
        memoria:"Você negociou com o FMI sem entregar os pobres. Diplomacia eficaz.",
        consequencia:"Acordo melhor. Dólar cai gradualmente. Você vira referência global.",
        eficacia:80},
       {texto:"Decretar controle de capitais e fechar câmbio por 30 dias",
        efeitos:{popularidade:-5,integridade:+5,dinheiro:0,visibilidade:+15},
        memoria:"Controle de capitais. Radical. Funcionou parcialmente.",
        consequencia:"Mercado em choque. Mas especulação parou. Dólar cai 15%.",
        eficacia:65},
     ]},
  ],
};

// ─── LEIS ──────────────────────────────────────────────────────────────
const LEIS = {
  vereador:[
    {id:"lv1",titulo:"Lei do Silêncio Noturno", desc:"Proibir ruídos após 22h nas zonas residenciais.",efeitos:{popularidade:+8,integridade:+5,dinheiro:-500}},
    {id:"lv2",titulo:"Gratuidade no Ônibus para Idosos", desc:"Isenção de tarifa para maiores de 65 anos.",efeitos:{popularidade:+18,integridade:+8,dinheiro:-8000}},
  ],
  deputado:[
    {id:"ld1",titulo:"Lei Estadual de Cotas para PCDs", desc:"10% das vagas em concursos estaduais para PCDs.",efeitos:{popularidade:+12,integridade:+10,dinheiro:-5000}},
  ],
  deputadoFed:[
    {id:"ldf1",titulo:"Piso da Enfermagem Federal", desc:"R$4.750 mínimo para enfermeiros do SUS.",efeitos:{popularidade:+20,integridade:+15,dinheiro:-50000}},
  ],
  senador:[
    {id:"ls1",titulo:"Lei de Responsabilidade Climática", desc:"Metas obrigatórias de emissão para empresas.",efeitos:{popularidade:+10,integridade:+15,dinheiro:-15000}},
  ],
  presidente:[
    {id:"lp1",titulo:"Sancionei: Piso da Enfermagem", desc:"Transformei em lei o salário mínimo dos enfermeiros.",efeitos:{popularidade:+18,integridade:+15,dinheiro:-100000}},
  ],
};

// ─── MUDANÇA DE PARTIDO ────────────────────────────────────────────────
const RAZOES_MUDANCA_PARTIDO = [
  {id:"ideologia", desc:"Divergência ideológica genuína", integridade:+5, popularidade:-5},
  {id:"oportunismo",desc:"Melhores chances eleitorais",   integridade:-15,popularidade:+8},
  {id:"conflito",  desc:"Conflito com liderança",         integridade:0,  popularidade:-3},
  {id:"corrupcao", desc:"Fuga de investigação interna",   integridade:-25,popularidade:-15},
];

// ════════════════════════ HELPERS ════════════════════════════════════
const clamp = (v, mn=0, mx=100) => Math.max(mn, Math.min(mx, v));
const fmt = n => n>=1e6?`R$${(n/1e6).toFixed(1)}M`:n>=1000?`R$${(n/1000).toFixed(0)}k`:`R$${n}`;
const rand = (arr) => arr[Math.floor(Math.random()*arr.length)];
const getPartido = id => PARTIDOS.find(p=>p.id===id);
const getCargo = id => CARGOS[id];

// Chance eleitoral realista (dinheiro + ideologia + popularidade)
const chancesEleicao = (char, cargo, gastoCampanha = 0) => {
  const info = getCargo(cargo);
  if (!info) return 5;
  const base = info.eleicaoBase || 50;
  const pop = char.popularidade, vis = char.visibilidade, intg = char.integridade;
  const exp = char.historicoCargos.filter(h => h.cargo === cargo).length * 5;
  const salarioRef = info.salarioMensal * 12;
  const gastoRatio = Math.min(gastoCampanha / Math.max(salarioRef, 1), 3);
  const bonusDinheiro = Math.round(gastoRatio * 12);
  const espectroCargo = {
    vereador:{esquerda:40,centro:40,direita:20},
    deputado:{esquerda:45,centro:35,direita:20},
    deputadoFed:{esquerda:45,centro:30,direita:25},
    senador:{esquerda:40,centro:30,direita:30},
    governador:{esquerda:35,centro:35,direita:30},
    presidente:{esquerda:40,centro:30,direita:30},
  }[cargo] || {esquerda:33,centro:34,direita:33};
  const partido = getPartido(char.partido);
  const spec = partido?.spec || "centro";
  const alinhamento = espectroCargo[spec] || 33;
  const bonusIdeologia = Math.round((alinhamento - 33) * 0.5);
  const raw = (pop * 0.25) + (vis * 0.15) + (intg * 0.1) + exp + bonusDinheiro + bonusIdeologia - base + 40;
  return clamp(Math.round(raw), 5, 92);
};

// ══════════════════ COMPONENTES DE UI ══════════════════════════════════
const Pill = ({c,children,sm})=>(
  <span style={{fontSize:sm?9:10,padding:sm?"1px 7px":"2px 9px",borderRadius:12,background:c+"18",color:c,border:`1px solid ${c}28`,fontFamily:"'Space Mono',monospace",whiteSpace:"nowrap"}}>{children}</span>
);
const Notif = ({n})=>n?(
  <div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:C.card,
    border:`1px solid ${n.t==="err"?C.red:n.t==="ok"?C.green:n.t==="warn"?C.orange:C.blue}`,
    borderRadius:10,padding:"10px 22px",fontSize:11,color:C.text,maxWidth:"92vw",textAlign:"center",
    boxShadow:"0 8px 40px #000000AA",fontFamily:"'Space Mono',monospace"}}>
    {n.m}
  </div>
):null;
const MiniBar = ({v, c=C.blue, label, icon})=>{
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

// ══════════════════ ESTADO INICIAL ═════════════════════════════════════
const INIT_CHAR = {
  nome:"",idade:18,ano:2025,
  partido:null,personalidade:null,cargo:null,
  bancadaDefendida:[],
  popularidade:20,visibilidade:10,integridade:70,
  dinheiro:30000,patrimonio:30000,
  mandatosRestantes:0,
  historicoCargos:[],leisAprovadas:[],leisRejeitadas:[],
  decisoesTomadas:{},memorias:[],
  totalVitoriasEleitorais:0,totalDerrotasEleitorais:0,
  logEventos:[],escandaloAtivo:false,aposentado:false,
  riscoInvestigacao:0, lealdadePartido:70, dossies:0,
};

// ══════════════════ COMPONENTE PRINCIPAL ═══════════════════════════════
export default function PoliticoGame(){
  const [state,setState]=useState("criacao");
  const [char,setChar]=useState(INIT_CHAR);
  const [eleicaoCargo,setEleicaoCargo]=useState(null);
  const [criseAtual,setCriseAtual]=useState(null);
  const [leiAtual,setLeiAtual]=useState(null);
  const [tab,setTab]=useState("painel");
  const [notif,setNotif]=useState(null);
  const [trocaPartido,setTrocaPartido]=useState(false);
  const [criseUsadas,setCriseUsadas]=useState([]);
  const ntRef=useRef(null);
  // Novos estados para negociação e aliados
  const [aliados,setAliados]=useState([
    {id:"aliado1", nome:"Dep. Carlos Motta", cargo:"deputadoFed", partido:"mdb", exigencia:"Cargo de Ministro", satisfacao:50},
    {id:"aliado2", nome:"Sen. Lúcia Helena", cargo:"senador", partido:"psd", exigencia:"Verba para base", satisfacao:50},
  ]);
  const [parlamentaresComprados,setParlamentaresComprados]=useState([]);
  const [apoioCongresso,setApoioCongresso]=useState(20);

  const notify=(m,t="info")=>{
    setNotif({m,t});
    if(ntRef.current)clearTimeout(ntRef.current);
    ntRef.current=setTimeout(()=>setNotif(null),4000);
  };
  const upChar=(fn)=>setChar(prev=>{const n={...prev};fn(n);return n;});
  const addLog=(c,texto)=>{
    c.logEventos=[...c.logEventos,{texto,ano:c.ano,cargo:c.cargo||"civil"}];
  };

  // ── CRIAÇÃO ─────────────────────────────────────────────────────────
  const handleCriacao=(dados)=>{
    const pers=PERSONALIDADES.find(p=>p.id===dados.personalidade);
    setChar({
      ...INIT_CHAR,...dados,
      popularidade:clamp(20+(pers?.bonus.popularidade||0)),
      integridade:clamp(70+(pers?.bonus.integridade||0)),
      dinheiro:30000+(pers?.bonus.dinheiro||0),
      patrimonio:30000+(pers?.bonus.dinheiro||0),
      logEventos:[{texto:`${dados.nome} inicia carreira pelo ${getPartido(dados.partido)?.full}`,ano:2025,cargo:"civil"}],
    });
    setEleicaoCargo("vereador");
    setState("eleicao");
  };

  // ── ELEIÇÃO ─────────────────────────────────────────────────────────
  const handleEleicao=(cargo,gastoCampanha)=>{
    const chance=chancesEleicao(char,cargo,gastoCampanha);
    const ganhou=Math.random()*100<chance;
    upChar(c=>{
      c.dinheiro=Math.max(0,c.dinheiro-gastoCampanha);
      c.patrimonio=Math.max(0,c.patrimonio-gastoCampanha);
      if(ganhou){
        c.cargo=cargo;
        c.mandatosRestantes=CARGOS[cargo].mandato;
        c.totalVitoriasEleitorais++;
        c.historicoCargos=[...c.historicoCargos,{cargo,ano:c.ano,partido:c.partido}];
        addLog(c,`✅ ELEITO ${CARGOS[cargo].nome} pelo ${getPartido(c.partido)?.nome}.`);
        notify(`🎉 ELEITO ${CARGOS[cargo].nome}!`,"ok");
      } else {
        c.totalDerrotasEleitorais++;
        c.popularidade=clamp(c.popularidade-8);
        addLog(c,`❌ Derrota na eleição para ${CARGOS[cargo].nome}.`);
        notify("😞 Você perdeu a eleição. Continue se preparando.","err");
      }
    });
    setState(ganhou?"mandato":"mandato");
    setCriseUsadas([]);
    setTab("painel");
  };

  // ── CRISE ────────────────────────────────────────────────────────────
  const triggerCrise=()=>{
    const pool=(CRISES[char.cargo]||[]).filter(c=>!criseUsadas.includes(c.id));
    if(!pool.length){notify("Todas as crises deste mandato foram enfrentadas.","info");return;}
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
      c.memorias=[...c.memorias,{texto:opcao.memoria,ano:c.ano,cargo:c.cargo}];
      c.decisoesTomadas={...c.decisoesTomadas,[criseAtual.id]:opcao.texto};
      addLog(c,`⚡ ${criseAtual.titulo}: "${opcao.texto}" → ${opcao.consequencia}`);
      // Risco de investigação
      if(opcao.riscoInvestigacao){
        c.riscoInvestigacao = clamp((c.riscoInvestigacao||0) + opcao.riscoInvestigacao);
        if(c.riscoInvestigacao > 70 && Math.random() < 0.5){
          addLog(c,"🚨 Risco acumulado! Operação da PF pode estar a caminho...");
          notify("🚔 Você está na mira da Polícia Federal!","err");
        }
      }
      // Salário e avanço do mandato
      c.dinheiro+=CARGOS[c.cargo]?.salarioMensal*3||0;
      c.patrimonio+=CARGOS[c.cargo]?.salarioMensal*3||0;
      c.mandatosRestantes=Math.max(0,c.mandatosRestantes-1);
      c.ano+=1; c.idade+=1;
    });
    notify(opcao.consequencia,"warn");
    setCriseAtual(null);
    setState("mandato");
    setTab("painel");
  };

  // ── LEI ──────────────────────────────────────────────────────────────
  const handleVotarLei=(lei,votar,votosComprados=0)=>{
    if(!votar){
      upChar(c=>{c.leisRejeitadas=[...c.leisRejeitadas,lei.titulo];addLog(c,`🚫 Lei rejeitada/vetada: ${lei.titulo}`);});
      notify("Lei não proposta.","info");
      setLeiAtual(null); setState("mandato"); return;
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
      } else {
        c.leisRejeitadas=[...c.leisRejeitadas,lei.titulo];
        addLog(c,`❌ Lei rejeitada pelo plenário: ${lei.titulo}`);
      }
    });
    notify(aprov?`✅ ${lei.titulo} aprovada!`:`❌ ${lei.titulo} rejeitada no plenário.`,aprov?"ok":"err");
    setLeiAtual(null);
    setState("mandato");
  };

  // ── TROCA DE PARTIDO ──────────────────────────────────────────────────
  const handleTrocaPartido=(novoPartido,razao)=>{
    const r=RAZOES_MUDANCA_PARTIDO.find(x=>x.id===razao);
    upChar(c=>{
      addLog(c,`🔄 Trocou do ${getPartido(c.partido)?.nome} para ${getPartido(novoPartido)?.nome} — ${r?.desc}`);
      c.partido=novoPartido;
      c.integridade=clamp(c.integridade+(r?.integridade||0));
      c.popularidade=clamp(c.popularidade+(r?.popularidade||0));
      c.lealdadePartido=70; // reset após troca
    });
    notify(`Você migrou para o ${getPartido(novoPartido)?.nome}.`,"warn");
    setTrocaPartido(false);
  };

  // ── FIM DE MANDATO ───────────────────────────────────────────────────
  const fimDeMandato=()=>{
    upChar(c=>{
      addLog(c,`📅 Fim do mandato de ${getCargo(c.cargo)?.nome} em ${c.ano}.`);
      c.cargo=null; c.mandatosRestantes=0; c.ano+=1; c.idade+=1;
    });
    notify("Mandato encerrado. Decida seus próximos passos.","info");
    setState("mandato");
  };

  // ── COMPRA DE VOTOS (SUBORNO) ────────────────────────────────────────
  const comprarParlamentar=(parlamentar)=>{
    if(char.dinheiro < parlamentar.preco){
      notify("💰 Dinheiro insuficiente para comprar esse voto!","err");
      return;
    }
    const foiDescoberto = Math.random()*100 < parlamentar.risco;
    upChar(c=>{
      c.dinheiro=Math.max(0,c.dinheiro-parlamentar.preco);
      c.integridade=clamp(c.integridade-15);
      c.riscoInvestigacao=clamp((c.riscoInvestigacao||0)+(foiDescoberto?40:10));
      if(foiDescoberto){
        c.popularidade=clamp(c.popularidade-20);
        c.escandaloAtivo=true;
        addLog(c,`🚨 ESCÂNDALO! Suborno ao ${parlamentar.nome} vazou para a imprensa!`);
        notify("🚨 A Polícia Federal foi informada! Escândalo nacional!","err");
      } else {
        addLog(c,`💸 ${parlamentar.nome} recebeu R$${parlamentar.preco.toLocaleString()} e votará a favor.`);
        notify(`✅ ${parlamentar.nome} garantiu voto por R$${parlamentar.preco.toLocaleString()}`,"ok");
      }
    });
    setParlamentaresComprados(p=>[...p, parlamentar.id]);
    setApoioCongresso(p=>Math.min(100,p+parlamentar.votos));
  };

  // ── DISTRIBUIR MINISTÉRIOS ────────────────────────────────────────────
  const distribuirMinisterio=(ministerio, partidoDestino)=>{
    if(char.dinheiro < 100000){ notify("Sem fundos para negociar ministérios.","err"); return; }
    upChar(c=>{
      c.dinheiro-=100000;
      c.visibilidade=clamp(c.visibilidade+8);
      addLog(c,`🏛️ Ministério da ${ministerio.nome} entregue ao ${getPartido(partidoDestino)?.nome}`);
    });
    setApoioCongresso(p=>Math.min(100,p+12));
    notify(`✅ ${getPartido(partidoDestino)?.nome} agora apoia seu governo!`,"ok");
  };

  // ── ALIANÇAS (cuprir promessa / trair) ────────────────────────────────
  const cumprirPromessa=(aliadoId)=>{
    const aliado=aliados.find(a=>a.id===aliadoId);
    if(!aliado) return;
    upChar(c=>{
      c.dinheiro=Math.max(0,c.dinheiro-50000);
      addLog(c,`✅ Promessa cumprida com ${aliado.nome}.`);
      setAliados(prev=>prev.map(a=>a.id===aliadoId?{...a,satisfacao:100}:a));
    });
    notify(`Promessa cumprida! ${aliado.nome} agora é um aliado fiel.`,"ok");
  };
  const trairAliado=(aliadoId)=>{
    const aliado=aliados.find(a=>a.id===aliadoId);
    if(!aliado) return;
    upChar(c=>{
      c.popularidade=clamp(c.popularidade-10);
      c.integridade=clamp(c.integridade-15);
      addLog(c,`💔 Traiu ${aliado.nome}. Ele se tornou um inimigo político.`);
      setAliados(prev=>prev.map(a=>a.id===aliadoId?{...a,satisfacao:0}:a));
    });
    notify(`${aliado.nome} se tornou seu inimigo declarado!`,"err");
  };

  // ── AÇÕES DE PODER ───────────────────────────────────────────────────
  const executarAcaoPoder=(acao)=>{
    acao.efeito(char,notify,upChar);
  };

  // ═══════════════════════ RENDER ═════════════════════════════════════
  const partido = getPartido(char.partido);
  const cargo = char.cargo ? getCargo(char.cargo) : null;
  const leisDisponiveis = char.cargo ? (LEIS[char.cargo]||[]).filter(l=>!char.leisAprovadas.find(x=>x.titulo===l.titulo)&&!char.leisRejeitadas.includes(l.titulo)) : [];
  const acoesCargo = char.cargo ? ACOES_CARGO[char.cargo] || [] : [];
  const podeNegociar = char.cargo && ["presidente","governador","deputadoFed","senador","deputado"].includes(char.cargo);

  if(state==="criacao")return<TelaCriacao onConfirm={handleCriacao}/>;
  if(state==="eleicao")return<TelaEleicao char={char} cargo={eleicaoCargo} onConfirm={handleEleicao}/>;
  if(state==="crise"&&criseAtual)return<TelaCrise crise={criseAtual} char={char} partido={partido} cargo={cargo} onEscolha={handleEscolhaCrise}/>;
  if(state==="lei"&&leiAtual)return<TelaLei lei={leiAtual} char={char} cargo={cargo} onVotar={handleVotarLei} comprarParlamentar={comprarParlamentar} parlamentaresComprados={parlamentaresComprados}/>;
  if(state==="aposentadoria")return<TelaAposentadoria char={char} partido={partido} onReinicio={()=>{setChar(INIT_CHAR);setState("criacao");}}/>;

  return (
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
            {cargo&&<div style={{fontSize:9,color:C.muted,fontFamily:"'Space Mono',monospace"}}>{char.mandatosRestantes} ano{char.mandatosRestantes!==1?"s":""} de mandato</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:12,marginTop:8}}>
          {[["pop.",char.popularidade,C.green],["vis.",char.visibilidade,C.blue],["integ.",char.integridade,C.gold]].map(([l,v,c])=>(
            <div key={l} style={{flex:1}}>
              <div style={{fontSize:8,color:C.muted,marginBottom:2,fontFamily:"'Space Mono',monospace"}}>{l} {Math.round(v)}%</div>
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
          ["negociar","💰 Negociar"],["aliancas","🤝 Alianças"],["carreira","🗺️ Carreira"],
          ["bancadas","🤝 Bancadas"],["historico","📋 Histórico"]
        ].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{padding:"9px 14px",background:"none",border:"none",borderBottom:`2px solid ${tab===id?C.blue:"transparent"}`,color:tab===id?C.blue:C.muted,fontSize:10,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Space Mono',monospace"}}>
            {lbl}
          </button>
        ))}
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:18}}>

        {/* PAINEL */}
        {tab==="painel"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {[["👥 Popularidade",char.popularidade,C.green],["📺 Visibilidade",char.visibilidade,C.blue],["⚖️ Integridade",char.integridade,C.gold],["💰 Dinheiro",Math.min(100,char.dinheiro/100000*100),C.teal]].map(([l,v,c])=>(
                <div key={l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"12px 14px"}}>
                  <div style={{fontSize:9,color:C.muted,marginBottom:4,fontFamily:"'Space Mono',monospace"}}>{l}</div>
                  <div style={{fontSize:20,fontWeight:800,color:v>=60?c:v>=35?C.orange:C.red,fontFamily:"'Space Mono',monospace"}}>
                    {l.includes("Dinheiro")?fmt(char.dinheiro):`${Math.round(v)}%`}
                  </div>
                </div>
              ))}
            </div>
            {char.memorias.length>0&&(
              <div style={{background:`${C.purple}11`,border:`1px solid ${C.purple}33`,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{fontSize:10,color:C.purple,marginBottom:8,fontFamily:"'Space Mono',monospace",letterSpacing:1}}>💭 MEMÓRIAS QUE VOLTAM</div>
                {char.memorias.slice(-3).map((m,i)=>(
                  <div key={i} style={{fontSize:11,color:C.muted,marginBottom:4,lineHeight:1.5,fontFamily:"'Syne',sans-serif"}}>
                    <span style={{color:C.purple,fontSize:9}}>({m.ano}) </span>{m.texto}
                  </div>
                ))}
              </div>
            )}
            {cargo?(
              <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"center"}}>
                  <span style={{fontWeight:700,fontSize:15}}>{cargo.icon} {cargo.nome}</span>
                  <Pill c={C.gold}>{char.mandatosRestantes} ano{char.mandatosRestantes!==1?"s":""} restante{char.mandatosRestantes!==1?"s":""}</Pill>
                </div>
                <div style={{fontSize:11,color:C.muted,lineHeight:1.6,marginBottom:10,fontFamily:"'Syne',sans-serif"}}>{cargo.descricao}</div>
                <div style={{display:"flex",gap:8}}>
                  <Pill c={partido?.cor||C.blue}>{partido?.icon} {partido?.nome}</Pill>
                  <Pill c={C.green}>{fmt(cargo.salarioMensal)}/mês</Pill>
                </div>
                <div style={{marginTop:8,fontSize:10,color:C.muted}}>Risco de investigação: {char.riscoInvestigacao||0}%</div>
              </div>
            ):(
              <div style={{background:`${C.red}11`,border:`1px solid ${C.red}33`,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{fontSize:13,color:C.red,fontWeight:700,marginBottom:4}}>⚠️ Sem cargo ativo</div>
                <div style={{fontSize:11,color:C.muted}}>Vá à aba Carreira para se candidatar a um novo cargo.</div>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {cargo&&char.mandatosRestantes>0&&(
                <button onClick={triggerCrise}
                  style={{padding:16,background:`linear-gradient(135deg,#4A0010,${C.red})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,cursor:"pointer",gridColumn:"1/-1"}}>
                  ⚡ NOVA SITUAÇÃO / CRISE
                </button>
              )}
              {cargo&&char.mandatosRestantes<=0&&(
                <button onClick={fimDeMandato}
                  style={{padding:14,background:`linear-gradient(135deg,#001A4A,${C.blue})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,cursor:"pointer"}}>
                  📅 ENCERRAR MANDATO
                </button>
              )}
              <button onClick={()=>setTrocaPartido(true)}
                style={{padding:14,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,color:C.muted,fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,cursor:"pointer"}}>
                🔄 TROCAR PARTIDO
              </button>
              <button onClick={()=>setState("aposentadoria")}
                style={{padding:14,background:`${C.red}11`,border:`1px solid ${C.red}33`,borderRadius:10,color:C.red,fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,cursor:"pointer",gridColumn:cargo&&char.mandatosRestantes<=0?"":""}}>
                🧓 APOSENTAR
              </button>
            </div>
            {trocaPartido&&(
              <div style={{position:"fixed",inset:0,background:"#000000CC",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22,maxWidth:480,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,marginBottom:4}}>🔄 TROCAR DE PARTIDO</div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:16,fontFamily:"'Space Mono',monospace"}}>Atual: {partido?.fullName}</div>
                  <div style={{fontSize:11,color:C.orange,marginBottom:16,fontFamily:"'Syne',sans-serif"}}>⚠️ Trocar de partido tem consequências. Escolha o motivo com cuidado — afetará sua integridade e popularidade.</div>
                  {RAZOES_MUDANCA_PARTIDO.map(r=>(
                    <div key={r.id} style={{background:C.dim,borderRadius:8,padding:12,marginBottom:8}}>
                      <div style={{fontWeight:700,fontSize:12,marginBottom:4}}>{r.desc}</div>
                      <div style={{display:"flex",gap:6,marginBottom:8}}>
                        <Pill c={r.integridade>=0?C.green:C.red} sm>{r.integridade>=0?"+":""}{r.integridade} integ.</Pill>
                        <Pill c={r.popularidade>=0?C.green:C.red} sm>{r.popularidade>=0?"+":""}{r.popularidade} pop.</Pill>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
                        {PARTIDOS.filter(p=>p.id!==char.partido).map(p=>(
                          <button key={p.id} onClick={()=>handleTrocaPartido(p.id,r.id)}
                            style={{padding:"6px 4px",background:p.cor+"22",border:`1px solid ${p.cor}55`,borderRadius:6,cursor:"pointer",fontSize:10,color:p.cor,fontFamily:"'Space Mono',monospace"}}>
                            {p.icon} {p.nome}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={()=>setTrocaPartido(false)} style={{marginTop:10,width:"100%",padding:10,background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",fontSize:11}}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LEGISLAR */}
        {tab==="leis"&&(
          <div>
            <p style={{fontSize:11,color:C.muted,marginBottom:16,lineHeight:1.7}}>
              {char.cargo==="presidente"?"Como presidente, você recebe propostas para sancionar ou vetar, e pode editar Medidas Provisórias.":"Proponha leis para votação. O resultado depende da sua popularidade, apoio das bancadas e imprevistos políticos."}
            </p>
            {leisDisponiveis.length===0?(
              <div style={{textAlign:"center",padding:40,color:C.muted,fontSize:12}}>Nenhuma proposta disponível no momento.</div>
            ):leisDisponiveis.map(l=>(
              <div key={l.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:5}}>{l.titulo}</div>
                <div style={{fontSize:11,color:C.muted,lineHeight:1.6,marginBottom:12}}>{l.desc}</div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{setLeiAtual(l);setState("lei");}}
                    style={{flex:1,padding:"9px",background:`${C.gold}18`,border:`1px solid ${C.gold}44`,borderRadius:8,color:C.gold,fontSize:11,cursor:"pointer",fontFamily:"'Space Mono',monospace"}}>
                    {char.cargo==="presidente"?"✍️ SANCIONAR":"📜 PROPOR"}
                  </button>
                  <button onClick={()=>{upChar(c=>{c.leisRejeitadas=[...c.leisRejeitadas,l.titulo];addLog(c,`🚫 ${l.titulo} — não proposta.`);});notify("Não proposta.","info");}}
                    style={{padding:"9px 14px",background:`${C.red}11`,border:`1px solid ${C.red}33`,borderRadius:8,color:C.red,fontSize:11,cursor:"pointer",fontFamily:"'Space Mono',monospace"}}>
                    {char.cargo==="presidente"?"VETAR":"ARQUIVAR"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PODER */}
        {tab==="poder"&&cargo&&(
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2,marginBottom:16}}>
              {cargo.icon} PODER DE {cargo.nome.toUpperCase()}
            </div>
            {acoesCargo.map(acao=>(
              <button key={acao.id} onClick={()=>executarAcaoPoder(acao)}
                style={{display:"block",width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:10,color:C.text,textAlign:"left",cursor:"pointer"}}>
                <div style={{fontWeight:700}}>{acao.nome}</div>
                <div style={{fontSize:11,color:C.muted}}>{acao.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* NEGOCIAR (SUBORNO E COALIZÃO) */}
        {tab==="negociar"&&(
          <div>
            <div style={{background:`linear-gradient(135deg,#1A0F00,#0A0500)`,border:`1px solid ${C.gold}44`,borderRadius:14,padding:20,marginBottom:16}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:3,color:C.gold,marginBottom:4}}>💰 SALA DE NEGOCIAÇÃO</div>
              <div style={{fontSize:11,color:C.muted,fontFamily:"'Space Mono',monospace",marginBottom:16}}>
                Apoio no Congresso: <span style={{color:apoioCongresso>60?C.green:apoioCongresso>35?C.orange:C.red,fontWeight:700}}>{apoioCongresso}%</span>
              </div>
              <div style={{height:6,background:C.dim,borderRadius:3,overflow:"hidden",marginBottom:20}}>
                <div style={{height:"100%",width:`${apoioCongresso}%`,background:apoioCongresso>60?C.green:apoioCongresso>35?C.orange:C.red,borderRadius:3}}/>
              </div>
              <div style={{fontSize:11,color:C.muted,letterSpacing:2,marginBottom:14,fontFamily:"'Space Mono',monospace"}}>PARLAMENTARES DISPONÍVEIS</div>
              {PARLAMENTARES.filter(p=>!parlamentaresComprados.includes(p.id)).map(parlamentar=>(
                <div key={parlamentar.id} style={{background:C.dim,border:`1px solid ${C.border}`,borderRadius:9,padding:14,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>{parlamentar.nome}</div>
                      <div style={{fontSize:10,color:C.muted,fontFamily:"'Space Mono',monospace"}}>Votos: {parlamentar.votos}</div>
                    </div>
                    <Pill c={C.gold}>{fmt(parlamentar.preco)}</Pill>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                    <span style={{fontSize:9,color:C.muted}}>Risco:</span>
                    <div style={{height:4,flex:1,background:C.dim,borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${parlamentar.risco}%`,background:parlamentar.risco>20?C.red:parlamentar.risco>10?C.orange:C.green,borderRadius:2}}/>
                    </div>
                    <span style={{fontSize:9,color:parlamentar.risco>20?C.red:parlamentar.risco>10?C.orange:C.green,fontFamily:"'Space Mono',monospace"}}>{parlamentar.risco}%</span>
                  </div>
                  <button onClick={()=>comprarParlamentar(parlamentar)}
                    style={{width:"100%",padding:"9px",background:`linear-gradient(135deg,#2A1800,${C.gold})`,border:"none",borderRadius:8,color:"#fff",fontSize:11,cursor:"pointer",fontFamily:"'Space Mono',monospace"}}>
                    💸 COMPRAR VOTO
                  </button>
                </div>
              ))}
            </div>
            {(char.cargo==="presidente"||char.cargo==="governador")&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:3,marginBottom:4,color:C.blue}}>🏛️ DISTRIBUIR MINISTÉRIOS / SECRETARIAS</div>
                {MINISTERIOS.map(min=>(
                  <div key={min.id} style={{background:C.dim,border:`1px solid ${C.border}`,borderRadius:9,padding:14,marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div><span style={{fontWeight:700,fontSize:14}}>📋 {min.nome}</span></div>
                      <Pill c={C.muted}>{fmt(min.verba)}</Pill>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                      {min.partidos.map(pid=>{
                        const p=getPartido(pid);
                        return p?(
                          <button key={pid} onClick={()=>distribuirMinisterio(min,pid)}
                            style={{padding:"8px 6px",background:`${p.cor}22`,border:`1px solid ${p.cor}44`,borderRadius:6,color:p.cor,fontSize:10,cursor:"pointer",fontFamily:"'Space Mono',monospace"}}>
                            {p.icon} {p.nome}
                          </button>
                        ):null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALIANÇAS */}
        {tab==="aliancas"&&(
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2,marginBottom:16}}>🤝 SEUS ALIADOS</div>
            {aliados.map(aliado=>(
              <div key={aliado.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <div style={{fontWeight:700}}>{aliado.nome}</div>
                  <Pill c={aliado.satisfacao>70?C.green:aliado.satisfacao>30?C.orange:C.red}>{aliado.satisfacao}% satisfação</Pill>
                </div>
                <div style={{fontSize:11,color:C.muted,marginBottom:10}}>{aliado.exigencia} · {aliado.cargo} ({getPartido(aliado.partido)?.nome})</div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>cumprirPromessa(aliado.id)} style={{flex:1,padding:"8px",background:`${C.green}22`,border:`1px solid ${C.green}44`,borderRadius:6,color:C.green,cursor:"pointer"}}>Cumprir promessa</button>
                  <button onClick={()=>trairAliado(aliado.id)} style={{flex:1,padding:"8px",background:`${C.red}22`,border:`1px solid ${C.red}44`,borderRadius:6,color:C.red,cursor:"pointer"}}>Trair</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CARREIRA */}
        {tab==="carreira"&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:16}}>
              <div style={{fontSize:11,color:C.muted,letterSpacing:2,marginBottom:12,fontFamily:"'Space Mono',monospace"}}>SE CANDIDATAR A NOVO CARGO</div>
              {Object.entries(CARGOS).map(([id,info])=>{
                const minIdade=info.minIdade;
                const disabled=Math.round(char.idade)<minIdade;
                const chance=disabled?0:chancesEleicao(char,id,0);
                const semDinheiro=char.dinheiro<info.salarioMensal*2;
                return(
                  <div key={id} style={{background:C.dim,border:`1px solid ${disabled||semDinheiro?C.dim:C.border}`,borderRadius:9,padding:12,marginBottom:8,opacity:disabled?.4:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:disabled?0:8}}>
                      <div>
                        <span style={{fontSize:18,marginRight:8}}>{info.icon}</span>
                        <span style={{fontWeight:700,fontSize:13,color:disabled?C.muted:C.text}}>{info.nome}</span>
                        {char.cargo===id&&<span style={{marginLeft:8}}><Pill c={C.gold} sm>cargo atual</Pill></span>}
                      </div>
                      {disabled?<Pill c={C.muted} sm>mín. {minIdade} anos</Pill>:
                        <Pill c={chance>=60?C.green:chance>=40?C.orange:C.red} sm>{chance}% chance</Pill>}
                    </div>
                    {!disabled&&(
                      <div style={{display:"flex",gap:6,justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{display:"flex",gap:4}}>
                          <Pill c={C.muted} sm>{fmt(info.salarioMensal)}/mês</Pill>
                          <Pill c={C.muted} sm>{info.mandato} anos</Pill>
                        </div>
                        <button onClick={()=>{setEleicaoCargo(id);setState("eleicao");}} disabled={semDinheiro}
                          style={{padding:"5px 14px",background:semDinheiro?"transparent":`${C.blue}22`,border:`1px solid ${semDinheiro?C.muted+"33":C.blue}`,borderRadius:6,color:semDinheiro?C.muted:C.blue,fontSize:10,cursor:semDinheiro?"not-allowed":"pointer",fontFamily:"'Space Mono',monospace"}}>
                          {semDinheiro?"sem verba":"CANDIDATAR"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
              <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:10,fontFamily:"'Space Mono',monospace"}}>ESTATÍSTICAS</div>
              {[["Eleições vencidas",char.totalVitoriasEleitorais],["Eleições perdidas",char.totalDerrotasEleitorais],["Leis aprovadas",char.leisAprovadas.length],["Cargos exercidos",char.historicoCargos.length]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.dim}`,fontSize:11}}>
                  <span style={{color:C.muted,fontFamily:"'Syne',sans-serif"}}>{l}</span>
                  <span style={{color:C.text,fontFamily:"'Space Mono',monospace"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BANCADAS */}
        {tab==="bancadas"&&(
          <div>
            <p style={{fontSize:11,color:C.muted,marginBottom:16,lineHeight:1.7}}>Suas escolhas nas crises constroem ou destroem relacionamentos com as bancadas.</p>
            {BANCADAS.map(b=>{
              const score=50; // simplificado, poderia ser calculado dinamicamente
              return(
                <div key={b.id} style={{background:C.card,border:`1px solid ${b.cor}33`,borderRadius:10,padding:14,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div>
                      <span style={{fontSize:20,marginRight:8}}>{b.icon}</span>
                      <span style={{fontWeight:700,fontSize:13,color:b.cor}}>{b.nome}</span>
                    </div>
                    <Pill c={b.cor}>{score>=60?"apoiador":score>=40?"neutro":"opositor"}</Pill>
                  </div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:10}}>{b.desc}</div>
                  <div style={{height:4,background:C.dim,borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${score}%`,background:b.cor,borderRadius:2}}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* HISTÓRICO */}
        {tab==="historico"&&(
          <div>
            {char.logEventos.length===0?(
              <div style={{textAlign:"center",padding:40,color:C.muted,fontSize:12}}>Nenhum evento ainda.</div>
            ):[...char.logEventos].reverse().map((e,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:9,color:C.muted,fontFamily:"'Space Mono',monospace"}}>{e.ano}</span>
                  <span style={{fontSize:9,color:C.muted,fontFamily:"'Space Mono',monospace"}}>{e.cargo||"civil"}</span>
                </div>
                <div style={{fontSize:12,color:C.text,lineHeight:1.5,fontFamily:"'Syne',sans-serif"}}>{e.texto}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════ TELAS AUXILIARES ════════════════════════════════
function TelaCriacao({onConfirm}){
  const [nome,setNome]=useState("");
  const [partido,setPartido]=useState(null);
  const [personalidade,setPersonalidade]=useState(null);
  const [bancadas,setBancadas]=useState([]);
  const ok=nome.trim().length>=2&&partido&&personalidade;
  const toggleBancada=id=>setBancadas(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id].slice(0,3));
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Syne',sans-serif",padding:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <style>{FONT}</style>
      <div style={{maxWidth:560,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:48,marginBottom:6}}>🇧🇷</div>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(44px,10vw,64px)",letterSpacing:5,lineHeight:1}}>POLÍTICO</h1>
          <p style={{color:C.muted,fontSize:10,letterSpacing:4,marginTop:4,fontFamily:"'Space Mono',monospace"}}>RPG DE CARREIRA POLÍTICA BRASILEIRA</p>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:12}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:10,fontFamily:"'Space Mono',monospace"}}>① SEU NOME</div>
          <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Como o povo vai te chamar?"
            style={{width:"100%",background:"transparent",border:"none",borderBottom:`1px solid ${C.border}`,color:C.text,fontSize:18,padding:"6px 0",outline:"none",fontWeight:700}}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:12}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:12,fontFamily:"'Space Mono',monospace"}}>② SUA PERSONALIDADE</div>
          {PERSONALIDADES.map(p=>(
            <button key={p.id} onClick={()=>setPersonalidade(p.id)}
              style={{width:"100%",background:personalidade===p.id?`${p.cor}18`:C.dim,border:`1px solid ${personalidade===p.id?p.cor:C.border}`,borderRadius:9,padding:"12px 14px",textAlign:"left",cursor:"pointer",marginBottom:6,transition:"all .2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontWeight:700,fontSize:13,color:personalidade===p.id?p.cor:C.text}}>{p.icon} {p.nome}</span>
                <div style={{display:"flex",gap:4}}>
                  {p.bonus.popularidade!==0&&<Pill c={p.bonus.popularidade>0?C.green:C.red} sm>{p.bonus.popularidade>0?"+":""}{p.bonus.popularidade} pop.</Pill>}
                  {p.bonus.integridade!==0&&<Pill c={p.bonus.integridade>0?C.green:C.red} sm>{p.bonus.integridade>0?"+":""}{p.bonus.integridade} integ.</Pill>}
                  {p.bonus.dinheiro!==0&&<Pill c={p.bonus.dinheiro>0?C.green:C.red} sm>{p.bonus.dinheiro>0?"+":""}R${(p.bonus.dinheiro/1000).toFixed(0)}k</Pill>}
                </div>
              </div>
              <div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{p.desc}</div>
              <div style={{fontSize:10,color:C.orange,marginTop:4}}>⚠️ {p.passiva}</div>
            </button>
          ))}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:12}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:12,fontFamily:"'Space Mono',monospace"}}>③ SEU PARTIDO</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
            {PARTIDOS.map(p=>(
              <button key={p.id} onClick={()=>setPartido(p.id)}
                style={{padding:"8px 4px",background:partido===p.id?`${p.cor}22`:C.dim,border:`1px solid ${partido===p.id?p.cor:C.border}`,borderRadius:8,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                <div style={{fontSize:16}}>{p.icon}</div>
                <div style={{fontSize:11,fontWeight:700,color:partido===p.id?p.cor:C.text}}>{p.nome}</div>
                <div style={{fontSize:8,color:C.muted,fontFamily:"'Space Mono',monospace"}}>{p.spec}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:20}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:8,fontFamily:"'Space Mono',monospace"}}>④ BANCADAS QUE VOCÊ DEFENDE (máx. 3)</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {BANCADAS.map(b=>(
              <button key={b.id} onClick={()=>toggleBancada(b.id)}
                style={{padding:"8px 10px",background:bancadas.includes(b.id)?`${b.cor}22`:C.dim,border:`1px solid ${bancadas.includes(b.id)?b.cor:C.border}`,borderRadius:8,cursor:"pointer",textAlign:"left",transition:"all .2s"}}>
                <span style={{fontSize:14,marginRight:6}}>{b.icon}</span>
                <span style={{fontSize:11,fontWeight:700,color:bancadas.includes(b.id)?b.cor:C.text}}>{b.nome}</span>
              </button>
            ))}
          </div>
        </div>
        <button onClick={()=>ok&&onConfirm({nome:nome.trim(),partido,personalidade,bancadaDefendida:bancadas})} disabled={!ok}
          style={{width:"100%",padding:18,background:ok?`linear-gradient(135deg,#1A3A80,${C.blue})`:"#0B1220",border:"none",borderRadius:12,color:ok?"#fff":C.muted,fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:4,cursor:ok?"pointer":"not-allowed",transition:"all .3s"}}>
          COMEÇAR COMO VEREADOR
        </button>
      </div>
    </div>
  );
}

function TelaEleicao({char,cargo,onConfirm}){
  const info=getCargo(cargo);
  const partido=getPartido(char.partido);
  const [gasto,setGasto]=useState(info?.salarioMensal*2||20000);
  const [fase,setFase]=useState("prep");
  const [resultado,setResultado]=useState(null);
  const chance=chancesEleicao(char,cargo,gasto);
  const disputar=()=>{
    if(gasto>char.dinheiro)return;
    const g=Math.random()*100<chance;
    setResultado({ganhou:g});setFase("resultado");
  };
  if(fase==="resultado")return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.text,padding:20}}>
      <style>{FONT}</style>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:72,marginBottom:12}}>{resultado.ganhou?"🎉":"😞"}</div>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:48,color:resultado.ganhou?C.green:C.red,letterSpacing:4,marginBottom:8}}>{resultado.ganhou?"ELEITO!":"DERROTA"}</h2>
        <p style={{color:C.muted,fontSize:13,marginBottom:24,lineHeight:1.6}}>{resultado.ganhou?`Você foi eleito ${info?.nome} pelo ${partido?.nome}.`:`Você perdeu a eleição.`}</p>
        <button onClick={()=>onConfirm(cargo,gasto)}
          style={{width:"100%",padding:16,background:resultado.ganhou?`linear-gradient(135deg,#003A18,${C.green})`:`linear-gradient(135deg,#3A0010,${C.red})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:3,cursor:"pointer"}}>
          {resultado.ganhou?"TOMAR POSSE":"CONTINUAR"}
        </button>
      </div>
    </div>
  );
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,padding:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{FONT}</style>
      <div style={{maxWidth:520,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:8}}>{info?.icon}</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:3}}>{info?.nome.toUpperCase()}</h2>
          <p style={{color:C.muted,fontSize:10,fontFamily:"'Space Mono',monospace"}}>{char.ano} · {partido?.icon} {partido?.nome}</p>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
          <MiniBar label="Popularidade" value={char.popularidade} icon="👥" c={C.green}/>
          <MiniBar label="Visibilidade" value={char.visibilidade} icon="📺" c={C.blue}/>
          <MiniBar label="Integridade" value={char.integridade} icon="⚖️" c={C.gold}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:14}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:12,fontFamily:"'Space Mono',monospace"}}>INVESTIMENTO DE CAMPANHA</div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:11}}>
            <span style={{color:C.muted}}>Seu saldo</span>
            <span style={{color:char.dinheiro>gasto?C.green:C.red,fontFamily:"'Space Mono',monospace"}}>{fmt(char.dinheiro)}</span>
          </div>
          <input type="range" min={1000} max={Math.min(char.dinheiro,info?.salarioMensal*10||100000)} value={gasto} onChange={e=>setGasto(Number(e.target.value))}
            style={{width:"100%",marginBottom:8}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.muted}}>
            <span>{fmt(gasto)}</span>
            <span>Chance: {chance}%</span>
          </div>
        </div>
        <button onClick={disputar} disabled={gasto>char.dinheiro}
          style={{width:"100%",padding:18,background:gasto>char.dinheiro?C.dim:`linear-gradient(135deg,#1A3A80,${C.blue})`,border:"none",borderRadius:12,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:4,cursor:gasto>char.dinheiro?"not-allowed":"pointer",transition:"all .3s"}}>
          DISPUTAR ELEIÇÃO
        </button>
      </div>
    </div>
  );
}

function TelaCrise({crise,char,partido,cargo,onEscolha}){
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,padding:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <style>{FONT}</style>
      <div style={{maxWidth:560,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:40}}>{crise.icon}</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(30px,7vw,44px)",letterSpacing:2}}>{crise.titulo}</h2>
          <p style={{color:C.muted,fontSize:12,lineHeight:1.7,marginTop:10}}>{crise.desc}</p>
        </div>
        {crise.opcoes.map((op,i)=>(
          <button key={i} onClick={()=>onEscolha(op)}
            style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:10,textAlign:"left",color:C.text,cursor:"pointer"}}>
            <div style={{fontWeight:700,marginBottom:6}}>{op.texto}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:6}}>
              {op.efeitos.popularidade!==0&&<Pill c={op.efeitos.popularidade>0?C.green:C.red}>{op.efeitos.popularidade>0?"+":""}{op.efeitos.popularidade}% pop.</Pill>}
              {op.efeitos.integridade!==0&&<Pill c={op.efeitos.integridade>0?C.green:C.red}>{op.efeitos.integridade>0?"+":""}{op.efeitos.integridade}% integ.</Pill>}
              {op.efeitos.dinheiro!==0&&<Pill c={op.efeitos.dinheiro>0?C.green:C.red}>{op.efeitos.dinheiro>0?"+":""}{fmt(op.efeitos.dinheiro)}</Pill>}
            </div>
            <div style={{fontSize:11,color:C.muted}}>{op.consequencia}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TelaLei({lei,char,cargo,onVotar,comprarParlamentar,parlamentaresComprados}){
  const [votos,setVotos]=useState(0);
  const handleVotar=(votar)=>{
    onVotar(lei,votar,votos);
  };
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,padding:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <style>{FONT}</style>
      <div style={{maxWidth:560,width:"100%"}}>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,marginBottom:8}}>{lei.titulo}</h2>
        <p style={{color:C.muted,marginBottom:20}}>{lei.desc}</p>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:20}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:8,fontFamily:"'Space Mono',monospace"}}>EFEITOS</div>
          {lei.efeitos.popularidade&&<Pill c={lei.efeitos.popularidade>0?C.green:C.red}>{lei.efeitos.popularidade>0?"+":""}{lei.efeitos.popularidade}% pop.</Pill>}
          {lei.efeitos.integridade&&<Pill c={lei.efeitos.integridade>0?C.green:C.red}>{lei.efeitos.integridade>0?"+":""}{lei.efeitos.integridade}% integ.</Pill>}
          {lei.efeitos.dinheiro&&<Pill c={lei.efeitos.dinheiro>0?C.green:C.red}>{lei.efeitos.dinheiro>0?"+":""}{fmt(lei.efeitos.dinheiro)}</Pill>}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:20}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:8,fontFamily:"'Space Mono',monospace"}}>COMPRAR APOIO (+{votos*4}% chance)</div>
          {PARLAMENTARES.filter(p=>!parlamentaresComprados.includes(p.id)).slice(0,3).map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:11}}>{p.nome} ({p.votos} votos)</span>
              <button onClick={()=>{comprarParlamentar(p);setVotos(v=>v+p.votos);}}
                style={{padding:"4px 10px",background:C.dim,border:`1px solid ${C.gold}`,borderRadius:6,color:C.gold,cursor:"pointer"}}>
                {fmt(p.preco)}
              </button>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>handleVotar(true)} style={{flex:1,padding:14,background:`${C.green}22`,border:`1px solid ${C.green}`,borderRadius:10,color:C.green,fontFamily:"'Bebas Neue',sans-serif",fontSize:16}}>
            {cargo?.nome==="presidente"?"SANCIONAR":"PROPOR"}
          </button>
          <button onClick={()=>handleVotar(false)} style={{flex:1,padding:14,background:`${C.red}22`,border:`1px solid ${C.red}`,borderRadius:10,color:C.red,fontFamily:"'Bebas Neue',sans-serif",fontSize:16}}>
            {cargo?.nome==="presidente"?"VETAR":"ARQUIVAR"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TelaAposentadoria({char,partido,onReinicio}){
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{FONT}</style>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:20}}>🧓</div>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:3}}>Fim da carreira</h2>
        <p style={{color:C.muted,marginBottom:24}}>{char.nome}, ex-{getCargo(char.historicoCargos.slice(-1)[0]?.cargo)?.nome||"político"}, encerrou sua jornada em {char.ano}.</p>
        <button onClick={onReinicio}
          style={{width:"100%",padding:16,background:`linear-gradient(135deg,#1A3A80,${C.blue})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:3,cursor:"pointer"}}>
          JOGAR NOVAMENTE
        </button>
      </div>
    </div>
  );
   }
