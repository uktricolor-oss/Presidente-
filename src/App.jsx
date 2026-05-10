import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   POLÍTICO — RPG DE VIDA POLÍTICA BRASILEIRA
   50 crises por mandato · Orçamento alocável · Notícias vivas
═══════════════════════════════════════════════════════════ */

const F = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;600;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:4px;background:#010305}::-webkit-scrollbar-thumb{background:#0D1A28;border-radius:2px}input,select{outline:none;}button{cursor:pointer;}`;

const K = {
  bg:"#010305",s1:"#040C16",s2:"#071220",bd:"#0D1A28",
  tx:"#E8F0F8",mu:"#2A4060",dm:"#050E1A",
  go:"#C9941C",gr:"#0D9463",rd:"#D63247",bl:"#1A6FD4",
  pu:"#7B3FBE",te:"#0D7A8A",or:"#C96A15",
};

// ── ÁREAS DE ORÇAMENTO ──────────────────────────────────────
const AREAS = [
  {id:"saude",      n:"Saúde",          i:"🏥", base:15, cor:K.rd},
  {id:"educacao",   n:"Educação",        i:"📚", base:15, cor:K.bl},
  {id:"seguranca",  n:"Segurança",       i:"🚔", base:12, cor:"#374151"},
  {id:"transporte", n:"Transporte",      i:"🚌", base:10, cor:K.te},
  {id:"habitacao",  n:"Habitação",       i:"🏠", base:8,  cor:K.or},
  {id:"meio_amb",   n:"Meio Ambiente",   i:"🌿", base:5,  cor:K.gr},
  {id:"cultura",    n:"Cultura",         i:"🎭", base:5,  cor:K.pu},
  {id:"assistencia",n:"Assist. Social",  i:"🤝", base:10, cor:"#C96A15"},
  {id:"infra",      n:"Infraestrutura",  i:"🏗️", base:10, cor:"#5A7A60"},
  {id:"admin",      n:"Administração",   i:"📋", base:10, cor:K.mu},
];

// ── PARTIDOS ─────────────────────────────────────────────────
const PARTIDOS = [
  {id:"pt",   n:"PT",    f:"Partido dos Trabalhadores",   e:"esquerda",       c:"#CC0000",i:"⭐",
   af:{saude:3,educacao:3,assistencia:3,seguranca:-1,meio_amb:2,transporte:2}},
  {id:"psol", n:"PSOL",  f:"Socialismo e Liberdade",      e:"esquerda",       c:"#D95800",i:"🌅",
   af:{meio_amb:3,saude:2,educacao:3,cultura:2,seguranca:-2,infra:-1}},
  {id:"mdb",  n:"MDB",   f:"Mov. Democrático Brasileiro", e:"centro",         c:"#3A7ACC",i:"🔷",
   af:{infra:2,transporte:2,admin:2,saude:1,educacao:1}},
  {id:"psd",  n:"PSD",   f:"Partido Social Democrático",  e:"centro",         c:"#1F6B2A",i:"🌱",
   af:{infra:2,habitacao:2,transporte:2,saude:1,seguranca:1}},
  {id:"uniao",n:"UNIÃO", f:"União Brasil",                e:"centro-direita", c:"#1045A0",i:"🇧🇷",
   af:{seguranca:2,infra:2,transporte:1,saude:1,cultura:-1,assistencia:-1}},
  {id:"pp",   n:"PP",    f:"Progressistas",               e:"centro-direita", c:"#0A3A8A",i:"🏛️",
   af:{infra:3,transporte:2,habitacao:2,seguranca:1,meio_amb:-1}},
  {id:"pl",   n:"PL",    f:"Partido Liberal",             e:"direita",        c:"#08186A",i:"🦁",
   af:{seguranca:3,admin:-2,assistencia:-2,meio_amb:-2,saude:-1,educacao:-1}},
  {id:"novo", n:"NOVO",  f:"Partido Novo",                e:"direita",        c:"#C04800",i:"🆕",
   af:{admin:-3,assistencia:-3,saude:-2,educacao:-2,seguranca:1,infra:1}},
  {id:"rep",  n:"REP",   f:"Republicanos",                e:"direita",        c:"#2A3540",i:"✝️",
   af:{seguranca:2,cultura:-1,assistencia:-1,meio_amb:-1,saude:1}},
];

// ── CARGOS ────────────────────────────────────────────────────
const CARGOS = {
  vereador:    {n:"Vereador",        i:"🏙️",nv:1,dur:4,sal:8000,  minId:18,eBase:40,esfera:"municipal"},
  prefeito:    {n:"Prefeito",        i:"🏛️",nv:2,dur:4,sal:18000, minId:21,eBase:52,esfera:"municipal"},
  deputado:    {n:"Dep. Estadual",   i:"🏟️",nv:2,dur:4,sal:25000, minId:18,eBase:50,esfera:"estadual"},
  deputadoFed: {n:"Dep. Federal",    i:"🎯",nv:3,dur:4,sal:35000, minId:21,eBase:56,esfera:"federal"},
  senador:     {n:"Senador",         i:"⭐",nv:4,dur:8,sal:35000, minId:35,eBase:64,esfera:"federal"},
  governador:  {n:"Governador",      i:"🗺️",nv:4,dur:4,sal:30000, minId:30,eBase:60,esfera:"estadual"},
  presidente:  {n:"Presidente",      i:"🎖️",nv:5,dur:4,sal:30934, minId:35,eBase:68,esfera:"federal"},
};

// ── PERSONALIDADES ────────────────────────────────────────────
const PERS = [
  {id:"ideologo",  n:"Ideólogo",    i:"📖",c:K.bl,  bon:{pop:5,int:20,din:0},     pass:"Trair a ideologia custa 20 de integridade."},
  {id:"pragmatico",n:"Pragmático",  i:"🤝",c:K.te,  bon:{pop:5,int:0,din:50000},  pass:"Bônus em acordos. Mídia te chama de fisiológico."},
  {id:"populista", n:"Populista",   i:"📢",c:K.or,  bon:{pop:25,int:-5,din:0},    pass:"Promessas quebradas custam o dobro."},
  {id:"corrupto",  n:"Oportunista", i:"💸",c:K.go,  bon:{pop:0,int:-25,din:120000},pass:"Chance de escândalo a cada mandato."},
  {id:"tecnico",   n:"Técnico",     i:"📊",c:K.pu,  bon:{pop:-5,int:15,din:0},    pass:"Leis +20%. Povo não te entende."},
];

// ── BANCADAS ──────────────────────────────────────────────────
const BANCADAS = [
  {id:"evangelica",  n:"Evangélica",    i:"✝️",c:"#7B3FBE"},
  {id:"ruralista",   n:"Ruralista",     i:"🌾",c:"#8B5A00"},
  {id:"trabalhista", n:"Trabalhista",   i:"⚒️",c:"#C00000"},
  {id:"empresarial", n:"Empresarial",   i:"💼",c:"#006633"},
  {id:"seguranca",   n:"Seg. Pública",  i:"🚔",c:"#2A3540"},
  {id:"ambiental",   n:"Ambiental",     i:"🌿",c:"#0D8050"},
  {id:"lgbtq",       n:"Diversidade",   i:"🏳️‍🌈",c:"#C0148A"},
  {id:"progressista",n:"Progressista",  i:"✊",c:"#C07800"},
];

// ── POOL GIGANTE DE CRISES (compartilhado, filtrado por cargo) ────
// Cada crise tem: id, t(título), i(ícone), s(situação), cargo(array de cargos), ops(opções)
const ALL_CRISES = [
  // ─── UNIVERSAIS (todos os cargos) ───────────────────────────────
  {id:"u01",cargo:["*"],t:"Familiar Pede Cargo Público",i:"👨‍👩‍👧",
   s:"Seu cunhado te liga pedindo indicação para cargo público. Sua parceira/o também pede. É nepotismo, é ilegal. Mas ninguém vai saber... ou vai?",
   ops:[
     {t:"Recusar firmemente e explicar os riscos",b:{progressista:+12,trabalhista:+8,evangelica:+5},e:{pop:+5,int:+22,vis:+5,din:0},m:"Você recusou o nepotismo. Família ficou brava. Valeu.",c:"Família aborrecida. Nenhum escândalo. Você dorme bem."},
     {t:"Indicar discretamente em cargo menor",b:{progressista:-15,trabalhista:-12},e:{pop:-10,int:-25,vis:-5,din:0},m:"Você indicou o cunhado. O jornal descobriu 3 meses depois.",c:"TCM instaura processo. Cunhado exonerado. Você paga o preço."},
     {t:"Ajudar a se qualificar para o processo seletivo",b:{progressista:+5,trabalhista:+5,evangelica:+8},e:{pop:+5,int:+12,vis:0,din:-2000},m:"Você pagou curso. Passou no processo. Limpo.",c:"Cunhado contratado legitimamente. Todos felizes."},
     {t:"Fingir que vai tentar e não fazer nada",b:{progressista:-3,evangelica:-3},e:{pop:-3,int:-8,vis:0,din:0},m:"Você enrolou a família. Eles sabem.",c:"Cunhado decepcionado. Clima ruim. Sem consequência pública."},
   ]},
  {id:"u02",cargo:["*"],t:"Propina Oferecida em Reunião",i:"💰",
   s:"Emissário de construtora te encontra e coloca envelope com R$80k na mesa. 'Só para você votar/assinar a favor do projeto'. Sem testemunhas.",
   ops:[
     {t:"Recusar, gravar e denunciar ao MP",b:{progressista:+20,ambiental:+15,trabalhista:+12},e:{pop:+18,int:+25,vis:+22,din:0},m:"Você gravou a proposta e entregou ao MP. Raro e corajoso.",c:"Construtora indiciada. Você vira símbolo anticorrupção. Ameaças anônimas."},
     {t:"Recusar sem denunciar",b:{progressista:+5,ambiental:+8},e:{pop:+3,int:+8,vis:0,din:0},m:"Você recusou mas não denunciou. Oportunidade perdida.",c:"Construtora tenta com outro cargo."},
     {t:"Aceitar e votar/assinar a favor",b:{empresarial:+12,ruralista:+8,progressista:-20,ambiental:-18},e:{pop:-15,int:-30,vis:-5,din:+80000},m:"Você aceitou. Dinheiro no bolso. Investigação possível.",c:"30% de chance: PF estava monitorando. Operação deflagrada."},
     {t:"Pegar o dinheiro e votar/assinar contra",b:{ambiental:+5,progressista:+5},e:{pop:+5,int:-20,vis:+5,din:+80000},m:"Você pegou e traiu. Golpe duplo.",c:"Construtora descobre e vaza sua corrupção para a imprensa."},
   ]},
  {id:"u03",cargo:["*"],t:"Foto em Festa de Investigado",i:"📸",
   s:"Foto sua em festa de empresário investigado por fraude circula nas redes. Você estava lá antes da investigação, mas a imagem é péssima.",
   ops:[
     {t:"Entrevista imediata explicando o contexto",b:{progressista:+5,trabalhista:+5},e:{pop:-5,int:+12,vis:+10,din:0},m:"Você foi à imprensa explicar. Perdeu um pouco, ganhou respeito.",c:"Crise controlada em 2 dias."},
     {t:"Nota dizendo que foi convidado inocentemente",b:{},e:{pop:-3,int:0,vis:+8,din:0},m:"Nota básica. Ninguém muito convencido, mas passou.",c:"Crise some em 2 dias."},
     {t:"Contra-atacar dizendo que é perseguição",b:{progressista:-12,trabalhista:-10},e:{pop:-12,int:-15,vis:+15,din:0},m:"Você atacou a imprensa. Mais fotos apareceram.",c:"Jornalista aprofunda. Situação piora."},
     {t:"Contratar assessor e ficar 48h em silêncio",b:{progressista:-5,trabalhista:-5},e:{pop:-8,int:-5,vis:+5,din:-5000},m:"Silêncio pareceu culpa.",c:"Assessor controla. Passa, mas deixa rastro."},
   ]},
  {id:"u04",cargo:["*"],t:"Escândalo de Saúde: Falta de Médico",i:"🏥",
   s:"Serviço de saúde da sua área fechado por falta de médico. Paciente grave relata situação ao vivo na TV. O repórter te liga.",
   ops:[
     {t:"Ir ao local imediatamente e resolver pessoalmente",b:{trabalhista:+20,progressista:+18,evangelica:+12},e:{pop:+22,int:+15,vis:+22,din:-5000},m:"Você apareceu quando ninguém mais apareceu.",c:"Cobertura positiva. Secretário envergonhado resolve."},
     {t:"Acionar o secretário e cobrar solução em 24h",b:{trabalhista:+10,progressista:+8},e:{pop:+8,int:+8,vis:+12,din:0},m:"Você cobrou e acompanhou. Responsável.",c:"Secretário age. Médico contratado em 48h."},
     {t:"Declarar que é responsabilidade de outro nível de governo",b:{trabalhista:-15,progressista:-12},e:{pop:-18,int:-12,vis:+5,din:0},m:"Você lavou as mãos com paciente sofrendo ao vivo.",c:"Matéria de destaque: 'Onde estava o seu representante?'"},
     {t:"Gravar vídeo criticando o sistema sem ir ao local",b:{trabalhista:+2,progressista:+2},e:{pop:+2,int:-5,vis:+10,din:0},m:"Vídeo fácil sem resolver nada.",c:"Povo percebe que você não foi pessoalmente."},
   ]},
  {id:"u05",cargo:["*"],t:"Manifestação Bloqueia Acesso",i:"📣",
   s:"Manifestantes bloqueiam a entrada do seu local de trabalho. Pedem reunião imediata. Reivindicações: reajuste salarial e melhores condições. Câmeras ao vivo.",
   ops:[
     {t:"Sair e dialogar pessoalmente com os manifestantes",b:{trabalhista:+22,progressista:+18,evangelica:+8},e:{pop:+18,int:+12,vis:+20,din:0},m:"Você saiu e ouviu. Raro em político.",c:"Negociação começa. Povo aprova postura."},
     {t:"Enviar representante para ouvir as demandas",b:{trabalhista:+5,progressista:+5},e:{pop:+3,int:+3,vis:+8,din:0},m:"Representante ouviu. Parcialmente aceito.",c:"Manifestantes insatisfeitos mas aceitam o processo."},
     {t:"Entrar pela porta lateral sem enfrentar os manifestantes",b:{trabalhista:-18,progressista:-15},e:{pop:-20,int:-12,vis:+5,din:0},m:"Você fugiu pela lateral. Alguém filmou.",c:"Vídeo viral: 'Político foge dos trabalhadores'."},
     {t:"Acionar segurança para dispersar",b:{trabalhista:-22,progressista:-20,seguranca:+10},e:{pop:-18,int:-15,vis:+10,din:0},m:"Você mandou dispersar manifestação pacífica.",c:"Imagens de dispersão viralizam. Crise de imagem grave."},
   ]},
  {id:"u06",cargo:["*"],t:"Acusação de Assédio no seu Gabinete",i:"⚠️",
   s:"Três funcionárias do seu gabinete denunciam assédio moral praticado pelo seu chefe de gabinete. Provas documentadas. Movimento feminista te pressiona.",
   ops:[
     {t:"Demitir imediatamente e acionar o MP",b:{lgbtq:+22,progressista:+20,trabalhista:+15,evangelica:+10},e:{pop:+18,int:+25,vis:+22,din:0},m:"Você agiu sem hesitar. Chefe demitido e indiciado.",c:"Movimento feminista te elogia. Você vira referência."},
     {t:"Afastar temporariamente aguardando investigação interna",b:{lgbtq:-10,progressista:-8,trabalhista:-5},e:{pop:-8,int:-12,vis:+8,din:0},m:"Afastamento pareceu proteção. Denunciantes indignadas.",c:"Investigação interna o inocenta. Protestos dobram."},
     {t:"Defender o chefe dizendo que acusações são políticas",b:{lgbtq:-22,progressista:-20,trabalhista:-15},e:{pop:-22,int:-25,vis:+10,din:0},m:"Você defendeu assediador com provas contra ele.",c:"Movimento declara boicote à sua próxima candidatura."},
     {t:"Demitir silenciosamente sem abrir processo",b:{lgbtq:-5,progressista:-5,trabalhista:-3},e:{pop:-5,int:-8,vis:+5,din:0},m:"Você varreu para debaixo do tapete.",c:"Denunciantes percebem que não haverá punição real."},
   ]},
  {id:"u07",cargo:["*"],t:"Seu Partido Pede Voto Contrário à Sua Posição",i:"🔄",
   s:"O líder da bancada te liga: você precisa votar contra sua posição pública declarada em projeto importante. 'É a linha do partido.' Sua base está assistindo.",
   ops:[
     {t:"Recusar e manter sua posição pública",b:{progressista:+15,trabalhista:+12,evangelica:+8},e:{pop:+12,int:+18,vis:+15,din:0},m:"Você desafiou o partido por convicção. Custou.",c:"Partido te pune tirando verba de gabinete. Sua base te adora."},
     {t:"Aceitar seguir o partido",b:{empresarial:+8,ruralista:+8,progressista:-12,trabalhista:-10},e:{pop:-10,int:-15,vis:+5,din:+15000},m:"Você seguiu o partido contra sua posição. Fisiológico.",c:"Partido satisfeito. Base decepcionada. Você perde credibilidade."},
     {t:"Negociar: votar junto em troca de outra concessão",b:{progressista:+3,trabalhista:+3},e:{pop:-3,int:-5,vis:+5,din:+10000},m:"Você negociou sua posição. Pragmático.",c:"Acordo fechado. Você ganha algo, perde um pouco."},
     {t:"Se ausentar da votação com justificativa técnica",b:{progressista:-5,trabalhista:-5},e:{pop:-8,int:-10,vis:-5,din:0},m:"Você sumiu da votação. Covardia conhecida.",c:"Partido e base ficam insatisfeitos."},
   ]},
  {id:"u08",cargo:["*"],t:"Jornalista Investigativo te Persegue",i:"🎙️",
   s:"Repórter de veículo nacional está investigando suas finanças. Pediu entrevista. Você sabe que tem algumas coisas que podem parecer suspeitas, mesmo que legais.",
   ops:[
     {t:"Dar entrevista completa com total transparência",b:{progressista:+12,trabalhista:+8},e:{pop:+8,int:+15,vis:+18,din:0},m:"Você abriu tudo. Transparência total. Respeitado.",c:"Matéria saiu mas te favoreceu. Contas eram legais."},
     {t:"Dar entrevista mas evitar certas perguntas",b:{progressista:+2,trabalhista:+2},e:{pop:-3,int:-5,vis:+10,din:0},m:"Entrevista truncada. Jornalista notou as evasões.",c:"Matéria foca nas partes que você evitou. Pior resultado."},
     {t:"Recusar entrevista e enviar nota formal",b:{},e:{pop:-8,int:-5,vis:+8,din:-5000},m:"Recusa pareceu culpa para o público.",c:"Jornalista aprofunda a investigação sem sua versão."},
     {t:"Tentar pressionar o veículo para não publicar",b:{progressista:-15,trabalhista:-12},e:{pop:-15,int:-20,vis:+10,din:-20000},m:"Você tentou calar a imprensa. Erro grave.",c:"Jornalista publica sobre a tentativa de censura também."},
   ]},
  {id:"u09",cargo:["*"],t:"Eleitor te Aborda com Problema Real",i:"🙋",
   s:"Um eleitor te para na rua. Filho com doença rara, plano de saúde negou tratamento, não tem dinheiro. Te pede ajuda diretamente. Câmeras do celular ao redor.",
   ops:[
     {t:"Dar seu cartão, ligar agora para resolver e acompanhar",b:{trabalhista:+18,progressista:+15,evangelica:+12},e:{pop:+20,int:+12,vis:+18,din:-2000},m:"Você resolveu na hora. Família chorou de alívio.",c:"Vídeo viral positivo. Você vira símbolo de político presente."},
     {t:"Dar o contato do seu gabinete e prometer ajuda",b:{trabalhista:+8,progressista:+5},e:{pop:+8,int:+5,vis:+10,din:0},m:"Você prometeu. Gabinete resolveu em 3 dias.",c:"Família agradecida. Resolve, mas sem o impacto do imediato."},
     {t:"Posar para foto e encaminhar para assistência social",b:{trabalhista:+2,progressista:+0},e:{pop:+2,int:-5,vis:+12,din:0},m:"Você usou o momento para foto e jogou para a burocracia.",c:"Família espera na fila. Caso não resolvido em 2 meses."},
     {t:"Dizer que não pode ajudar casos individuais",b:{trabalhista:-12,progressista:-10},e:{pop:-15,int:-8,vis:+5,din:0},m:"Você virou as costas para quem precisava.",c:"Vídeo viral negativo. 'Político ignora mãe desesperada'."},
   ]},
  {id:"u10",cargo:["*"],t:"Crise nas Redes: Cancelamento",i:"📱",
   s:"Uma postagem sua de 5 anos atrás foi desenterrada. Fora do contexto atual, parece ofensiva. Está nos trending topics. 50k tweets pedindo desculpas.",
   ops:[
     {t:"Pedir desculpas genuínas explicando o contexto e a evolução",b:{lgbtq:+12,progressista:+10,trabalhista:+8},e:{pop:-3,int:+10,vis:+20,din:0},m:"Você se desculpou com genuinidade. Maioria aceitou.",c:"Polêmica resolve em 3 dias. Você sai mais íntegro."},
     {t:"Deletar a postagem sem comentar nada",b:{lgbtq:-5,progressista:-5},e:{pop:-8,int:-8,vis:+8,din:0},m:"Você sumiu a postagem sem explicação. Pareceu culpa.",c:"Print já tinha sido tirado. Pior do que explicar."},
     {t:"Defender a postagem dizendo que está fora de contexto",b:{progressista:-15,lgbtq:-15,trabalhista:-8},e:{pop:-15,int:-15,vis:+15,din:0},m:"Você defendeu algo indefensável. Piorou tudo.",c:"Cancelamento se intensifica. Mais manchetes ruins."},
     {t:"Humor: transformar em momento de autocrítica pública",b:{lgbtq:+8,progressista:+8,trabalhista:+5},e:{pop:+5,int:+8,vis:+22,din:0},m:"Você se riu de si mesmo publicamente. Desarmou a situação.",c:"Viral positivo. 'Político que sabe errar e crescer'."},
   ]},

  // ─── CRISES DE VEREADOR ─────────────────────────────────────
  {id:"v01",cargo:["vereador"],t:"Buraco na Rua Mata Motociclista",i:"🕳️",
   s:"Motociclista morreu em buraco que você prometeu consertar há 6 meses. Família na porta da Câmara. Câmeras ao vivo.",
   ops:[
     {t:"Ir pessoalmente, pedir perdão e consertar com verba de gabinete",b:{trabalhista:+20,progressista:+15},e:{pop:+25,int:+15,vis:+20,din:-15000},m:"Você foi até a família enlutada. Bairro inteiro viu.",c:"Obra feita. Família aceita o gesto. Você vira referência."},
     {t:"Gravar vídeo de desculpas e prometer obra urgente",b:{trabalhista:+8,progressista:+5},e:{pop:+10,int:0,vis:+15,din:0},m:"Vídeo de desculpas viralizou — povo dividido.",c:"Obra atrasa mais 3 meses. Críticas continuam."},
     {t:"Culpar a Prefeitura e exigir investigação",b:{trabalhista:+3,progressista:-5},e:{pop:-5,int:-8,vis:+10,din:0},m:"Você jogou a culpa. Família ficou indignada.",c:"Família processa a Câmara. Você é citado na ação."},
     {t:"Ignorar — é problema da Prefeitura",b:{trabalhista:-20,progressista:-18},e:{pop:-28,int:-15,vis:+5,din:0},m:"Você sumiu quando o bairro precisava.",c:"Moradores fazem protesto. Seu outdoor é depredado."},
   ]},
  {id:"v02",cargo:["vereador"],t:"Escola Sem Merenda por 2 Semanas",i:"🍽️",
   s:"800 crianças sem almoço há 14 dias. Fornecedor faliu. Prefeito não atende. Mães em frente à Câmara com cartazes. Você é o único que apareceu.",
   ops:[
     {t:"Organizar arrecadação e ir às escolas pessoalmente",b:{trabalhista:+22,progressista:+18,evangelica:+15},e:{pop:+28,int:+15,vis:+25,din:-5000},m:"Você apareceu quando ninguém mais apareceu.",c:"TV cobre. Prefeito envergonhado contrata fornecedor."},
     {t:"Usar verba de gabinete para pagar fornecedor emergencial",b:{trabalhista:+20,progressista:+15,evangelica:+12},e:{pop:+22,int:+18,vis:+15,din:-20000},m:"Você pagou do próprio gabinete. Crianças comeram no dia seguinte.",c:"Imprensa elogia. Prefeito te liga irritado."},
     {t:"Propor CPI da merenda na Câmara",b:{progressista:+12,trabalhista:+8},e:{pop:+8,int:+10,vis:+12,din:0},m:"CPI aprovada. Investigação enquanto crianças passam fome.",c:"CPI revela desvio. Mas 2 semanas a mais sem merenda."},
     {t:"Declarar que não é seu problema",b:{trabalhista:-20,progressista:-18,evangelica:-12},e:{pop:-25,int:-18,vis:+5,din:0},m:"Você lavou as mãos. As mães não esquecem.",c:"Mães fazem abaixo-assinado pedindo sua cassação."},
   ]},
  {id:"v03",cargo:["vereador"],t:"Proposta de Cassino no Centro",i:"🎰",
   s:"Empresário quer transformar teatro histórico em cassino. Promete 500 empregos. Artistas contra. Empresários a favor. Você vota amanhã.",
   ops:[
     {t:"Votar contra — preservar patrimônio cultural",b:{progressista:+15,ambiental:+8,lgbtq:+8,empresarial:-10},e:{pop:+8,int:+10,vis:+12,din:0},m:"Você defendeu o teatro. Artistas te adotaram.",c:"Teatro restaurado com verba pública depois."},
     {t:"Votar a favor — 500 empregos valem mais",b:{empresarial:+18,ruralista:+10,trabalhista:+5,progressista:-12},e:{pop:+5,int:-5,vis:+8,din:+30000},m:"Você aprovou o cassino. Empresário 'agradeceu'.",c:"Teatro demolido. 500 empregos criados. Polêmica."},
     {t:"Propor transformar em centro cultural com eventos pagos",b:{progressista:+12,ambiental:+8,empresarial:+5,trabalhista:+8},e:{pop:+12,int:+12,vis:+10,din:0},m:"Sua proposta virou lei municipal.",c:"Centro cultural abre. 200 empregos. Todos satisfeitos."},
     {t:"Pedir estudo de impacto e adiar",b:{progressista:-3,empresarial:-5,trabalhista:-3},e:{pop:-3,int:-5,vis:0,din:0},m:"Você adiou mais uma vez. Indecisão crônica.",c:"Votação adiada 6 meses. Ambos insatisfeitos."},
   ]},
  {id:"v04",cargo:["vereador"],t:"Aliado Filmado em Agressão",i:"🚨",
   s:"Seu aliado mais próximo, vereador Rogério, foi filmado agredindo manifestante. 2M de views. Você precisa se posicionar.",
   ops:[
     {t:"Romper imediatamente e pedir cassação",b:{progressista:+20,lgbtq:+15,trabalhista:+12},e:{pop:+18,int:+22,vis:+20,din:0},m:"Você cortou o aliado quando ele errou. Perda política, ganho moral.",c:"Aliado cassado. Você perde 4 votos mas ganha respeitabilidade."},
     {t:"Defender dizendo que manifestante provocou",b:{seguranca:+10,evangelica:+5,progressista:-20,lgbtq:-18},e:{pop:-20,int:-22,vis:+15,din:0},m:"Você defendeu agressão. Isso fica registrado pra sempre.",c:"Movimento de DH declara guerra à sua candidatura."},
     {t:"Pedir afastamento e aguardar investigação",b:{progressista:+5,trabalhista:+5},e:{pop:+3,int:+5,vis:+10,din:0},m:"Posição cautelosa. Responsável.",c:"Aliado se afasta. Investigação em curso."},
     {t:"Ficar em silêncio",b:{progressista:-8,lgbtq:-8,trabalhista:-8},e:{pop:-12,int:-12,vis:0,din:0},m:"Silêncio sobre agressão filmada. Conivência percebida.",c:"Imprensa te pergunta. Silêncio vira matéria."},
   ]},
  {id:"v05",cargo:["vereador"],t:"Licitação Suspeita da Prefeitura",i:"🔍",
   s:"Documentos chegam até você mostrando que a licitação da merenda foi fraudada. A empresa vencedora é do cunhado do prefeito. Você tem as provas.",
   ops:[
     {t:"Denunciar ao MP com todas as provas",b:{progressista:+22,trabalhista:+18,ambiental:+8},e:{pop:+20,int:+28,vis:+25,din:0},m:"Você entregou ao MP. Coragem. O prefeito declarou guerra.",c:"Inquérito aberto. Prefeito bloqueia você em tudo. Herói local."},
     {t:"Usar as provas para negociar mais verbas",b:{progressista:-18,trabalhista:-15},e:{pop:-12,int:-28,vis:+5,din:+80000},m:"Você chantageou o prefeito com as provas.",c:"Prefeito cede. Mas investigadores te observam também."},
     {t:"Abrir CPI na Câmara",b:{progressista:+15,trabalhista:+12},e:{pop:+15,int:+20,vis:+18,din:0},m:"Sua CPI da merenda abriu investigação histórica.",c:"CPI aprovada. Fraude confirmada. Prefeito sob pressão."},
     {t:"Vazar anonimamente para a imprensa",b:{progressista:+8,trabalhista:+8},e:{pop:+8,int:+5,vis:+10,din:0},m:"Você vazou sem se expor. Anônimo.",c:"Imprensa publica. Verdade vem à tona. Você fora do risco."},
   ]},
  {id:"v06",cargo:["vereador"],t:"Protesto Bloqueia a Câmara",i:"✊",
   s:"200 servidores municipais bloqueiam a entrada. Pedem reajuste de 20%. Prefeito quer que você vote contra. Câmeras te filmam chegando.",
   ops:[
     {t:"Dialogar e prometer votar pelo reajuste",b:{trabalhista:+25,progressista:+18},e:{pop:+20,int:+10,vis:+18,din:0},m:"Você prometeu votar pelo reajuste. Partido furioso.",c:"Servidores te apoiam. Prefeito te exclui das indicações."},
     {t:"Apoiar o prefeito e votar contra",b:{trabalhista:-22,progressista:-18,empresarial:+12},e:{pop:-18,int:-10,vis:+5,din:+15000},m:"Você votou contra os servidores para agradar o prefeito.",c:"Prefeito te recompensa com verbas. Servidores te perseguem."},
     {t:"Propor reajuste de 10% como meio-termo",b:{trabalhista:+8,progressista:+5,empresarial:+5},e:{pop:+8,int:+5,vis:+12,din:0},m:"Você mediou o reajuste. Ninguém totalmente feliz.",c:"Negociação aprovada. Você visto como 'ponderado'."},
     {t:"Entrar pela porta dos fundos",b:{trabalhista:-18,progressista:-15},e:{pop:-20,int:-15,vis:+8,din:0},m:"Você fugiu pelos fundos. Alguém filmou.",c:"Viral: 'o vereador dos fundos'."},
   ]},
  {id:"v07",cargo:["vereador"],t:"Bar do Tráfico na Sua Rua",i:"🚨",
   s:"Moradores denunciam que um bar aberto às 3h é ponto do tráfico. O dono tem ligação com seu aliado. PM pede pressão política para agir.",
   ops:[
     {t:"Denunciar publicamente e acionar o MP",b:{seguranca:+22,evangelica:+15,progressista:+12},e:{pop:+18,int:+22,vis:+20,din:0},m:"Você denunciou o bar mesmo com aliado envolvido.",c:"Bar fechado. Aliado te odeia. Tráfico ameaça. Herói local."},
     {t:"Avisar o aliado discretamente",b:{seguranca:-8,progressista:-12},e:{pop:-8,int:-18,vis:-5,din:+10000},m:"Você cobriu o aliado. Testemunha viu.",c:"Bar continua. Denúncia anônima chega à imprensa."},
     {t:"Organizar abaixo-assinado e pressionar a PM",b:{seguranca:+12,evangelica:+10,progressista:+8},e:{pop:+12,int:+10,vis:+15,din:0},m:"Seu abaixo-assinado fechou o bar. Processo demorado.",c:"PM age em 45 dias. Aliado reclama mas não age."},
     {t:"Ignorar — segurança é problema da PM",b:{seguranca:-15,evangelica:-12,progressista:-15},e:{pop:-20,int:-15,vis:+3,din:0},m:"Você ignorou o bar do tráfico.",c:"Morador escreve carta aberta na rádio. Omissão vira notícia."},
   ]},
  {id:"v08",cargo:["vereador"],t:"Seu Salário Vaza na Imprensa",i:"📰",
   s:"Jornal local publica: 'Vereador ganha R$8.000 e trabalha 3 dias por semana'. Foto sua em restaurante caro no mesmo dia.",
   ops:[
     {t:"Dar entrevista mostrando todo o trabalho com dados",b:{trabalhista:+8,progressista:+5},e:{pop:+8,int:+10,vis:+15,din:0},m:"Você mostrou seu trabalho. Alguns convencidos.",c:"Polêmica passa em 1 semana."},
     {t:"Propor redução voluntária do seu salário em 30%",b:{trabalhista:+18,progressista:+15,evangelica:+10},e:{pop:+22,int:+15,vis:+20,din:-2400},m:"Você cortou seu próprio salário. Gesto raro.",c:"Outros vereadores constrangidos. Você vira exemplo."},
     {t:"Atacar o jornal dizendo que é perseguição",b:{progressista:-10,trabalhista:-8},e:{pop:-10,int:-12,vis:+10,din:0},m:"Você atacou o jornal. Pareceu culpado.",c:"Jornal aprofunda. Mais matérias sobre você."},
     {t:"Não responder",b:{progressista:-5,trabalhista:-5},e:{pop:-8,int:-5,vis:+3,din:0},m:"Ignorou. Povo entendeu como confirmação.",c:"Assunto vivo por mais 2 semanas."},
   ]},
  {id:"v09",cargo:["vereador"],t:"Pautar: Câmeras no Banheiro da Escola",i:"🏫",
   s:"Aliado propõe câmeras nos banheiros das escolas para combater drogas. Conselho Tutelar é contra. Você vota amanhã.",
   ops:[
     {t:"Votar contra — violação de privacidade",b:{progressista:+15,lgbtq:+12,trabalhista:+8},e:{pop:+8,int:+15,vis:+10,din:0},m:"Você votou contra câmeras em banheiro. Conselho Tutelar elogiou.",c:"Projeto derrubado. Conselho te cita como exemplo."},
     {t:"Votar a favor — segurança primeiro",b:{seguranca:+15,evangelica:+12,progressista:-15},e:{pop:-8,int:-15,vis:+8,din:0},m:"Você aprovou câmeras em banheiro. Polêmico.",c:"MP questiona constitucionalidade."},
     {t:"Propor câmeras apenas nos corredores como emenda",b:{seguranca:+8,evangelica:+5,progressista:+5,lgbtq:+5},e:{pop:+10,int:+8,vis:+8,din:0},m:"Você propôs a solução do corredor. Bem visto.",c:"Emenda aprovada. Todos aceitam o meio-termo."},
     {t:"Pedir vistas e adiar 30 dias",b:{progressista:-3,trabalhista:-3,evangelica:-3},e:{pop:-5,int:-3,vis:-3,din:0},m:"Você adiou. Tática de quem não quer decidir.",c:"Debate por mais 1 mês."},
   ]},
  {id:"v10",cargo:["vereador"],t:"Obra Irregular do Seu Aliado",i:"🏗️",
   s:"Aliado vereador Zé Carlos construiu muro invadindo calçada pública. Moradores pedem ação. Se você denunciar, perde o aliado e os votos.",
   ops:[
     {t:"Denunciar formalmente mesmo perdendo o aliado",b:{progressista:+18,trabalhista:+12,evangelica:+12},e:{pop:+15,int:+25,vis:+15,din:0},m:"Você derrubou o muro do aliado. Perda política, ganho moral.",c:"Muro derrubado. Zé Carlos vira inimigo. Você sobe nas pesquisas."},
     {t:"Conversar em particular para regularizar",b:{progressista:+3,trabalhista:+3},e:{pop:0,int:-5,vis:0,din:0},m:"Você tentou por dentro. Zé Carlos prometeu. Não cumpriu.",c:"Aliado promete mas empurra. Muro continua."},
     {t:"Defender dizendo que moradores exageram",b:{progressista:-20,trabalhista:-15,evangelica:-10},e:{pop:-22,int:-22,vis:+5,din:+8000},m:"Você defendeu o muro ilegal.",c:"Moradores protestam com foto sua e do muro."},
     {t:"Se ausentar com 'agenda externa'",b:{progressista:-8,trabalhista:-8},e:{pop:-10,int:-12,vis:-5,din:0},m:"Você sumiu no dia da votação. Covardia silenciosa.",c:"Ninguém acredita na 'agenda'. Motivo vira piada."},
   ]},

  // ─── CRISES DE PREFEITO / GOVERNADOR (executivos) ────────────
  {id:"e01",cargo:["prefeito","governador"],t:"Hospital Sem Médico de Plantão",i:"🚑",
   s:"Hospital público fica 12h sem médico. Paciente morre esperando. Você estava em evento de inauguração. Imprensa te encontra na saída.",
   ops:[
     {t:"Ir ao hospital, demitir o gestor, assumir a crise",b:{trabalhista:+20,progressista:+18,evangelica:+12},e:{pop:+18,int:+18,vis:+25,din:0},m:"Você foi ao hospital e assumiu. Raro em executivo.",c:"Gestora demitida. Nova equipe contratada emergencialmente."},
     {t:"Convocar coletiva e anunciar plano de 100 dias",b:{trabalhista:+12,progressista:+10},e:{pop:+10,int:+8,vis:+18,din:0},m:"Plano anunciado. Povo quer ver resultados.",c:"60 dias depois: 60% do plano cumprido. Aprovação estável."},
     {t:"Responsabilizar o secretário publicamente",b:{trabalhista:+8,progressista:+5},e:{pop:+5,int:+5,vis:+12,din:0},m:"Você jogou no secretário. Parcialmente aceitável.",c:"Secretário pede demissão. Novo secretário nomeado."},
     {t:"Culpar o governo estadual/federal por cortes",b:{trabalhista:-5,progressista:-8},e:{pop:-12,int:-12,vis:+8,din:0},m:"Você culpou outro nível. Família do falecido não aceitou.",c:"Família processa. Inquérito aberto."},
   ]},
  {id:"e02",cargo:["prefeito","governador"],t:"Obra Superfaturada Descoberta",i:"🔍",
   s:"TCM/TCE descobre que obra da sua gestão custou o triplo do previsto. Empresa é ligada ao seu secretário. Imprensa tem o relatório.",
   ops:[
     {t:"Demitir o secretário e devolver os valores",b:{progressista:+18,trabalhista:+15,ambiental:+8},e:{pop:+15,int:+22,vis:+20,din:-200000},m:"Você devolveu e demitiu. Inédito.",c:"TCM arquiva. Você marcado como 'o gestor que devolveu'."},
     {t:"Defender que a obra foi necessária e os valores corretos",b:{empresarial:+8,progressista:-18},e:{pop:-18,int:-22,vis:+10,din:0},m:"Você defendeu o indefensável.",c:"TCM impugna. MP investiga."},
     {t:"Pedir auditoria independente comprando tempo",b:{progressista:-5,trabalhista:-5},e:{pop:-5,int:-5,vis:+8,din:0},m:"Auditoria para ganhar tempo. Percebido.",c:"Auditoria confirma superfaturamento 6 meses depois."},
     {t:"Negociar com o TCM para parcelar devolução",b:{progressista:-3,empresarial:+5},e:{pop:-3,int:-8,vis:+5,din:-50000},m:"Você negociou a devolução parcelada.",c:"TCM aceita. Caso encerrado sem indiciamento."},
   ]},
  {id:"e03",cargo:["prefeito","governador"],t:"Seca Devasta o Interior",i:"☀️",
   s:"Seca histórica devasta lavouras. 200 famílias sem renda. Governo federal demora. Você precisa agir agora.",
   ops:[
     {t:"Decretar emergência e distribuir renda emergencial",b:{trabalhista:+22,progressista:+18,ruralista:+12},e:{pop:+25,int:+15,vis:+20,din:-50000},m:"Você socorreu antes do governo federal.",c:"Famílias salvas. Referência de gestor presente."},
     {t:"Acionar o governo federal para socorro imediato",b:{trabalhista:+8,progressista:+8,ruralista:+5},e:{pop:+8,int:+8,vis:+10,din:0},m:"Você pressionou o federal. Demorou mas veio.",c:"Socorro chega em 3 semanas. Tardio mas real."},
     {t:"Criar programa de crédito rural emergencial",b:{ruralista:+18,trabalhista:+10,empresarial:+8},e:{pop:+12,int:+10,vis:+12,din:-20000},m:"Seu crédito rural salvou propriedades.",c:"Programa bem avaliado. Modelo replicado."},
     {t:"Esperar o governo federal agir sozinho",b:{trabalhista:-18,progressista:-15,ruralista:-10},e:{pop:-20,int:-12,vis:+5,din:0},m:"Você esperou enquanto famílias perdiam tudo.",c:"Protestos na porta do Palácio."},
   ]},
  {id:"e04",cargo:["prefeito","governador"],t:"Secretário Acusado de Assédio Sexual",i:"⚠️",
   s:"Três funcionárias denunciam assédio praticado pelo seu secretário de maior confiança. Provas documentadas. Movimento feminista na porta.",
   ops:[
     {t:"Demitir imediatamente e acionar o MP",b:{lgbtq:+22,progressista:+20,trabalhista:+15,evangelica:+10},e:{pop:+20,int:+25,vis:+22,din:0},m:"Você agiu sem hesitar. Secretário demitido e indiciado.",c:"Referência de postura. Movimento feminista te elogia."},
     {t:"Afastar temporariamente aguardando investigação interna",b:{lgbtq:-10,progressista:-8,trabalhista:-5},e:{pop:-8,int:-12,vis:+8,din:0},m:"Afastamento pareceu proteção. Denunciantes indignadas.",c:"Investigação interna o inocenta. Protestos dobram."},
     {t:"Defender dizendo que acusações são políticas",b:{lgbtq:-22,progressista:-20,trabalhista:-15},e:{pop:-22,int:-25,vis:+10,din:0},m:"Você defendeu assediador com provas contra ele.",c:"Movimento declara boicote à sua reeleição."},
     {t:"Pedir demissão 'voluntária' sem abrir processo",b:{lgbtq:-5,progressista:-5,trabalhista:-3},e:{pop:-5,int:-8,vis:+5,din:0},m:"Você varreu para debaixo do tapete.",c:"Denunciantes percebem que não haverá punição real."},
   ]},
  {id:"e05",cargo:["prefeito","governador"],t:"Rebelião em Presídio com Reféns",i:"🔒",
   s:"Maior presídio da cidade/estado em rebelião. 12 reféns. PM do lado de fora. Imprensa ao vivo. Você recebe o telefone.",
   ops:[
     {t:"Ir pessoalmente ao presídio e negociar",b:{progressista:+15,trabalhista:+12,evangelica:+10},e:{pop:+22,int:+18,vis:+35,din:0},m:"Você foi pessoalmente. Raro. Reféns voltaram sãos.",c:"Rebelião resolvida em 4h. Referência nacional."},
     {t:"Força de choque — retomada imediata",b:{seguranca:+22,evangelica:+10,progressista:-15,trabalhista:-12},e:{pop:-5,int:-8,vis:+20,din:0},m:"Força entrou. Funcionou mas deixou mortos.",c:"Direitos humanos protestam."},
     {t:"Mediadores do Ministério da Justiça",b:{progressista:+8,trabalhista:+8,evangelica:+5},e:{pop:+8,int:+10,vis:+12,din:0},m:"Você chamou mediadores federais. Resolvido sem protagonismo.",c:"Ministro federal fica com o crédito."},
     {t:"Decreto de intervenção do Exército",b:{seguranca:+15,evangelica:+12,progressista:-10},e:{pop:+5,int:+3,vis:+15,din:0},m:"Exército entrou. Resolvido. Precedente perigoso.",c:"Humanistas questionam uso das forças armadas."},
   ]},

  // ─── CRISES DE DEPUTADO / SENADOR (legislativos) ─────────────
  {id:"l01",cargo:["deputado","deputadoFed","senador"],t:"Voto Decisivo em Reforma Polêmica",i:"🗳️",
   s:"Votação histórica. Você tem o voto que define. Sua base quer que vote contra. Seu partido e o governo querem que vote a favor. Holofotes em você.",
   ops:[
     {t:"Votar com sua base — foi eleito por eles",b:{trabalhista:+20,progressista:+18},e:{pop:+18,int:+12,vis:+20,din:0},m:"Você votou com quem te elegeu. Custou politicamente.",c:"Partido punitivo. Sua base te adora."},
     {t:"Votar com o governo — pragmatismo político",b:{empresarial:+15,ruralista:+8,trabalhista:-18},e:{pop:-12,int:-12,vis:+10,din:+40000},m:"Você votou com o governo. Sua base ficou órfã.",c:"Emendas garantidas. Base furiosa."},
     {t:"Negociar emenda de proteção e votar com o governo",b:{trabalhista:+5,progressista:+3,empresarial:+10},e:{pop:+3,int:+5,vis:+15,din:+20000},m:"Você negociou emenda e aprovou. Meio-termo.",c:"Emenda parcialmente cumprida. Ficou bem com os dois."},
     {t:"Se ausentar com justificativa médica",b:{trabalhista:-8,progressista:-8,empresarial:-5},e:{pop:-12,int:-15,vis:-5,din:0},m:"Você fugiu da votação mais importante do ano.",c:"Jornalistas rastreiam seus voos nesse dia."},
   ]},
  {id:"l02",cargo:["deputado","deputadoFed","senador"],t:"CPI do Governo: Você Tem as Provas",i:"📋",
   s:"Você recebeu documentos provando desvio de R$400M. O governo é do seu partido. Pede que vote contra a CPI. Oposição te busca.",
   ops:[
     {t:"Votar pela CPI e entregar os documentos",b:{progressista:+22,trabalhista:+18,ambiental:+12},e:{pop:+22,int:+30,vis:+28,din:0},m:"Você votou pela CPI com provas. Traiu o partido mas serviu o povo.",c:"CPI aprovada. Partido te expulsa. Herói nacional."},
     {t:"Votar contra protegendo o partido",b:{progressista:-22,trabalhista:-18,empresarial:+10},e:{pop:-22,int:-28,vis:+5,din:+60000},m:"Você bloqueou investigação com provas na mão.",c:"Jornalista descobre que você tinha os documentos."},
     {t:"Vazar os documentos anonimamente",b:{progressista:+12,trabalhista:+10},e:{pop:+12,int:+8,vis:+15,din:0},m:"Você vazou sem se expor. A verdade veio à tona.",c:"Investigação jornalística pressiona. CPI inevitável."},
     {t:"Negociar: CPI arquivada em troca de cargo",b:{progressista:-15,trabalhista:-12,ruralista:+8},e:{pop:-8,int:-22,vis:+5,din:0},m:"Você trocou a CPI por um cargo. Transação pessoal.",c:"Cargo prometido. Investigadores descobrem a negociação."},
   ]},
  {id:"l03",cargo:["deputado","deputadoFed","senador"],t:"Tragédia na Sua Base — Onde Você Está?",i:"⛰️",
   s:"Deslizamento mata 60 famílias na sua região. Câmeras te procuram. Você está em Brasília em evento de partido.",
   ops:[
     {t:"Cancelar tudo e voltar imediatamente de madrugada",b:{trabalhista:+25,progressista:+20,evangelica:+15},e:{pop:+30,int:+20,vis:+32,din:-3000},m:"Você largou tudo e voltou. Chegou no barro.",c:"Fotos viralizaram. Você vira símbolo da crise."},
     {t:"Gravar vídeo de Brasília cobrando o governo",b:{trabalhista:+8,progressista:+8},e:{pop:+5,int:+5,vis:+15,din:0},m:"Vídeo repercutiu mas você não foi pessoalmente.",c:"Governo age em 24h após pressão pública."},
     {t:"Enviar assessor e ficar no evento",b:{trabalhista:-20,progressista:-18,evangelica:-12},e:{pop:-25,int:-15,vis:+8,din:0},m:"Você mandou assessor enquanto 60 famílias buscavam mortos.",c:"Matéria: 'Parlamentar festeja enquanto base sofre'."},
     {t:"Pegar voo comercial da manhã seguinte",b:{trabalhista:+3,progressista:+3},e:{pop:+2,int:+2,vis:+8,din:-800},m:"Você foi no voo da manhã. Demorou mas foi.",c:"Chega quando câmeras ainda estão lá."},
   ]},
  {id:"l04",cargo:["deputado","deputadoFed","senador"],t:"Assessor Preso em Operação da PF",i:"🚔",
   s:"Seu assessor mais próximo preso por desvio de emendas. Diz que agiu sozinho. Você assinou os documentos. 3h para imprensa chegar.",
   ops:[
     {t:"Demitir e pedir investigação inclusive de você mesmo",b:{progressista:+18,trabalhista:+14,evangelica:+10},e:{pop:+8,int:+25,vis:+22,din:0},m:"Você se colocou disponível para investigação. Raridade.",c:"PF te inocenta em 5 meses. Você sai mais forte."},
     {t:"Demitir e dizer que foi enganado",b:{progressista:+3,trabalhista:+3},e:{pop:-5,int:-5,vis:+15,din:0},m:"Você disse que foi enganado. Talvez verdade.",c:"Credibilidade abalada mas sobrevive."},
     {t:"Defender o assessor dizendo que é perseguição",b:{progressista:-18,trabalhista:-15},e:{pop:-15,int:-20,vis:+12,din:0},m:"Você defendeu alguém preso com provas.",c:"Mais provas surgem. Sua defesa vira piada."},
     {t:"Contratar advogado famoso e ficar calado",b:{progressista:-10,trabalhista:-10},e:{pop:-18,int:-10,vis:+8,din:-40000},m:"Você sumiu. Silêncio pareceu culpa.",c:"Especulação por semanas. Imprensa não desgruda."},
   ]},
  {id:"l05",cargo:["deputado","deputadoFed","senador"],t:"Emendas: Para Onde Vai o Dinheiro?",i:"💰",
   s:"Você tem emendas parlamentares milionárias. Assessoria lista: hospital regional, escola técnica, obra eleitoralmente estratégica, ONG aliada.",
   ops:[
     {t:"Hospital regional — maior impacto social real",b:{trabalhista:+20,progressista:+18,evangelica:+12},e:{pop:+22,int:+15,vis:+15,din:0},m:"Você priorizou saúde real acima de eleição.",c:"Hospital inaugurado. Região te adora."},
     {t:"Dividir entre hospital e escola técnica",b:{trabalhista:+12,progressista:+12,evangelica:+8},e:{pop:+14,int:+12,vis:+12,din:0},m:"Dois projetos menores mas de impacto real.",c:"Ambos inaugurados. Impacto moderado."},
     {t:"Obra eleitoralmente estratégica para a reeleição",b:{ruralista:+8,trabalhista:-10},e:{pop:+5,int:-15,vis:+5,din:0},m:"Você colocou reeleição acima do impacto social.",c:"TCU questiona critério eleitoreiro."},
     {t:"ONG aliada para mobilizar sua base",b:{progressista:+5,trabalhista:-10},e:{pop:-8,int:-20,vis:+3,din:0},m:"Você direcionou emendas para ativismo eleitoral.",c:"TCU bloqueia. Escândalo de desvio de finalidade."},
   ]},

  // ─── CRISES DE PRESIDENTE ─────────────────────────────────────
  {id:"p01",cargo:["presidente"],t:"Crise Cambial: Dólar a R$8",i:"💵",
   s:"Dólar disparou para R$8 em 48h. Inflação em 12%. FMI oferece empréstimo com corte de R$60B em programas sociais.",
   ops:[
     {t:"Rejeitar FMI e criar imposto sobre grandes fortunas",b:{trabalhista:+22,progressista:+22,ambiental:+10,empresarial:-22},e:{pop:+18,int:+12,vis:+22,din:-100000},m:"Você taxou os ricos em vez de cortar os pobres.",c:"Mercado turbulento por 60 dias. Depois estabiliza. Legado positivo."},
     {t:"Aceitar o FMI e cortar os programas sociais",b:{empresarial:+22,ruralista:+15,trabalhista:-25,progressista:-25},e:{pop:-22,int:-8,vis:+18,din:+300000},m:"Você entregou os pobres ao FMI.",c:"Moeda estabiliza. 4 milhões voltam à pobreza."},
     {t:"Renegociar com o FMI sem cortes sociais",b:{trabalhista:+12,progressista:+12,empresarial:+5},e:{pop:+10,int:+12,vis:+18,din:+100000},m:"Você foi ao FMI e conseguiu condições melhores.",c:"Acordo histórico. Câmbio cai."},
     {t:"Controle de capitais por 30 dias",b:{trabalhista:+5,progressista:+8,empresarial:-28,ruralista:-20},e:{pop:-5,int:+5,vis:+15,din:0},m:"Controle radical. Especulação parou. Mercado em pânico.",c:"30 dias de caos. Depois câmbio cai 20%."},
   ]},
  {id:"p02",cargo:["presidente"],t:"Processo de Impeachment na Mesa",i:"⚡",
   s:"Oposição deposita pedido de impeachment. Você tem 280 votos contra você de 342 necessários. Aliados desapareceram.",
   ops:[
     {t:"Pronunciamento ao vivo: apresentar provas e defender o mandato",b:{trabalhista:+18,progressista:+14,evangelica:+8},e:{pop:+18,int:+12,vis:+32,din:0},m:"Você foi à TV e apresentou sua defesa. Discurso histórico.",c:"Popularidade sobe 10 pontos. 25 deputados voltam."},
     {t:"Mobilizar movimentos sociais para as ruas",b:{trabalhista:+22,progressista:+20,lgbtq:+12,empresarial:-12},e:{pop:+22,int:+8,vis:+28,din:0},m:"Milhões nas ruas. Maior manifestação desde 1984.",c:"Deputados recuam. Impeachment arquivado por 30 votos."},
     {t:"Distribuir ministérios e verbas para segurar votos",b:{trabalhista:+3,progressista:+3,empresarial:+12,ruralista:+10},e:{pop:-8,int:-18,vis:+10,din:-500000},m:"Você sobreviveu distribuindo poder.",c:"Impeachment barrado. 'Presidente dos cargos'."},
     {t:"Negociar renúncia em troca de anistia",b:{trabalhista:-28,progressista:-28,lgbtq:-18},e:{pop:-35,int:-22,vis:+8,din:+200000},m:"Você cogitou renúncia. Vazou.",c:"Aliados abandonam de vez. Impeachment aprovado depois."},
   ]},
  {id:"p03",cargo:["presidente"],t:"400 Mortos em Rompimento de Barragem",i:"🌊",
   s:"Barragem de mineradora rompe. 400 mortos em MG. Empresa financiou sua campanha com R$5M. Imprensa internacional ao vivo.",
   ops:[
     {t:"Ir pessoalmente, decretar emergência e processar a empresa",b:{ambiental:+25,progressista:+22,trabalhista:+20},e:{pop:+22,int:+30,vis:+38,din:-100000},m:"Você foi à lama e processou quem te bancou. Histórico.",c:"Empresa multada em R$30B. Referência de governança global."},
     {t:"Mandar ministro e ficar no Palácio",b:{ambiental:-12,progressista:-12,trabalhista:-10},e:{pop:-18,int:-10,vis:+12,din:0},m:"Você ficou no Palácio. 'Presidente da frieza'.",c:"Manchete internacional: 400 mortos, presidente no Palácio."},
     {t:"Ir à região mas não mencionar a empresa",b:{ambiental:+8,progressista:+8,trabalhista:+10},e:{pop:+8,int:+5,vis:+20,din:0},m:"Você foi mas protegeu os financiadores.",c:"Investigação revela conexão doadores-empresa."},
     {t:"Culpar o governo anterior",b:{progressista:-8,trabalhista:-8,ambiental:-18},e:{pop:-12,int:-18,vis:+10,din:0},m:"Você culpou o governo anterior com 400 mortos na lama.",c:"'Desrespeito às vítimas'. Imprensa internacional te destroça."},
   ]},
  {id:"p04",cargo:["presidente"],t:"Filho Investigado pela PF",i:"👨‍👩‍👧",
   s:"PF investiga seu filho por influência em contratos federais. Imprensa tem o inquérito. 4h antes da publicação.",
   ops:[
     {t:"Dar entrevista afirmando que não vai interferir na investigação",b:{progressista:+18,trabalhista:+14,evangelica:+10},e:{pop:+12,int:+25,vis:+28,din:0},m:"'Ninguém acima da lei — nem meu filho.' Histórico.",c:"PF investiga livremente. Filho condenado. Você respeitado."},
     {t:"Pedir ao PGR que arquive o inquérito",b:{progressista:-20,trabalhista:-18,lgbtq:-12},e:{pop:-20,int:-30,vis:+15,din:0},m:"Você tentou salvar o filho usando o cargo.",c:"Vazamento da ligação com o PGR. STF investiga você."},
     {t:"Dar entrevista dizendo que confia na Justiça",b:{progressista:+5,trabalhista:+5,evangelica:+8},e:{pop:+5,int:+8,vis:+18,din:0},m:"Você defendeu o filho mas disse confiar na Justiça.",c:"Investigação segue. Posição aceitável."},
     {t:"Silêncio e deixar o advogado falar",b:{progressista:-8,trabalhista:-8},e:{pop:-8,int:-5,vis:+10,din:-50000},m:"Seu silêncio lido como cumplicidade.",c:"Advogado faz declarações contraditórias. Piora."},
   ]},
];

// Expandir pool com variações para chegar a 50+ por mandato
const expandirCrises = (cargo, mandatoDur) => {
  const total = mandatoDur * 12; // meses do mandato
  const meta = Math.min(total, 50);

  // Filtrar crises do cargo específico + universais
  const especificas = ALL_CRISES.filter(c =>
    c.cargo.includes(cargo) || c.cargo.includes("*")
  );

  // Se não temos suficientes, repetir com variações aleatórias de contexto
  const resultado = [...especificas];
  let extra = 0;
  while (resultado.length < meta) {
    const base = especificas[extra % especificas.length];
    resultado.push({
      ...base,
      id: `${base.id}_r${extra}`,
      t: [
        base.t,
        `Nova versão: ${base.t}`,
        `Caso recorrente: ${base.t}`,
      ][extra % 3],
    });
    extra++;
  }
  return resultado.slice(0, meta);
};

// ── LEIS POOL ────────────────────────────────────────────────
const LEIS = {
  vereador:[
    {id:"lv1",t:"Tarifa Social de Água",d:"Desconto de 70% na água para famílias com renda até 1 SM.",b:{trabalhista:+20,progressista:+18,evangelica:+10},e:{pop:+18,int:+10,din:-8000}},
    {id:"lv2",t:"Gratuidade no Ônibus para Idosos",d:"Isenção de tarifa para maiores de 65 anos.",b:{trabalhista:+18,progressista:+14,evangelica:+12},e:{pop:+20,int:+10,din:-12000}},
    {id:"lv3",t:"Câmeras nos Corredores Escolares",d:"Segurança nas escolas municipais.",b:{seguranca:+12,evangelica:+10,trabalhista:+8},e:{pop:+10,int:+6,din:-6000}},
    {id:"lv4",t:"Proibição de Fogos com Estampido",d:"Proteger animais, autistas e portadores de PTSD.",b:{ambiental:+14,lgbtq:+10,progressista:+12},e:{pop:+8,int:+8,din:-1000}},
    {id:"lv5",t:"Passe Livre Estudantil Universal",d:"Transporte gratuito para alunos da rede pública.",b:{trabalhista:+20,progressista:+16,lgbtq:+8},e:{pop:+22,int:+10,din:-18000}},
    {id:"lv6",t:"Alimentação Saudável nas Cantinas",d:"Proibir ultraprocessados em cantinas escolares.",b:{progressista:+14,evangelica:+10,trabalhista:+8},e:{pop:+8,int:+10,din:-2000}},
    {id:"lv7",t:"Rampa de Acessibilidade Obrigatória",d:"Todo comércio com mais de 50m² deve ter rampa.",b:{progressista:+12,lgbtq:+10,trabalhista:+8},e:{pop:+10,int:+8,din:-3000}},
  ],
  prefeito:[
    {id:"pp1",t:"Decreto: Piso Municipal dos Professores",d:"Reajuste de 20% acima do piso nacional.",b:{trabalhista:+22,progressista:+18,evangelica:+10},e:{pop:+22,int:+12,din:-40000}},
    {id:"pp2",t:"Programa Municipal de Habitação",d:"2.000 unidades habitacionais para baixa renda.",b:{trabalhista:+20,progressista:+16,evangelica:+12},e:{pop:+22,int:+12,din:-80000}},
    {id:"pp3",t:"UBS 24h em Todos os Bairros",d:"Atendimento de saúde 24 horas.",b:{trabalhista:+22,progressista:+18,evangelica:+14},e:{pop:+24,int:+14,din:-50000}},
  ],
  deputado:[
    {id:"ld1",t:"Cotas para PCDs nos Concursos Estaduais",d:"10% das vagas para pessoas com deficiência.",b:{progressista:+16,lgbtq:+12,trabalhista:+12},e:{pop:+12,int:+10,din:-5000}},
    {id:"ld2",t:"Proibição de Queimadas no Estado",d:"Multas pesadas para qualquer queimada.",b:{ambiental:+22,progressista:+14,ruralista:-16},e:{pop:+8,int:+12,din:-3000}},
    {id:"ld3",t:"Lei Estadual de Proteção à Mulher",d:"Casas de abrigo em municípios com mais de 20k hab.",b:{lgbtq:+20,progressista:+16,evangelica:+6},e:{pop:+14,int:+12,din:-15000}},
    {id:"ld4",t:"Piso Estadual da Enfermagem",d:"Salário mínimo estadual acima do federal.",b:{trabalhista:+22,progressista:+18},e:{pop:+18,int:+12,din:-22000}},
  ],
  deputadoFed:[
    {id:"dF1",t:"Marco do Saneamento Universal",d:"Água tratada para 100% dos brasileiros até 2033.",b:{trabalhista:+20,progressista:+16,ambiental:+14},e:{pop:+20,int:+16,din:-80000}},
    {id:"dF2",t:"PEC da Reforma Tributária",d:"IVA unificado. Simplificação radical.",b:{empresarial:+16,ruralista:+10,trabalhista:+6},e:{pop:+6,int:+10,din:-20000}},
    {id:"dF3",t:"PEC do Voto aos 16 Anos",d:"Voto obrigatório para 16 e 17 anos.",b:{progressista:+16,lgbtq:+12,trabalhista:+8,evangelica:-8},e:{pop:+8,int:+8,din:0}},
    {id:"dF4",t:"Marco Regulatório da IA",d:"Regular inteligência artificial no Brasil.",b:{empresarial:+12,progressista:+10,trabalhista:+6},e:{pop:+8,int:+10,din:-5000}},
  ],
  senador:[
    {id:"ls1",t:"Lei de Responsabilidade Climática",d:"Metas obrigatórias de emissão para empresas.",b:{ambiental:+24,progressista:+16,ruralista:-20},e:{pop:+10,int:+16,din:-15000}},
    {id:"ls2",t:"Reforma Política — Cláusula de Barreira",d:"Partidos com menos de 2% extintos.",b:{empresarial:+10,progressista:+8,trabalhista:+6},e:{pop:+5,int:+10,din:0}},
  ],
  governador:[
    {id:"lg1",t:"Decreto: Piso do Magistério +25%",d:"Reajuste de 25% para professores estaduais.",b:{trabalhista:+24,progressista:+20},e:{pop:+22,int:+14,din:-50000}},
    {id:"lg2",t:"Decreto: Habitação Popular Estadual",d:"8.000 unidades para famílias com renda até 2SM.",b:{trabalhista:+22,progressista:+18,evangelica:+14},e:{pop:+24,int:+14,din:-100000}},
  ],
  presidente:[
    {id:"lp1",t:"Sancionei: Piso Nacional da Enfermagem",d:"2 milhões de trabalhadores beneficiados.",b:{trabalhista:+22,progressista:+20,evangelica:+10},e:{pop:+20,int:+16,din:-150000}},
    {id:"lp2",t:"Vetei: Privatização dos Correios",d:"100k empregos preservados.",b:{trabalhista:+18,progressista:+16,empresarial:-14},e:{pop:+12,int:+14,din:0}},
    {id:"lp3",t:"MP: Casa para Todos",d:"2 milhões de unidades habitacionais.",b:{trabalhista:+24,progressista:+22,evangelica:+12},e:{pop:+24,int:+14,din:-600000}},
    {id:"lp4",t:"Decreto: Salário Mínimo +10%",d:"50 milhões de beneficiados.",b:{trabalhista:+22,progressista:+18,empresarial:-12},e:{pop:+24,int:+12,din:-250000}},
    {id:"lp5",t:"Vetei: PL Anti-Aborto em caso de estupro",d:"Vítimas de estupro não serão criminalizadas.",b:{lgbtq:+24,progressista:+22,evangelica:-28,ruralista:-16},e:{pop:+5,int:+22,din:0}},
  ],
};

// ── HELPERS ──────────────────────────────────────────────────
const clamp  = (v,a=0,b=100)=>Math.max(a,Math.min(b,Math.round(v)));
const fmt    = n=>n>=1e6?`R$${(n/1e6).toFixed(1)}M`:n>=1e3?`R$${(n/1e3).toFixed(0)}k`:`R$${Math.round(n)}`;
const rnd    = a=>a[Math.floor(Math.random()*a.length)];
const getP   = id=>PARTIDOS.find(p=>p.id===id);
const getC   = id=>CARGOS[id];
const getA   = id=>AREAS.find(a=>a.id===id);

const calcChance=(ch,cargo,gasto)=>{
  const c=getC(cargo); if(!c) return 0;
  const minDin=c.sal*3;
  const dinBonus=Math.min(20,Math.round((gasto/Math.max(1,minDin))*16));
  const expBonus=(ch.historicoCargos||[]).filter(h=>h.cargo===cargo).length*6;
  const raw=(ch.popularidade*0.38)+(ch.visibilidade*0.22)+(ch.integridade*0.08)+expBonus+dinBonus-c.eBase+50;
  return clamp(Math.round(raw),3,93);
};

// Gerar notícias dinâmicas baseadas em orçamento, popularidade e eventos
const gerarNoticias=(ch,partido,cargo,orcamento)=>{
  const ns=[];
  const p=ch.popularidade, v=ch.visibilidade, i=ch.integridade;
  const c=getC(cargo);

  // Notícias de aprovação
  if(p>=70) ns.push({cat:"APROVAÇÃO",f:"📺 TV Brasília",t:`${ch.nome} lidera pesquisas com ${p}% — fenômeno político nacional`});
  else if(p>=50) ns.push({cat:"APROVAÇÃO",f:"📰 Folha Política",t:`${ch.nome} mantém aprovação moderada de ${p}% apesar das pressões`});
  else if(p<30) ns.push({cat:"APROVAÇÃO",f:"📻 Rádio Congresso",t:`CRISE: ${ch.nome} despenca para ${p}% — oposição intensifica pressão`});
  else ns.push({cat:"APROVAÇÃO",f:"📊 Datafolha",t:`${ch.nome} tem aprovação de ${p}% — cenário eleitoral indefinido`});

  // Notícias de orçamento
  if(orcamento){
    const maiores=AREAS.slice().sort((a,b)=>(orcamento[b.id]||b.base)-(orcamento[a.id]||a.base)).slice(0,2);
    const menores=AREAS.slice().sort((a,b)=>(orcamento[a.id]||a.base)-(orcamento[b.id]||b.base)).slice(0,1);
    ns.push({cat:"ORÇAMENTO",f:"💰 Economia Hoje",t:`Governo investe mais em ${maiores[0].n} (${orcamento[maiores[0].id]||maiores[0].base}%) e ${maiores[1].n} (${orcamento[maiores[1].id]||maiores[1].base}%)`});
    ns.push({cat:"ORÇAMENTO",f:"⚠️ Corte Orçamentário",t:`${menores[0].n} com menor verba da gestão: ${orcamento[menores[0].id]||menores[0].base}% — setor cobra atenção`});
  }

  // Notícias de integridade
  if(i<38) ns.push({cat:"INTEGRIDADE",f:"🔍 Transparência.gov",t:`Índice de integridade de ${ch.nome} preocupa analistas: ${i}% — o mais baixo da gestão`});
  else if(i>=82) ns.push({cat:"INTEGRIDADE",f:"🏆 Instituto Ético",t:`${ch.nome} é eleito o ${c?.n||"político"} mais íntegro do período: ${i}%`});

  // Notícias de leis
  if((ch.leisAprovadas||[]).length>0){
    const u=ch.leisAprovadas[ch.leisAprovadas.length-1];
    ns.push({cat:"LEGISLAÇÃO",f:"📜 Diário Oficial",t:`Publicada lei: "${u.t}" — sancionada/proposta por ${ch.nome}`});
  }

  // Notícias de memória
  if((ch.memorias||[]).length>0){
    const m=ch.memorias[ch.memorias.length-1];
    ns.push({cat:"ANÁLISE",f:"💭 Coluna Política",t:`"${m.t}" — analistas discutem impacto dessa decisão de ${ch.nome}`});
  }

  return ns.slice(0,6);
};

// ── ESTADO INICIAL ────────────────────────────────────────────
const INIT={
  nome:"",idade:18,ano:2025,
  partido:null,personalidade:null,cargo:null,
  popularidade:20,visibilidade:10,integridade:70,
  dinheiro:30000,patrimonio:30000,
  mandMeses:0,mandTotal:0,
  orcamento: AREAS.reduce((acc,a)=>({...acc,[a.id]:a.base}),{}),
  historicoOrc:[],
  historicoCargos:[],leisAprovadas:[],leisRejeitadas:[],
  memorias:[],log:[],
  vitEl:0,derrEl:0,crisesResolvidas:0,
};

// ── COMPONENTES UI ────────────────────────────────────────────
const Tag=({c,ch,sm})=>(<span style={{fontSize:sm?9:10,padding:sm?"1px 7px":"2px 9px",borderRadius:12,background:c+"1A",color:c,border:`1px solid ${c}2A`,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>{ch}</span>);
const Nt=({n})=>n?(<div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:K.s1,border:`1px solid ${n.t==="err"?K.rd:n.t==="ok"?K.gr:n.t==="w"?K.or:K.bl}`,borderRadius:10,padding:"10px 22px",fontSize:11,color:K.tx,maxWidth:"92vw",textAlign:"center",boxShadow:"0 8px 40px #000000BB",fontFamily:"'JetBrains Mono',monospace"}}>{n.m}</div>):null;
const Bar=({label,v,icon,c=K.bl})=>{const pv=clamp(v);const col=pv>=60?c:pv>=35?K.or:K.rd;return(<div style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:10,color:K.mu,fontFamily:"'JetBrains Mono',monospace"}}>{icon} {label}</span><span style={{fontSize:10,fontWeight:700,color:col,fontFamily:"'JetBrains Mono',monospace"}}>{pv}%</span></div><div style={{height:3,background:K.dm,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${pv}%`,background:col,borderRadius:2,transition:"width .6s ease"}}/></div></div>);};

// ═══════════════════════════════════════════════════════════════
//  APP
// ═══════════════════════════════════════════════════════════════
export default function App(){
  const [sc,setSc]=useState("criacao");
  const [ch,setCh]=useState(INIT);
  const [elC,setElC]=useState(null);
  const [crise,setCrise]=useState(null);
  const [lei,setLei]=useState(null);
  const [tab,setTab]=useState("painel");
  const [nt,setNt]=useState(null);
  const [trocaP,setTrocaP]=useState(false);
  const [crPool,setCrPool]=useState([]);
  const [crIdx,setCrIdx]=useState(0);
  const [lPool,setLPool]=useState([]);
  const [lIdx,setLIdx]=useState(0);
  const ntR=useRef(null);

  const notify=(m,t="i")=>{setNt({m,t});if(ntR.current)clearTimeout(ntR.current);ntR.current=setTimeout(()=>setNt(null),4200);};
  const up=fn=>setCh(prev=>{const n=JSON.parse(JSON.stringify(prev));fn(n);return n;});
  const log=(c,txt)=>{c.log=[...c.log,{txt,ano:c.ano,cargo:c.cargo||"civil"}];};

  // ── INÍCIO ──────────────────────────────────────────────────
  const start=dados=>{
    const pers=PERS.find(p=>p.id===dados.personalidade);
    const novo={...INIT,...dados,
      popularidade:clamp(20+(pers?.bon.pop||0)),
      integridade:clamp(70+(pers?.bon.int||0)),
      dinheiro:30000+(pers?.bon.din||0),
      patrimonio:30000+(pers?.bon.din||0),
      log:[{txt:`${dados.nome} inicia carreira pelo ${getP(dados.partido)?.f}`,ano:2025,cargo:"civil"}],
    };
    setCh(novo); setElC("vereador"); setSc("eleicao");
  };

  // ── ELEIÇÃO ──────────────────────────────────────────────────
  const confirmarEl=(cargo,gasto,ganhou)=>{
    if(ganhou){
      const inf=getC(cargo);
      const pool=expandirCrises(cargo,inf.dur);
      // shuffle
      const shuffled=[...pool].sort(()=>Math.random()-.5);
      setCrPool(shuffled); setCrIdx(0);
      const lp=(LEIS[cargo]||[]).sort(()=>Math.random()-.5);
      setLPool(lp); setLIdx(0);
    }
    up(c=>{
      c.dinheiro=Math.max(0,c.dinheiro-gasto);
      c.patrimonio=Math.max(0,c.patrimonio-gasto);
      if(ganhou){
        const inf=getC(cargo);
        c.cargo=cargo;
        c.mandMeses=inf.dur*12;
        c.mandTotal=inf.dur*12;
        c.vitEl++;
        c.historicoCargos=[...c.historicoCargos,{cargo,ano:c.ano,partido:c.partido}];
        // orçamento base reinicia
        c.orcamento=AREAS.reduce((acc,a)=>({...acc,[a.id]:a.base}),{});
        log(c,`✅ ELEITO ${inf.n} — mandato de ${inf.dur} anos (${inf.dur*12} meses).`);
      } else {
        c.derrEl++;
        c.popularidade=clamp(c.popularidade-10);
        log(c,`❌ Derrota na eleição para ${getC(cargo)?.n}.`);
      }
    });
    setTab("painel"); setSc("mandato");
    notify(ganhou?`🎉 ELEITO ${getC(cargo)?.n}!`:"😞 Derrota nas urnas.",ganhou?"ok":"err");
  };

  // ── CRISE ────────────────────────────────────────────────────
  const abrirCrise=()=>{
    if(crIdx>=crPool.length){notify("Todas as situações deste mandato enfrentadas!","i");return;}
    setCrise(crPool[crIdx]); setSc("crise");
  };
  const escolherCrise=op=>{
    up(c=>{
      c.popularidade=clamp(c.popularidade+(op.e.pop||0));
      c.integridade =clamp(c.integridade+(op.e.int||0));
      c.visibilidade=clamp(c.visibilidade+(op.e.vis||0));
      c.dinheiro    =Math.max(0,c.dinheiro+(op.e.din||0));
      c.patrimonio  =Math.max(0,c.patrimonio+(op.e.din||0));
      c.mandMeses=Math.max(0,c.mandMeses-1);
      c.crisesResolvidas=(c.crisesResolvidas||0)+1;
      c.memorias=[...c.memorias,{t:op.m,ano:c.ano}];
      // Salário mensal ao avançar 1 mês
      if(c.cargo){const inf=getC(c.cargo);c.dinheiro+=inf.sal;c.patrimonio+=inf.sal;}
      log(c,`⚡ ${crise.t}: "${op.t}" → ${op.c}`);
      if(c.mandMeses<=0&&c.cargo){log(c,`📅 Mandato de ${getC(c.cargo)?.n} encerrado.`);c.cargo=null;}
    });
    setCrIdx(i=>i+1);
    notify(op.c,"w");
    setCrise(null); setSc("mandato"); setTab("painel");
  };

  // ── LEI ──────────────────────────────────────────────────────
  const abrirLei=()=>{
    if(lIdx>=lPool.length){notify("Todas as propostas votadas neste mandato!","i");return;}
    setLei(lPool[lIdx]); setSc("lei");
  };
  const votar=v=>{
    if(!v){up(c=>{c.leisRejeitadas=[...c.leisRejeitadas,lei.t];log(c,`🚫 Arquivado: ${lei.t}`);});notify("Proposta arquivada.","i");setLei(null);setSc("mandato");return;}
    const base=ch.cargo==="presidente"?98:32+(ch.popularidade*0.32)+(ch.visibilidade*0.2);
    const aprov=Math.random()*100<Math.min(95,base);
    up(c=>{
      if(aprov){
        c.popularidade=clamp(c.popularidade+(lei.e.pop||0));
        c.integridade =clamp(c.integridade+(lei.e.int||0));
        c.dinheiro    =Math.max(0,c.dinheiro+(lei.e.din||0));
        c.leisAprovadas=[...c.leisAprovadas,{t:lei.t,ano:c.ano}];
        log(c,`✅ Lei aprovada: ${lei.t}`);
      } else {c.leisRejeitadas=[...c.leisRejeitadas,lei.t];log(c,`❌ Lei rejeitada: ${lei.t}`);}
    });
    setLIdx(i=>i+1);
    notify(aprov?`✅ ${lei.t} aprovada!`:`❌ ${lei.t} rejeitada.`,aprov?"ok":"err");
    setLei(null); setSc("mandato");
  };

  // ── ORÇAMENTO ─────────────────────────────────────────────────
  const updateOrc=(areaId,delta)=>{
    const total=Object.values({...ch.orcamento,[areaId]:(ch.orcamento[areaId]||0)+delta}).reduce((s,v)=>s+v,0);
    if(total>100||total<0) return;
    const newVal=(ch.orcamento[areaId]||0)+delta;
    if(newVal<0) return;
    up(c=>{c.orcamento={...c.orcamento,[areaId]:newVal};});
  };

  // ── AVANÇAR MÊS ───────────────────────────────────────────────
  const avancarMes=()=>{
    up(c=>{
      if(!c.cargo) return;
      const inf=getC(c.cargo);
      c.dinheiro+=inf.sal;
      c.patrimonio+=inf.sal;
      c.mandMeses=Math.max(0,c.mandMeses-1);
      c.visibilidade=clamp(c.visibilidade+(Math.random()>.55?1:-1));
      if(c.mandMeses<=0){
        log(c,`📅 Mandato de ${inf.n} encerrado em ${c.ano}.`);
        c.cargo=null;c.mandMeses=0;c.mandTotal=0;c.ano++;c.idade++;
      }
    });
    notify("📅 Mês avançado — salário recebido.","i");
  };

  // ── TROCAR PARTIDO ────────────────────────────────────────────
  const trocar=(novoP,razId)=>{
    const RAZOES=[
      {id:"ideologia",d:"Divergência ideológica genuína",int:+5,pop:-5},
      {id:"oportunismo",d:"Melhores chances eleitorais",int:-16,pop:+8},
      {id:"conflito",d:"Conflito com a liderança",int:0,pop:-3},
      {id:"investigacao",d:"Fuga de investigação",int:-26,pop:-16},
    ];
    const r=RAZOES.find(x=>x.id===razId);
    up(c=>{
      log(c,`🔄 Migrou do ${getP(c.partido)?.n} para ${getP(novoP)?.n} — ${r?.d}`);
      c.partido=novoP;
      c.integridade=clamp(c.integridade+(r?.int||0));
      c.popularidade=clamp(c.popularidade+(r?.pop||0));
    });
    notify(`Migrou para ${getP(novoP)?.n}.`,"w"); setTrocaP(false);
  };

  const partido=getP(ch.partido);
  const cargo=ch.cargo?getC(ch.cargo):null;
  const orcTotal=Object.values(ch.orcamento).reduce((s,v)=>s+v,0);
  const progMandato=ch.mandTotal>0?Math.round(((ch.mandTotal-ch.mandMeses)/ch.mandTotal)*100):0;
  const crisesPorMes=crPool.length;
  const noticias=gerarNoticias(ch,partido,ch.cargo,ch.orcamento);

  if(sc==="criacao") return <Criacao onStart={start}/>;
  if(sc==="eleicao") return <Eleicao ch={ch} cargo={elC} onConfirm={confirmarEl}/>;
  if(sc==="crise"&&crise) return <CriseScreen crise={crise} ch={ch} partido={partido} cargo={cargo} onEscolha={escolherCrise}/>;
  if(sc==="lei"&&lei) return <LeiScreen lei={lei} ch={ch} cargo={cargo} onVotar={votar}/>;
  if(sc==="aposentadoria") return <Aposentadoria ch={ch} partido={partido} onReinicio={()=>{setCh(INIT);setSc("criacao");}}/>;

  // ─── MANDATO PRINCIPAL ────────────────────────────────────────
  return(
    <div style={{minHeight:"100vh",background:K.bg,color:K.tx,fontFamily:"'Outfit',sans-serif"}}>
      <style>{F}</style>
      <Nt n={nt}/>

      {/* HEADER */}
      <div style={{background:K.s1,borderBottom:`1px solid ${K.bd}`,padding:"11px 16px",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700}}>{cargo?.i||"🏠"} {ch.nome}</div>
            <div style={{fontSize:9,color:K.mu,marginTop:1,fontFamily:"'JetBrains Mono',monospace"}}>
              {cargo?cargo.n:"Sem cargo"} · {partido?.n||"—"} · {Math.round(ch.idade)}a · {ch.ano}
              {cargo&&` · ${ch.mandMeses}m restantes`}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:14,fontWeight:800,color:K.go,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(ch.dinheiro)}</div>
            {cargo&&<div style={{fontSize:8,color:K.mu,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(cargo.sal)}/mês</div>}
          </div>
        </div>
        {/* Barras de status */}
        <div style={{display:"flex",gap:8,marginTop:8}}>
          {[["pop.",ch.popularidade,K.gr],["vis.",ch.visibilidade,K.bl],["integ.",ch.integridade,K.go]].map(([l,v,c])=>(
            <div key={l} style={{flex:1}}>
              <div style={{fontSize:8,color:K.mu,marginBottom:2,fontFamily:"'JetBrains Mono',monospace"}}>{l}{Math.round(v)}%</div>
              <div style={{height:3,background:K.dm,borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${clamp(v)}%`,background:v>=60?c:v>=35?K.or:K.rd,borderRadius:2,transition:"width .6s"}}/>
              </div>
            </div>
          ))}
        </div>
        {/* Progresso do mandato */}
        {cargo&&ch.mandTotal>0&&(
          <div style={{marginTop:6}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
              <span style={{fontSize:8,color:K.mu,fontFamily:"'JetBrains Mono',monospace"}}>mandato {progMandato}%</span>
              <span style={{fontSize:8,color:K.mu,fontFamily:"'JetBrains Mono',monospace"}}>crises: {crIdx}/{crPool.length}</span>
            </div>
            <div style={{height:2,background:K.dm,borderRadius:1,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progMandato}%`,background:K.pu,borderRadius:1,transition:"width .4s"}}/>
            </div>
          </div>
        )}
      </div>

      {/* TABS */}
      <div style={{display:"flex",background:K.s1,borderBottom:`1px solid ${K.bd}`,overflowX:"auto"}}>
        {[["painel","⚡ Painel"],["orcamento","💰 Orçamento"],["noticias","📰 Notícias"],["leis","📜 Leis"],["carreira","🗺️ Carreira"],["historico","📋 Histórico"]].map(([id,lb])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{padding:"8px 12px",background:"none",border:"none",borderBottom:`2px solid ${tab===id?K.bl:"transparent"}`,color:tab===id?K.bl:K.mu,fontSize:10,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'JetBrains Mono',monospace"}}>
            {lb}
          </button>
        ))}
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:16}}>

        {/* ─── PAINEL ─── */}
        {tab==="painel"&&(<div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {[["👥 Popularidade",ch.popularidade,K.gr],["📺 Visibilidade",ch.visibilidade,K.bl],["⚖️ Integridade",ch.integridade,K.go],["💰 Patrimônio",ch.dinheiro,K.te]].map(([l,v,c])=>(
              <div key={l} style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:9,padding:"11px 13px"}}>
                <div style={{fontSize:9,color:K.mu,marginBottom:3,fontFamily:"'JetBrains Mono',monospace"}}>{l}</div>
                <div style={{fontSize:18,fontWeight:800,color:l.includes("Patrimônio")?K.go:clamp(v)>=60?c:clamp(v)>=35?K.or:K.rd,fontFamily:"'JetBrains Mono',monospace"}}>
                  {l.includes("Patrimônio")?fmt(v):`${Math.round(v)}%`}
                </div>
              </div>
            ))}
          </div>

          {cargo&&(
            <div style={{background:K.s2,border:`1px solid ${K.go}22`,borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:14}}>{cargo.i} {cargo.n}</span>
                <div style={{display:"flex",gap:6}}>
                  <Tag c={K.go} ch={`${ch.mandMeses}m restantes`}/>
                  <Tag c={K.pu} ch={`crise ${crIdx+1}/${crPool.length}`}/>
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <Tag c={partido?.c||K.bl} ch={`${partido?.i} ${partido?.n}`}/>
                <Tag c={K.gr} ch={`${fmt(cargo.sal)}/mês`}/>
                <Tag c={K.mu} ch={cargo.esfera}/>
              </div>
            </div>
          )}

          {!cargo&&(
            <div style={{background:`${K.rd}0D`,border:`1px solid ${K.rd}22`,borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:13,color:K.rd,fontWeight:700,marginBottom:4}}>⚠️ Sem cargo ativo</div>
              <div style={{fontSize:11,color:K.mu}}>Vá à aba Carreira para se candidatar.</div>
            </div>
          )}

          {ch.memorias.length>0&&(
            <div style={{background:`${K.pu}0A`,border:`1px solid ${K.pu}1A`,borderRadius:10,padding:12,marginBottom:12}}>
              <div style={{fontSize:9,color:K.pu,marginBottom:6,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1}}>💭 MEMÓRIAS QUE VOLTAM</div>
              {ch.memorias.slice(-2).map((m,i)=>(<div key={i} style={{fontSize:11,color:K.mu,marginBottom:3,lineHeight:1.5}}>{m.t}</div>))}
            </div>
          )}

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {cargo&&ch.mandMeses>0&&crIdx<crPool.length&&(
              <button onClick={abrirCrise} style={{padding:14,background:`linear-gradient(135deg,#400010,${K.rd})`,border:"none",borderRadius:9,color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,cursor:"pointer",gridColumn:"1/-1",lineHeight:1.3}}>
                ⚡ PRÓXIMA SITUAÇÃO / CRISE
                <div style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",opacity:.7,marginTop:3}}>situação {crIdx+1} de {crPool.length} · mês {ch.mandTotal-ch.mandMeses+1} de {ch.mandTotal}</div>
              </button>
            )}
            {cargo&&crIdx>=crPool.length&&ch.mandMeses>0&&(
              <div style={{gridColumn:"1/-1",background:`${K.gr}0D`,border:`1px solid ${K.gr}22`,borderRadius:9,padding:14,textAlign:"center"}}>
                <div style={{color:K.gr,fontWeight:700,marginBottom:4}}>✅ Todas as situações enfrentadas!</div>
                <div style={{fontSize:11,color:K.mu}}>Avance os meses restantes ou proponha leis.</div>
              </div>
            )}
            {cargo&&ch.mandMeses>0&&(
              <button onClick={abrirLei} style={{padding:12,background:`linear-gradient(135deg,#281500,${K.go})`,border:"none",borderRadius:9,color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:12,fontWeight:700,cursor:"pointer"}}>📜 PROPOR LEI</button>
            )}
            {cargo&&ch.mandMeses>0&&(
              <button onClick={avancarMes} style={{padding:12,background:K.s2,border:`1px solid ${K.bd}`,borderRadius:9,color:K.mu,fontFamily:"'JetBrains Mono',monospace",fontSize:11,cursor:"pointer"}}>⏩ AVANÇAR MÊS</button>
            )}
            {cargo&&ch.mandMeses<=0&&(
              <button onClick={()=>{up(c=>{c.cargo=null;c.mandMeses=0;});setTab("carreira");notify("Mandato encerrado! Próximos passos.","w");}}
                style={{padding:14,background:`linear-gradient(135deg,#001A40,${K.bl})`,border:"none",borderRadius:9,color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,cursor:"pointer",gridColumn:"1/-1"}}>
                📅 MANDATO ENCERRADO — PRÓXIMOS PASSOS
              </button>
            )}
            {!cargo&&(
              <button onClick={()=>setTab("carreira")} style={{padding:14,background:`linear-gradient(135deg,#001A40,${K.bl})`,border:"none",borderRadius:9,color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,cursor:"pointer",gridColumn:"1/-1"}}>
                🗳️ SE CANDIDATAR A NOVO CARGO
              </button>
            )}
            <button onClick={()=>setTrocaP(true)} style={{padding:11,background:K.s2,border:`1px solid ${K.bd}`,borderRadius:9,color:K.mu,fontSize:11,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>🔄 TROCAR PARTIDO</button>
            <button onClick={()=>setSc("aposentadoria")} style={{padding:11,background:`${K.rd}0A`,border:`1px solid ${K.rd}1A`,borderRadius:9,color:K.rd,fontSize:11,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>🧓 APOSENTAR</button>
          </div>

          {trocaP&&(
            <div style={{position:"fixed",inset:0,background:"#000000CC",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
              <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:14,padding:20,maxWidth:460,width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,marginBottom:4}}>🔄 Trocar de Partido</div>
                <div style={{fontSize:10,color:K.mu,marginBottom:14,fontFamily:"'JetBrains Mono',monospace"}}>Atual: {partido?.f}</div>
                {[{id:"ideologia",d:"Divergência ideológica genuína",int:+5,pop:-5},{id:"oportunismo",d:"Melhores chances eleitorais",int:-16,pop:+8},{id:"conflito",d:"Conflito com a liderança",int:0,pop:-3},{id:"investigacao",d:"Fuga de investigação",int:-26,pop:-16}].map(r=>(
                  <div key={r.id} style={{background:K.s1,borderRadius:8,padding:12,marginBottom:8}}>
                    <div style={{fontWeight:600,fontSize:12,marginBottom:6}}>{r.d}</div>
                    <div style={{display:"flex",gap:5,marginBottom:8}}>
                      <Tag c={r.int>=0?K.gr:K.rd} ch={`${r.int>=0?"+":""}${r.int} integ.`} sm/>
                      <Tag c={r.pop>=0?K.gr:K.rd} ch={`${r.pop>=0?"+":""}${r.pop} pop.`} sm/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4}}>
                      {PARTIDOS.filter(p=>p.id!==ch.partido).map(p=>(
                        <button key={p.id} onClick={()=>trocar(p.id,r.id)} style={{padding:"5px 2px",background:`${p.c}1A`,border:`1px solid ${p.c}33`,borderRadius:6,cursor:"pointer",fontSize:9,color:p.c,fontFamily:"'JetBrains Mono',monospace",textAlign:"center"}}>
                          {p.i}<br/>{p.n}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={()=>setTrocaP(false)} style={{marginTop:8,width:"100%",padding:9,background:"transparent",border:`1px solid ${K.bd}`,borderRadius:8,color:K.mu,cursor:"pointer",fontSize:11}}>Cancelar</button>
              </div>
            </div>
          )}
        </div>)}

        {/* ─── ORÇAMENTO ─── */}
        {tab==="orcamento"&&(<div>
          <div style={{background:K.s2,border:`1px solid ${K.go}22`,borderRadius:10,padding:16,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15}}>💰 Alocação de Orçamento</span>
              <Tag c={orcTotal===100?K.gr:K.rd} ch={`${orcTotal}/100%`}/>
            </div>
            <div style={{fontSize:11,color:K.mu,marginBottom:14,lineHeight:1.6}}>
              Distribua os 100% do orçamento entre as áreas. As notícias e a opinião pública reagem às suas prioridades. Cada aumento/diminuição afeta bancadas e popularidade ao longo do mandato.
            </div>
            {AREAS.map(a=>{
              const val=ch.orcamento[a.id]||0;
              return(
                <div key={a.id} style={{background:K.s1,borderRadius:8,padding:12,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontWeight:600,fontSize:12,color:a.cor}}>{a.i} {a.n}</span>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <button onClick={()=>updateOrc(a.id,-1)} disabled={val<=0} style={{width:22,height:22,background:val<=0?"#111":K.rd+"33",border:`1px solid ${val<=0?"#222":K.rd}`,borderRadius:4,color:val<=0?K.mu:K.rd,cursor:val<=0?"not-allowed":"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:a.cor,minWidth:30,textAlign:"center"}}>{val}%</span>
                      <button onClick={()=>updateOrc(a.id,+1)} disabled={orcTotal>=100} style={{width:22,height:22,background:orcTotal>=100?"#111":K.gr+"33",border:`1px solid ${orcTotal>=100?"#222":K.gr}`,borderRadius:4,color:orcTotal>=100?K.mu:K.gr,cursor:orcTotal>=100?"not-allowed":"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                  </div>
                  <div style={{height:4,background:K.dm,borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${val}%`,background:a.cor,borderRadius:2,transition:"width .3s"}}/>
                  </div>
                  <div style={{fontSize:9,color:K.mu,marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>base: {a.base}% · {val>a.base?"▲ acima da média":val<a.base?"▼ abaixo da média":"= na média"}</div>
                </div>
              );
            })}
            {orcTotal!==100&&(
              <div style={{background:`${K.rd}0D`,border:`1px solid ${K.rd}22`,borderRadius:8,padding:10,marginTop:8,fontSize:11,color:K.rd}}>
                ⚠️ Total: {orcTotal}%. Distribua exatamente 100% entre as áreas.
              </div>
            )}
          </div>
        </div>)}

        {/* ─── NOTÍCIAS ─── */}
        {tab==="noticias"&&(<div>
          <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:10,padding:16,marginBottom:14}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:900,marginBottom:2}}>O DIÁRIO POLÍTICO</div>
            <div style={{fontSize:9,color:K.mu,fontFamily:"'JetBrains Mono',monospace",marginBottom:14,borderBottom:`1px solid ${K.bd}`,paddingBottom:10}}>EDIÇÃO {ch.ano} · COBERTURA POLÍTICA NACIONAL</div>
            {noticias.length===0?<div style={{color:K.mu,fontSize:12,padding:20,textAlign:"center"}}>Tome decisões para gerar notícias.</div>:
              noticias.map((n,i)=>(
              <div key={i} style={{borderBottom:`1px solid ${K.dm}`,padding:"10px 0",display:"flex",gap:10,alignItems:"flex-start"}}>
                <Tag c={n.cat==="APROVAÇÃO"?K.bl:n.cat==="ORÇAMENTO"?K.go:n.cat==="INTEGRIDADE"?K.pu:n.cat==="LEGISLAÇÃO"?K.gr:K.te} ch={n.cat} sm/>
                <div style={{flex:1}}>
                  <div style={{fontSize:9,color:K.mu,marginBottom:3,fontFamily:"'JetBrains Mono',monospace"}}>{n.f}</div>
                  <div style={{fontSize:i===0?13:12,color:K.tx,lineHeight:1.5,fontWeight:i===0?700:400}}>{n.t}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:10,padding:14}}>
            <div style={{fontSize:10,color:K.mu,letterSpacing:2,marginBottom:10,fontFamily:"'JetBrains Mono',monospace"}}>📊 ESTATÍSTICAS</div>
            {[["Eleições vencidas",ch.vitEl],["Eleições perdidas",ch.derrEl],["Leis aprovadas",(ch.leisAprovadas||[]).length],["Crises resolvidas",ch.crisesResolvidas||0],["Cargos exercidos",(ch.historicoCargos||[]).length]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${K.dm}`,fontSize:11}}>
                <span style={{color:K.mu}}>{l}</span>
                <span style={{color:K.tx,fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>)}

        {/* ─── LEIS ─── */}
        {tab==="leis"&&(<div>
          <p style={{fontSize:11,color:K.mu,marginBottom:14,lineHeight:1.7}}>
            {ch.cargo==="presidente"?"Como presidente, você sanciona ou veta leis do Congresso e pode editar Medidas Provisórias.":
             ch.cargo?"Proponha leis. A aprovação depende da sua popularidade e apoio das bancadas.":
             "Sem cargo. Candidate-se para propor leis."}
          </p>
          {cargo&&ch.mandMeses>0&&lIdx<lPool.length&&(
            <button onClick={abrirLei} style={{width:"100%",padding:14,background:`linear-gradient(135deg,#281500,${K.go})`,border:"none",borderRadius:9,color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:16}}>
              📜 PROPOR PRÓXIMA LEI ({lIdx+1}/{lPool.length})
            </button>
          )}
          {(ch.leisAprovadas||[]).length>0&&(<div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:K.gr,letterSpacing:2,marginBottom:8,fontFamily:"'JetBrains Mono',monospace"}}>✅ APROVADAS ({(ch.leisAprovadas||[]).length})</div>
            {ch.leisAprovadas.map((l,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${K.dm}`,fontSize:11}}><span style={{color:K.tx}}>{l.t}</span><span style={{color:K.mu,fontFamily:"'JetBrains Mono',monospace"}}>{l.ano}</span></div>))}
          </div>)}
          {(ch.leisRejeitadas||[]).length>0&&(<div>
            <div style={{fontSize:9,color:K.rd,letterSpacing:2,marginBottom:8,fontFamily:"'JetBrains Mono',monospace"}}>❌ REJEITADAS</div>
            {ch.leisRejeitadas.map((l,i)=>(<div key={i} style={{padding:"5px 0",borderBottom:`1px solid ${K.dm}`,fontSize:11,color:K.mu}}>{l}</div>))}
          </div>)}
        </div>)}

        {/* ─── CARREIRA ─── */}
        {tab==="carreira"&&(<div>
          <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:10,padding:16,marginBottom:14}}>
            <div style={{fontSize:10,color:K.mu,letterSpacing:2,marginBottom:10,fontFamily:"'JetBrains Mono',monospace"}}>SE CANDIDATAR</div>
            <p style={{fontSize:11,color:K.mu,marginBottom:14,lineHeight:1.7}}>
              Qualquer cargo, qualquer momento. Sua chance depende do dinheiro investido na campanha, popularidade, visibilidade e histórico.
            </p>
            {Object.entries(CARGOS).map(([id,inf])=>{
              const disabled=Math.round(ch.idade)<inf.minId;
              const minDin=inf.sal*3;
              const semDin=ch.dinheiro<minDin;
              const chance=disabled?0:calcChance(ch,id,Math.min(ch.dinheiro,minDin*2));
              return(
                <div key={id} style={{background:K.s1,border:`1px solid ${disabled||semDin?K.dm:K.bd}`,borderRadius:9,padding:11,marginBottom:7,opacity:disabled?.38:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:disabled?0:7}}>
                    <div>
                      <span style={{fontSize:16,marginRight:8}}>{inf.i}</span>
                      <span style={{fontWeight:600,fontSize:12,color:disabled?K.mu:K.tx}}>{inf.n}</span>
                      {ch.cargo===id&&<span style={{marginLeft:6}}><Tag c={K.go} ch="atual" sm/></span>}
                      {disabled&&<span style={{marginLeft:6,fontSize:9,color:K.mu}}>(mín {inf.minId}a)</span>}
                    </div>
                    {!disabled&&<Tag c={chance>=60?K.gr:chance>=40?K.or:K.rd} ch={`${chance}% chance`} sm/>}
                  </div>
                  {!disabled&&(<div style={{display:"flex",gap:5,justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",gap:4}}>
                      <Tag c={K.mu} ch={`${fmt(inf.sal)}/m`} sm/>
                      <Tag c={K.mu} ch={`${inf.dur}a`} sm/>
                      <Tag c={K.mu} ch={`${inf.dur*12} crises`} sm/>
                      <Tag c={semDin?K.rd:K.mu} ch={`min ${fmt(minDin)}`} sm/>
                    </div>
                    <button onClick={()=>{setElC(id);setSc("eleicao");}} disabled={semDin}
                      style={{padding:"4px 12px",background:semDin?"transparent":`${K.bl}1A`,border:`1px solid ${semDin?K.mu+"33":K.bl}`,borderRadius:6,color:semDin?K.mu:K.bl,fontSize:9,cursor:semDin?"not-allowed":"pointer",fontFamily:"'JetBrains Mono',monospace"}}>
                      {semDin?"sem verba":"CANDIDATAR"}
                    </button>
                  </div>)}
                </div>
              );
            })}
          </div>
          {(ch.historicoCargos||[]).length>0&&(
            <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:10,padding:14}}>
              <div style={{fontSize:9,color:K.mu,letterSpacing:2,marginBottom:8,fontFamily:"'JetBrains Mono',monospace"}}>TRAJETÓRIA</div>
              {ch.historicoCargos.map((h,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${K.dm}`,fontSize:11}}><span style={{color:K.tx}}>{getC(h.cargo)?.i} {getC(h.cargo)?.n}</span><span style={{color:K.mu,fontFamily:"'JetBrains Mono',monospace"}}>{h.ano} · {getP(h.partido)?.n}</span></div>))}
            </div>
          )}
        </div>)}

        {/* ─── HISTÓRICO ─── */}
        {tab==="historico"&&(<div>
          {(ch.log||[]).length===0?<div style={{textAlign:"center",padding:40,color:K.mu,fontSize:12}}>Nenhum evento ainda.</div>:
           [...ch.log].reverse().map((e,i)=>(<div key={i} style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:8,padding:"9px 13px",marginBottom:7}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:8,color:K.mu,fontFamily:"'JetBrains Mono',monospace"}}>{e.ano}</span><span style={{fontSize:8,color:K.mu,fontFamily:"'JetBrains Mono',monospace"}}>{e.cargo||"civil"}</span></div><div style={{fontSize:11,color:K.tx,lineHeight:1.5}}>{e.txt}</div></div>))}
        </div>)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TELAS AUXILIARES
// ═══════════════════════════════════════════════════════════════
function Criacao({onStart}){
  const [nome,setNome]=useState("");const [partido,setPartido]=useState(null);
  const [pers,setPers]=useState(null);
  const ok=nome.trim().length>=2&&partido&&pers;
  return(
    <div style={{minHeight:"100vh",background:K.bg,color:K.tx,fontFamily:"'Outfit',sans-serif",padding:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <style>{F}</style>
      <div style={{maxWidth:540,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:42,marginBottom:6}}>🇧🇷</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,9vw,56px)",fontWeight:900,lineHeight:1}}>POLÍTICO</h1>
          <p style={{color:K.mu,fontSize:9,letterSpacing:4,marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>RPG DE VIDA POLÍTICA BRASILEIRA · 50 CRISES POR MANDATO</p>
        </div>
        <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:11,padding:16,marginBottom:10}}>
          <div style={{fontSize:9,color:K.mu,letterSpacing:2,marginBottom:8,fontFamily:"'JetBrains Mono',monospace"}}>① SEU NOME</div>
          <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Como o povo vai te chamar?"
            style={{width:"100%",background:"transparent",border:"none",borderBottom:`1px solid ${K.bd}`,color:K.tx,fontSize:16,padding:"5px 0",fontFamily:"'Playfair Display',serif",fontWeight:700}}/>
        </div>
        <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:11,padding:16,marginBottom:10}}>
          <div style={{fontSize:9,color:K.mu,letterSpacing:2,marginBottom:10,fontFamily:"'JetBrains Mono',monospace"}}>② PERSONALIDADE</div>
          {PERS.map(p=>(
            <button key={p.id} onClick={()=>setPers(p.id)}
              style={{width:"100%",background:pers===p.id?`${p.c}18`:K.s1,border:`1px solid ${pers===p.id?p.c:K.bd}`,borderRadius:8,padding:"10px 12px",textAlign:"left",cursor:"pointer",marginBottom:5,transition:"all .2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontWeight:700,fontSize:12,color:pers===p.id?p.c:K.tx}}>{p.i} {p.n}</span>
                <div style={{display:"flex",gap:4}}>
                  {p.bon.pop!==0&&<Tag c={p.bon.pop>0?K.gr:K.rd} ch={`${p.bon.pop>0?"+":""}${p.bon.pop} pop`} sm/>}
                  {p.bon.int!==0&&<Tag c={p.bon.int>0?K.gr:K.rd} ch={`${p.bon.int>0?"+":""}${p.bon.int} integ`} sm/>}
                  {p.bon.din!==0&&<Tag c={K.go} ch={`+${fmt(p.bon.din)}`} sm/>}
                </div>
              </div>
              <div style={{fontSize:10,color:K.mu,marginBottom:2}}>{p.pass}</div>
            </button>
          ))}
        </div>
        <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:11,padding:16,marginBottom:18}}>
          <div style={{fontSize:9,color:K.mu,letterSpacing:2,marginBottom:10,fontFamily:"'JetBrains Mono',monospace"}}>③ PARTIDO</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5}}>
            {PARTIDOS.map(p=>(
              <button key={p.id} onClick={()=>setPartido(p.id)}
                style={{padding:"7px 2px",background:partido===p.id?`${p.c}22`:K.s1,border:`1px solid ${partido===p.id?p.c:K.bd}`,borderRadius:7,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                <div style={{fontSize:14}}>{p.i}</div>
                <div style={{fontSize:10,fontWeight:700,color:partido===p.id?p.c:K.tx}}>{p.n}</div>
                <div style={{fontSize:7,color:K.mu,fontFamily:"'JetBrains Mono',monospace"}}>{p.e.split("-")[0]}</div>
              </button>
            ))}
          </div>
        </div>
        <button onClick={()=>ok&&onStart({nome:nome.trim(),partido,personalidade:pers})} disabled={!ok}
          style={{width:"100%",padding:16,background:ok?`linear-gradient(135deg,#0A1F60,${K.bl})`:"#060C18",border:"none",borderRadius:11,color:ok?"#fff":K.mu,fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,cursor:ok?"pointer":"not-allowed"}}>
          Começar como Vereador
        </button>
      </div>
    </div>
  );
}

function Eleicao({ch,cargo,onConfirm}){
  const inf=getC(cargo);const partido=getP(ch.partido);
  const minDin=inf?.sal*3||10000;
  const [gasto,setGasto]=useState(Math.min(ch.dinheiro,minDin));
  const [fase,setFase]=useState("prep");const [ganhou,setGanhou]=useState(null);
  const chance=calcChance(ch,cargo,gasto);
  const disputar=()=>{const g=Math.random()*100<chance;setGanhou(g);setFase("resultado");};
  if(fase==="resultado") return(
    <div style={{minHeight:"100vh",background:K.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",color:K.tx,padding:20}}>
      <style>{F}</style>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:68,marginBottom:10}}>{ganhou?"🎉":"😞"}</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:40,fontWeight:900,color:ganhou?K.gr:K.rd,marginBottom:8}}>{ganhou?"ELEITO!":"DERROTA"}</h2>
        <p style={{color:K.mu,fontSize:12,marginBottom:22,lineHeight:1.7}}>
          {ganhou?`Você foi eleito ${inf?.n} pelo ${partido?.n}. Mandato de ${inf?.dur} anos começa — prepare-se para ${inf?.dur*12} situações e crises.`:`Derrota nas urnas. Invista mais em campanha e popularidade.`}
        </p>
        <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:10,padding:14,marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}><span style={{color:K.mu}}>Gasto de campanha</span><span style={{color:K.rd,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(gasto)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:6}}><span style={{color:K.mu}}>Sua chance era</span><span style={{color:K.go,fontFamily:"'JetBrains Mono',monospace"}}>{chance}%</span></div>
          {ganhou&&<div style={{fontSize:10,color:K.gr,marginTop:4}}>✅ {inf?.dur*12} situações aguardam você no mandato.</div>}
          {!ganhou&&<div style={{fontSize:10,color:K.or,marginTop:4}}>💡 Aumente popularidade e dinheiro para melhorar suas chances.</div>}
        </div>
        <button onClick={()=>onConfirm(cargo,gasto,ganhou)} style={{width:"100%",padding:14,background:ganhou?`linear-gradient(135deg,#003518,${K.gr})`:`linear-gradient(135deg,#380010,${K.rd})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,cursor:"pointer"}}>
          {ganhou?"TOMAR POSSE":"CONTINUAR"}
        </button>
      </div>
    </div>
  );
  return(
    <div style={{minHeight:"100vh",background:K.bg,fontFamily:"'Outfit',sans-serif",color:K.tx,padding:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{F}</style>
      <div style={{maxWidth:500,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:22}}>
          <div style={{fontSize:34,marginBottom:6}}>{inf?.i}</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700}}>{inf?.n.toUpperCase()}</h2>
          <p style={{color:K.mu,fontSize:9,fontFamily:"'JetBrains Mono',monospace"}}>{ch.ano} · {partido?.i} {partido?.n} · {Math.round(ch.idade)} anos</p>
        </div>
        <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:11,padding:16,marginBottom:12}}>
          <Bar label="Popularidade" v={ch.popularidade} icon="👥" c={K.gr}/>
          <Bar label="Visibilidade"  v={ch.visibilidade}  icon="📺" c={K.bl}/>
          <Bar label="Integridade"   v={ch.integridade}   icon="⚖️" c={K.go}/>
        </div>
        <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:11,padding:16,marginBottom:12}}>
          <div style={{fontSize:9,color:K.mu,letterSpacing:2,marginBottom:10,fontFamily:"'JetBrains Mono',monospace"}}>INVESTIMENTO DE CAMPANHA</div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:11}}><span style={{color:K.mu}}>Saldo disponível</span><span style={{color:ch.dinheiro>minDin?K.gr:K.rd,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(ch.dinheiro)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:11}}><span style={{color:K.mu}}>Mínimo competitivo</span><span style={{color:K.mu,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(minDin)}</span></div>
          {ch.dinheiro>=500?(<>
            <input type="range" min={Math.min(ch.dinheiro,500)} max={Math.min(ch.dinheiro,minDin*5)} value={gasto} onChange={e=>setGasto(Number(e.target.value))} style={{width:"100%",marginBottom:6,accentColor:K.bl}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}><span style={{color:K.mu}}>Investindo</span><span style={{color:K.bl,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{fmt(gasto)}</span></div>
            <div style={{fontSize:9,color:K.mu,marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>Quanto mais você investe, maior sua chance de vitória.</div>
          </>):<div style={{fontSize:11,color:K.rd}}>⚠️ Sem recursos. Acumule dinheiro primeiro.</div>}
        </div>
        <div style={{background:K.s2,border:`1px solid ${K.go}22`,borderRadius:11,padding:14,marginBottom:18,textAlign:"center"}}>
          <div style={{fontSize:9,color:K.mu,marginBottom:4,fontFamily:"'JetBrains Mono',monospace"}}>SUA CHANCE REAL</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:50,fontWeight:900,color:chance>=60?K.gr:chance>=40?K.go:K.rd,lineHeight:1}}>{chance}%</div>
          <div style={{fontSize:9,color:K.mu,marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>{chance<30?"Muito difícil":chance<50?"Arriscado":chance<70?"Favorável":"Você é o favorito"}</div>
        </div>
        <button onClick={disputar} disabled={ch.dinheiro<500} style={{width:"100%",padding:14,background:ch.dinheiro>=500?`linear-gradient(135deg,#0A1F60,${K.bl})`:"#060C18",border:"none",borderRadius:11,color:ch.dinheiro>=500?"#fff":K.mu,fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,cursor:ch.dinheiro>=500?"pointer":"not-allowed"}}>
          🗳️ IR ÀS URNAS
        </button>
      </div>
    </div>
  );
}

function CriseScreen({crise,ch,partido,cargo,onEscolha}){
  const [sel,setSel]=useState(null);
  return(
    <div style={{minHeight:"100vh",background:K.bg,color:K.tx,fontFamily:"'Outfit',sans-serif",padding:18}}>
      <style>{F}</style>
      <div style={{maxWidth:620,margin:"0 auto"}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:18}}>
          <Tag c={K.rd} ch="⚡ SITUAÇÃO / CRISE"/>
          <Tag c={partido?.c||K.bl} ch={`${partido?.i} ${partido?.n}`}/>
          <Tag c={K.mu} ch={`${cargo?.n} · ${ch.ano}`}/>
          <div style={{marginLeft:"auto",display:"flex",gap:5}}>
            <Tag c={K.gr} ch={`pop.${Math.round(ch.popularidade)}%`} sm/>
            <Tag c={K.go} ch={`integ.${Math.round(ch.integridade)}%`} sm/>
          </div>
        </div>
        <div style={{fontSize:36,marginBottom:8}}>{crise.i}</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,marginBottom:10}}>{crise.t}</h2>
        <p style={{color:K.mu,fontSize:12,lineHeight:1.9,marginBottom:20,borderLeft:`3px solid ${K.bd}`,paddingLeft:14}}>{crise.s}</p>
        <div style={{fontSize:9,color:K.mu,letterSpacing:3,marginBottom:12,fontFamily:"'JetBrains Mono',monospace"}}>COMO VOCÊ RESPONDE?</div>
        {crise.ops.map((op,i)=>{
          const s=sel===i;
          return(
            <button key={i} onClick={()=>setSel(i)}
              style={{width:"100%",background:s?`${K.bl}10`:K.s2,border:`1px solid ${s?K.bl:K.bd}`,borderRadius:9,padding:14,textAlign:"left",cursor:"pointer",marginBottom:9,display:"block",transition:"all .2s"}}
              onMouseEnter={e=>{if(!s){e.currentTarget.style.borderColor=K.mu;e.currentTarget.style.transform="translateX(4px)";}}}
              onMouseLeave={e=>{if(!s){e.currentTarget.style.borderColor=K.bd;e.currentTarget.style.transform="translateX(0)";}}}
            >
              <div style={{fontWeight:600,fontSize:12,marginBottom:6,color:s?K.bl:K.tx}}>{op.t}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
                {Object.entries(op.b||{}).map(([bid,v])=>{const b=BANCADAS.find(x=>x.id===bid);return b?<Tag key={bid} c={b.c} ch={`${b.i} ${b.n} ${v>0?"+":""}${v}`} sm/>:null;})}
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {op.e.pop&&<Tag c={op.e.pop>0?K.gr:K.rd} ch={`👥${op.e.pop>0?"+":""}${op.e.pop}%`} sm/>}
                {op.e.int&&<Tag c={op.e.int>0?K.gr:K.rd} ch={`⚖️${op.e.int>0?"+":""}${op.e.int}%`} sm/>}
                {op.e.vis&&<Tag c={op.e.vis>0?K.bl:K.mu} ch={`📺${op.e.vis>0?"+":""}${op.e.vis}%`} sm/>}
                {op.e.din&&<Tag c={op.e.din>0?K.go:K.rd} ch={`💰${op.e.din>0?"+":""}${fmt(op.e.din)}`} sm/>}
              </div>
            </button>
          );
        })}
        {sel!==null&&(<div>
          <div style={{background:`${K.bl}0A`,border:`1px solid ${K.bl}1A`,borderRadius:9,padding:14,marginBottom:10}}>
            <div style={{fontSize:9,color:K.bl,marginBottom:5,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1}}>💡 CONSEQUÊNCIA PROVÁVEL</div>
            <div style={{fontSize:12,color:K.tx,lineHeight:1.6}}>{crise.ops[sel].c}</div>
          </div>
          <div style={{background:`${K.pu}0A`,border:`1px solid ${K.pu}1A`,borderRadius:9,padding:12,marginBottom:14}}>
            <div style={{fontSize:9,color:K.pu,marginBottom:4,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1}}>💭 MEMÓRIA QUE FICA</div>
            <div style={{fontSize:11,color:K.mu,fontStyle:"italic"}}>{crise.ops[sel].m}</div>
          </div>
          <button onClick={()=>onEscolha(crise.ops[sel])} style={{width:"100%",padding:14,background:`linear-gradient(135deg,#0A1F60,${K.bl})`,border:"none",borderRadius:11,color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,cursor:"pointer"}}>
            ✅ CONFIRMAR DECISÃO
          </button>
        </div>)}
      </div>
    </div>
  );
}

function LeiScreen({lei,ch,cargo,onVotar}){
  const isP=ch.cargo==="presidente";
  const base=isP?98:32+(ch.popularidade*0.32)+(ch.visibilidade*0.2);
  const chAprov=Math.round(Math.min(95,base));
  return(
    <div style={{minHeight:"100vh",background:K.bg,color:K.tx,fontFamily:"'Outfit',sans-serif",padding:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{F}</style>
      <div style={{maxWidth:500,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:42,marginBottom:6}}>📜</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:K.go,letterSpacing:3}}>{isP?"MESA DO PRESIDENTE":"PLENÁRIO"}</div>
        </div>
        <div style={{background:K.s2,border:`1px solid ${K.go}22`,borderRadius:11,padding:18,marginBottom:18}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:16,marginBottom:6}}>{lei.t}</div>
          <div style={{color:K.mu,fontSize:11,lineHeight:1.7,marginBottom:14}}>{lei.d}</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
            {lei.e.pop&&<Tag c={lei.e.pop>0?K.gr:K.rd} ch={`👥${lei.e.pop>0?"+":""}${lei.e.pop}% pop`}/>}
            {lei.e.int&&<Tag c={lei.e.int>0?K.gr:K.rd} ch={`⚖️${lei.e.int>0?"+":""}${lei.e.int}% integ`}/>}
            {lei.e.din&&<Tag c={lei.e.din>0?K.go:K.rd} ch={`💰${lei.e.din>0?"+":""}${fmt(lei.e.din)}`}/>}
          </div>
          <div style={{fontSize:9,color:K.mu,marginBottom:6,fontFamily:"'JetBrains Mono',monospace"}}>BANCADAS AFETADAS:</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
            {Object.entries(lei.b||{}).map(([bid,v])=>{const b=BANCADAS.find(x=>x.id===bid);return b?<Tag key={bid} c={b.c} ch={`${b.i} ${b.n} ${v>0?"+":""}${v}`} sm/>:null;})}
          </div>
          {!isP&&<div style={{fontSize:10,color:K.mu,fontFamily:"'JetBrains Mono',monospace"}}>Chance de aprovação: <strong style={{color:chAprov>=60?K.gr:chAprov>=40?K.or:K.rd}}>{chAprov}%</strong></div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <button onClick={()=>onVotar(true)} style={{padding:14,background:`linear-gradient(135deg,#003518,${K.gr})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,cursor:"pointer"}}>✅ {isP?"SANCIONAR":"PROPOR"}</button>
          <button onClick={()=>onVotar(false)} style={{padding:14,background:`linear-gradient(135deg,#380010,${K.rd})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,cursor:"pointer"}}>❌ {isP?"VETAR":"ARQUIVAR"}</button>
        </div>
      </div>
    </div>
  );
}

function Aposentadoria({ch,partido,onReinicio}){
  const score=ch.popularidade+ch.visibilidade+((ch.leisAprovadas||[]).length*10)+(ch.vitEl*15)+(ch.integridade*0.5)+(ch.crisesResolvidas||0)*0.5;
  const leg=score>=200?{t:"Estadista Lendário",c:K.go,d:"Seu nome será estudado nas escolas. Deixou o Brasil melhor."}:
            score>=130?{t:"Político Respeitado",c:K.gr,d:"Carreira sólida. Lembrado com carinho."}:
            score>=70 ?{t:"Servidor Mediano",c:K.bl,d:"Cumpriu o papel. Nem herói, nem vilão."}:
            {t:"Figura Polêmica",c:K.rd,d:"Controvertido até o fim."};
  return(
    <div style={{minHeight:"100vh",background:K.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",color:K.tx,padding:20}}>
      <style>{F}</style>
      <div style={{maxWidth:500,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:10}}>🧓</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:K.mu,letterSpacing:4,marginBottom:4}}>APOSENTADORIA</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:900,color:leg.c,marginBottom:8}}>{leg.t}</h2>
        <p style={{color:K.mu,fontSize:12,marginBottom:24,lineHeight:1.6}}>{leg.d}</p>
        <div style={{background:K.s2,border:`1px solid ${K.bd}`,borderRadius:11,padding:18,marginBottom:18}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,marginBottom:14}}>{ch.nome} · {partido?.n||"—"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            {[["Idade",Math.round(ch.idade)+"a"],["Mandatos",ch.vitEl],["Leis",(ch.leisAprovadas||[]).length],["Crises",ch.crisesResolvidas||0],["Patrimônio",fmt(ch.dinheiro)],["Integridade",ch.integridade+"%"]].map(([l,v])=>(
              <div key={l} style={{background:K.s1,borderRadius:8,padding:"8px 6px"}}><div style={{fontSize:8,color:K.mu,marginBottom:2,fontFamily:"'JetBrains Mono',monospace"}}>{l}</div><div style={{fontWeight:700,fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>{v}</div></div>
            ))}
          </div>
          {(ch.historicoCargos||[]).length>0&&(<div style={{borderTop:`1px solid ${K.bd}`,paddingTop:10,fontSize:10,color:K.mu,lineHeight:1.8}}>
            <strong style={{color:K.tx}}>Trajetória: </strong>
            {ch.historicoCargos.map(h=>getC(h.cargo)?.n).join(" → ")}
          </div>)}
        </div>
        <button onClick={onReinicio} style={{width:"100%",padding:14,background:`linear-gradient(135deg,#0A1F60,${K.bl})`,border:"none",borderRadius:11,color:"#fff",fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,cursor:"pointer"}}>🔄 Nova Carreira</button>
      </div>
    </div>
  );
}
