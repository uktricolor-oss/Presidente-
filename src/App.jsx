import { useState, useRef, useEffect } from "react";

// ══════════════════════════════════════════════════════════════════════
// BANCADAS
// ══════════════════════════════════════════════════════════════════════
const BANCADAS = [
  { id:"ruralista", nome:"Bancada Ruralista", sigla:"RURAL", cadeiras:120, icon:"🌾", cor:"#A16207",
    afinidade:{ economia_livre:3, ambiente:-3, social:-1, seguranca:1, reforma:-2 },
    desc:"Agronegócio, propriedade privada, anti-regulação ambiental" },
  { id:"evangelica", nome:"Frente Parlamentar Evangélica", sigla:"FPE", cadeiras:100, icon:"✝️", cor:"#7C3AED",
    afinidade:{ economia_livre:1, ambiente:0, social:-3, seguranca:2, reforma:-2 },
    desc:"Pauta conservadora de costumes e família" },
  { id:"municipalista", nome:"Bancada Municipalista", sigla:"MUNIC", cadeiras:90, icon:"🏘️", cor:"#0369A1",
    afinidade:{ economia_livre:1, ambiente:0, social:1, seguranca:1, reforma:0 },
    desc:"Prefeitos e vereadores — querem verbas e autonomia" },
  { id:"progressista", nome:"Bloco Progressista", sigla:"PROG", cadeiras:85, icon:"✊", cor:"#DC2626",
    afinidade:{ economia_livre:-3, ambiente:2, social:3, seguranca:-1, reforma:2 },
    desc:"PT, PSOL e aliados — estado forte, direitos sociais" },
  { id:"seguranca", nome:"Bancada da Bala", sigla:"BALA", cadeiras:75, icon:"🔫", cor:"#374151",
    afinidade:{ economia_livre:1, ambiente:-1, social:-1, seguranca:3, reforma:-2 },
    desc:"Policiais, militares e defensores do armamento civil" },
  { id:"empresarial", nome:"Frente Empresarial", sigla:"EMP", cadeiras:65, icon:"💼", cor:"#059669",
    afinidade:{ economia_livre:3, ambiente:-1, social:-1, seguranca:1, reforma:1 },
    desc:"Indústria, comércio, menos impostos" },
  { id:"centro", nome:"Centro Democrático", sigla:"CD", cadeiras:55, icon:"⚖️", cor:"#6B7280",
    afinidade:{ economia_livre:1, ambiente:1, social:1, seguranca:1, reforma:0 },
    desc:"Partidos de centro — negociam tudo, sem ideologia forte" },
  { id:"ambientalista", nome:"Bancada Verde", sigla:"VERDE", cadeiras:40, icon:"🌿", cor:"#16A34A",
    afinidade:{ economia_livre:-1, ambiente:3, social:2, seguranca:-1, reforma:1 },
    desc:"REDE, PV — meio ambiente e sustentabilidade" },
];
const TOTAL_CADEIRAS = 630;

// ══════════════════════════════════════════════════════════════════════
// VEÍCULOS DE MÍDIA (8, com viés real)
// ══════════════════════════════════════════════════════════════════════
const VEICULOS_MIDIA = [
  { id:"folha", nome:"Folha de S.Paulo", vies:"Centro", cor:"#6B7280", icon:"📰",
    tom:{ populista:-2, pragmatico:+3, progressista:+2, tecnico:+2 },
    alcance:85, desc:"Centro — crítica ponderada" },
  { id:"globo", nome:"O Globo", vies:"Centro-direita", cor:"#2563EB", icon:"📺",
    tom:{ populista:-3, pragmatico:+3, progressista:+1, tecnico:+3 },
    alcance:80, desc:"Centro-direita — defende estabilidade" },
  { id:"estadao", nome:"Estadão", vies:"Centro-direita", cor:"#1E40AF", icon:"📰",
    tom:{ populista:-4, pragmatico:+4, progressista:-1, tecnico:+4 },
    alcance:70, desc:"Centro-direita — voz do mercado" },
  { id:"uol", nome:"UOL", vies:"Centro", cor:"#10B981", icon:"💻",
    tom:{ populista:+1, pragmatico:+1, progressista:+3, tecnico:+2 },
    alcance:90, desc:"Centro — foco digital, progressista em pautas sociais" },
  { id:"carta_capital", nome:"Carta Capital", vies:"Esquerda", cor:"#DC2626", icon:"📖",
    tom:{ populista:+4, pragmatico:-2, progressista:+5, tecnico:-1 },
    alcance:35, desc:"Esquerda — crítica ao establishment" },
  { id:"brasil_fato", nome:"Brasil de Fato", vies:"Esquerda", cor:"#991B1B", icon:"✊",
    tom:{ populista:+5, pragmatico:-4, progressista:+5, tecnico:-3 },
    alcance:25, desc:"Esquerda — movimentos sociais e causas populares" },
  { id:"veja", nome:"Veja", vies:"Direita", cor:"#EA580C", icon:"📰",
    tom:{ populista:-3, pragmatico:+2, progressista:-4, tecnico:+1 },
    alcance:65, desc:"Direita — oposição ferrenha à esquerda" },
  { id:"jovem_pan", nome:"Jovem Pan", vies:"Direita", cor:"#F59E0B", icon:"📻",
    tom:{ populista:-5, pragmatico:+1, progressista:-5, tecnico:-2 },
    alcance:55, desc:"Direita — bolsonarismo e anti-esquerda" },
];

// ══════════════════════════════════════════════════════════════════════
// EMPRESAS PARA FINANCIAMENTO
// ══════════════════════════════════════════════════════════════════════
const EMPRESAS = [
  { id:"construtora_parana", nome:"Construtora Paranavaí", setor:"Construção", icon:"🏗️",
    oferta:{ min:200000, max:800000 }, favor:"Contrato superfaturado de obra pública",
    risco_vazamento:18, afinidade_politica:"pragmatico" },
  { id:"agro_cerrado", nome:"Agro Cerrado S.A.", setor:"Agronegócio", icon:"🌾",
    oferta:{ min:150000, max:500000 }, favor:"Veto de lei ambiental restritiva",
    risco_vazamento:15, afinidade_politica:"pragmatico" },
  { id:"banco_nacional", nome:"Banco Nacional", setor:"Financeiro", icon:"🏦",
    oferta:{ min:500000, max:2000000 }, favor:"Aprovação de fusão bilionária",
    risco_vazamento:22, afinidade_politica:"tecnico" },
  { id:"mineradora_horizonte", nome:"Mineradora Horizonte", setor:"Mineração", icon:"⛏️",
    oferta:{ min:300000, max:1200000 }, favor:"Licença ambiental em área indígena",
    risco_vazamento:25, afinidade_politica:"pragmatico" },
  { id:"farmaceutica_saude", nome:"Farmacêutica Saúde+", setor:"Farmacêutico", icon:"💊",
    oferta:{ min:100000, max:400000 }, favor:"Compra sem licitação de medicamentos",
    risco_vazamento:20, afinidade_politica:"tecnico" },
  { id:"telecom_br", nome:"Telecom BR", setor:"Telecomunicações", icon:"📡",
    oferta:{ min:250000, max:900000 }, favor:"Concessão de espectro de frequência",
    risco_vazamento:16, afinidade_politica:"tecnico" },
];

// ══════════════════════════════════════════════════════════════════════
// PARTIDOS
// ══════════════════════════════════════════════════════════════════════
const PARTIDOS = [
  { id:"pt", nome:"PT", icon:"⭐", cor:"#DC2626", ideologia:"Esquerda", tamanho:"Grande",
    fundo_eleitoral:80, tempo_tv:25, fidelidade:"Alta", desc:"Partido dos Trabalhadores" },
  { id:"pl", nome:"PL", icon:"🔵", cor:"#2563EB", ideologia:"Direita", tamanho:"Grande",
    fundo_eleitoral:75, tempo_tv:22, fidelidade:"Alta", desc:"Partido Liberal" },
  { id:"mdb", nome:"MDB", icon:"⚖️", cor:"#6B7280", ideologia:"Centro", tamanho:"Grande",
    fundo_eleitoral:70, tempo_tv:20, fidelidade:"Baixa", desc:"Movimento Democrático Brasileiro" },
  { id:"psdb", nome:"PSDB", icon:"🟦", cor:"#3B82F6", ideologia:"Centro", tamanho:"Médio",
    fundo_eleitoral:50, tempo_tv:15, fidelidade:"Média", desc:"Partido da Social Democracia Brasileira" },
  { id:"psol", nome:"PSOL", icon:"🟥", cor:"#EF4444", ideologia:"Esquerda", tamanho:"Pequeno",
    fundo_eleitoral:25, tempo_tv:8, fidelidade:"Média", desc:"Partido Socialismo e Liberdade" },
  { id:"novo", nome:"NOVO", icon:"🟧", cor:"#F97316", ideologia:"Direita", tamanho:"Pequeno",
    fundo_eleitoral:15, tempo_tv:5, fidelidade:"Baixa", desc:"Partido Novo — liberal" },
  { id:"rede", nome:"REDE", icon:"🌿", cor:"#22C55E", ideologia:"Esquerda", tamanho:"Pequeno",
    fundo_eleitoral:18, tempo_tv:6, fidelidade:"Baixa", desc:"Rede Sustentabilidade" },
];

// ══════════════════════════════════════════════════════════════════════
// CARGOS DISPONÍVEIS
// ══════════════════════════════════════════════════════════════════════
const CARGOS = [
  { id:"vereador", nome:"Vereador", nivel:"Municipal", tipo:"Legislativo", salario:15000,
    mandato_anos:4, idade_min:18, visibilidade:10, icon:"🏛️" },
  { id:"prefeito", nome:"Prefeito", nivel:"Municipal", tipo:"Executivo", salario:30000,
    mandato_anos:4, idade_min:21, visibilidade:35, icon:"🏙️" },
  { id:"dep_estadual", nome:"Deputado Estadual", nivel:"Estadual", tipo:"Legislativo", salario:25000,
    mandato_anos:4, idade_min:21, visibilidade:30, icon:"🏢" },
  { id:"governador", nome:"Governador", nivel:"Estadual", tipo:"Executivo", salario:45000,
    mandato_anos:4, idade_min:30, visibilidade:60, icon:"🏰" },
  { id:"dep_federal", nome:"Deputado Federal", nivel:"Federal", tipo:"Legislativo", salario:35000,
    mandato_anos:4, idade_min:21, visibilidade:50, icon:"🏛️" },
  { id:"senador", nome:"Senador", nivel:"Federal", tipo:"Legislativo", salario:35000,
    mandato_anos:8, idade_min:35, visibilidade:65, icon:"📜" },
  { id:"presidente", nome:"Presidente", nivel:"Federal", tipo:"Executivo", salario:50000,
    mandato_anos:4, idade_min:35, visibilidade:100, icon:"🇧🇷" },
];

// ══════════════════════════════════════════════════════════════════════
// ORÇAMENTO DETALHADO (áreas com base real)
// ══════════════════════════════════════════════════════════════════════
const AREAS_ORCAMENTO = [
  { id:"saude", nome:"Saúde", icon:"🏥", base:15, min:8, desc:"UBS, hospitais, epidemias", crises_abaixo:"Hospital sem médico, dengue fora de controle" },
  { id:"educacao", nome:"Educação", icon:"📚", base:12, min:7, desc:"Escolas, ENEM, professores", crises_abaixo:"Greve de professores, ENEM caindo" },
  { id:"seguranca", nome:"Segurança", icon:"🔫", base:10, min:6, desc:"Polícia, presídios", crises_abaixo:"Violência sobe, rebelião em presídio" },
  { id:"infraestrutura", nome:"Infraestrutura", icon:"🏗️", base:8, min:4, desc:"Estradas, saneamento", crises_abaixo:"Buracos, enchentes, apagões" },
  { id:"assistencia", nome:"Assistência Social", icon:"🤝", base:10, min:5, desc:"Bolsa Família, CRAS", crises_abaixo:"Fome, protestos dos pobres" },
  { id:"meio_ambiente", nome:"Meio Ambiente", icon:"🌳", base:4, min:2, desc:"IBAMA, conservação", crises_abaixo:"Queimadas, desmatamento" },
  { id:"cultura", nome:"Cultura", icon:"🎭", base:3, min:1, desc:"Teatros, museus", crises_abaixo:"Fechamento de teatros, protestos" },
  { id:"ciencia", nome:"Ciência & Tecnologia", icon:"🔬", base:4, min:2, desc:"CNPq, inovação", crises_abaixo:"Fuga de cérebros, atraso tecnológico" },
  { id:"administracao", nome:"Administração", icon:"📋", base:10, min:5, desc:"Eficiência geral", crises_abaixo:"Burocracia extrema, paralisia" },
  { id:"previdencia", nome:"Previdência", icon:"👴", base:24, min:18, desc:"INSS, aposentadorias — obrigatório", crises_abaixo:"Déficit explode, aposentados na rua" },
];

// ══════════════════════════════════════════════════════════════════════
// DECRETOS PRESIDENCIAIS (mantidos do original, resumidos)
// ══════════════════════════════════════════════════════════════════════
const DECRETOS = [
  { id:"d_salario_min", cat:"💵 Economia", titulo:"Reajuste do Salário Mínimo", icon:"💵",
    desc:"Reajustar o salário mínimo acima da inflação por decreto.",
    efeitos_certos:{ populacao:+10, esquerda:+8, movSociais:+10, budget:-8, inflation:+0.4 },
    surpresas:[
      { chance:40, txt:"📉 Mercado reage — dólar dispara 8%", e:{ mercado:-12, direita:-5 } },
      { chance:35, txt:"📈 Consumo aquece — PIB surpreende positivamente", e:{ gdpGrowth:+0.4, mercado:+5 } },
      { chance:25, txt:"🏭 Empresários ameaçam demissões em massa", e:{ unemployment:+0.5, direita:-8 } },
    ], custo_pol:10, tema:"social" },
  { id:"d_combustivel", cat:"💵 Economia", titulo:"Tabelamento do Combustível", icon:"⛽",
    desc:"Fixar preço da gasolina abaixo do mercado internacional.",
    efeitos_certos:{ populacao:+12, inflation:-0.5, budget:-12, mercado:-8 },
    surpresas:[
      { chance:35, txt:"⚖️ Petrobras processa o governo", e:{ midia:-5, mercado:-10 } },
      { chance:35, txt:"🚗 Desabastecimento regional", e:{ populacao:-8, midia:-8 } },
      { chance:30, txt:"🚛 Caminhoneiros evitam greve", e:{ populacao:+5, congresso:+3 } },
    ], custo_pol:15, tema:"economia_livre" },
  { id:"d_carbono", cat:"🌍 Ambiente", titulo:"Meta Carbono Zero até 2030", icon:"🌍",
    desc:"Comprometer o Brasil a zerar emissões de carbono até 2030.",
    efeitos_certos:{ internacional:+20, esquerda:+12, movSociais:+10, direita:-8, mercado:-5 },
    surpresas:[
      { chance:40, txt:"⚖️ Agronegócio processa governo", e:{ direita:-10, mercado:-8, congresso:-8 } },
      { chance:35, txt:"💰 Investimentos verdes inundam o Brasil", e:{ gdpGrowth:+0.4, reserves:+20, mercado:+8 } },
      { chance:25, txt:"😤 Oposição alega meta impossível", e:{ midia:-8, politicalCapital:-8 } },
    ], custo_pol:15, tema:"ambiente" },
  { id:"d_cotas", cat:"✊ Social", titulo:"Ampliar Cotas para 70%", icon:"🎓",
    desc:"Aumentar cotas raciais e sociais nas universidades federais para 70%.",
    efeitos_certos:{ populacao:+5, esquerda:+15, movSociais:+12, direita:-10, inequality:+8 },
    surpresas:[
      { chance:35, txt:"📣 Movimento antirracista celebra", e:{ midia:+8, internacional:+5 } },
      { chance:35, txt:"📢 Estudantes não-cotistas bloqueiam universidades", e:{ midia:-8, populacao:-5 } },
      { chance:30, txt:"⚖️ 5 ações no STF em 24 horas", e:{ politicalCapital:-10, congresso:-5 } },
    ], custo_pol:12, tema:"social" },
  { id:"d_armas_policia", cat:"🔫 Segurança", titulo:"Armamento Pesado para PMs", icon:"🔫",
    desc:"Autorizar fuzis e armamento pesado para todas as polícias estaduais.",
    efeitos_certos:{ direita:+12, security:+5, movSociais:-10, internacional:-5 },
    surpresas:[
      { chance:40, txt:"💀 Chacina — crise humanitária", e:{ populacao:-15, midia:-15, internacional:-15 } },
      { chance:35, txt:"📉 Violência cai 20%", e:{ populacao:+8, security:+5 } },
      { chance:25, txt:"🌐 ONU emite nota de repúdio", e:{ internacional:-12, midia:-5 } },
    ], custo_pol:10, tema:"seguranca" },
  { id:"d_transparencia", cat:"🏛️ Institucional", titulo:"Transparência Total do Governo", icon:"🔍",
    desc:"Publicar em tempo real todos os gastos e contratos do Executivo.",
    efeitos_certos:{ populacao:+8, midia:+10, esquerda:+5, direita:+3, politicalCapital:+5 },
    surpresas:[
      { chance:35, txt:"😬 Gastos embaraçosos revelados", e:{ midia:-10, politicalCapital:-8, congresso:-5 } },
      { chance:35, txt:"🌍 Brasil vira referência mundial", e:{ internacional:+12, midia:+5 } },
      { chance:30, txt:"😤 Ministros resistem — vazamento interno", e:{ politicalCapital:-10, midia:-5 } },
    ], custo_pol:8, tema:"reforma" },
  { id:"d_fim_sigilo", cat:"🏛️ Institucional", titulo:"Fim do Sigilo de 100 Anos", icon:"📂",
    desc:"Revogar todos os sigilos centenários.",
    efeitos_certos:{ populacao:+10, midia:+12, esquerda:+8, movSociais:+5 },
    surpresas:[
      { chance:35, txt:"💣 Documentos revelam escândalos de governos anteriores", e:{ congresso:+5, direita:-10, midia:+8 } },
      { chance:35, txt:"🎖️ Sigilo militar exposto — Exército protesta", e:{ politicalCapital:-15, midia:-5 } },
      { chance:30, txt:"🏆 Brasil recebe prêmio internacional de transparência", e:{ internacional:+10, midia:+5 } },
    ], custo_pol:12, tema:"reforma" },
];

// ══════════════════════════════════════════════════════════════════════
// CRISES (30 principais + adaptáveis por cargo)
// ══════════════════════════════════════════════════════════════════════
const SCENARIOS = [
  { id:"crise_fiscal", title:"Crise Fiscal Iminente", icon:"📉", urgency:"alta",
    description:"A dívida pública atingiu 92% do PIB. Agências de risco ameaçam rebaixar o Brasil.",
    options:[
      { label:"Corte de gastos sociais", discurso:"tecnico", description:"Reduzir programas sociais em 15%", effects:{ populacao:-12,midia:-5,direita:+18,esquerda:-20,mercado:+25,movSociais:-18,politicalCapital:-10,inflation:-0.8,debt:-5 } },
      { label:"Reforma tributária progressiva", discurso:"progressista", description:"Taxar grandes fortunas e dividendos", effects:{ populacao:+8,midia:+3,direita:-22,esquerda:+20,mercado:-18,movSociais:+15,politicalCapital:-15,inflation:+0.3,debt:-3 } },
      { label:"Privatizações estratégicas", discurso:"pragmatico", description:"Vender participações em estatais", effects:{ populacao:-5,midia:+2,direita:+12,esquerda:-15,mercado:+18,movSociais:-10,politicalCapital:-8,debt:-8,reserves:+40 } },
      { label:"Renegociar e crescer", discurso:"populista", description:"Focar em crescimento e renegociar dívida", effects:{ populacao:+3,midia:-2,direita:-8,esquerda:+8,mercado:-12,movSociais:+5,politicalCapital:-5,gdpGrowth:+0.8,debt:+3 } },
    ] },
  { id:"violencia_urbana", title:"Onda de Violência Urbana", icon:"🔫", urgency:"alta",
    description:"Criminalidade explodiu nas metrópoles. Imagens de guerra nas ruas.",
    options:[
      { label:"Operação Policial Intensa", discurso:"pragmatico", description:"Intervenção federal nas áreas críticas", effects:{ populacao:+5,midia:+8,direita:+20,esquerda:-15,movSociais:-20,congresso:+5,security:+12,politicalCapital:-12 } },
      { label:"Política de Prevenção Social", discurso:"progressista", description:"Investir em educação e emprego nas periferias", effects:{ populacao:+3,midia:-2,direita:-12,esquerda:+18,movSociais:+22,security:+5,education:+8,politicalCapital:-10,budget:-15 } },
      { label:"Legalização regulada de drogas", discurso:"progressista", description:"Enfraquecer o tráfico com regulação", effects:{ populacao:-8,midia:+5,direita:-25,esquerda:+10,movSociais:+8,congresso:-15,security:+8,politicalCapital:-20 } },
      { label:"Pacto Federativo de Segurança", discurso:"tecnico", description:"Coordenar estados com recursos federais", effects:{ populacao:+6,midia:+4,direita:+8,esquerda:+5,movSociais:+5,congresso:+10,security:+8,politicalCapital:-8,budget:-10 } },
    ] },
  { id:"sus_colapso", title:"SUS em Colapso", icon:"🏥", urgency:"alta",
    description:"Hospitais superlotados. Dengue se espalhando. Ministro pede demissão.",
    options:[
      { label:"Emergência Nacional de Saúde", discurso:"populista", description:"Mobilizar recursos federais urgentes", effects:{ populacao:+10,midia:+8,direita:+5,esquerda:+15,movSociais:+18,healthcare:+12,budget:-18,politicalCapital:-8 } },
      { label:"Mais Médicos Internacional", discurso:"pragmatico", description:"Contratar médicos estrangeiros", effects:{ populacao:+8,midia:+2,direita:-10,esquerda:+12,movSociais:+10,healthcare:+10,budget:-8,politicalCapital:-6 } },
      { label:"Privatizar hospitais deficitários", discurso:"tecnico", description:"OSS assumem gestão", effects:{ populacao:-8,midia:-3,direita:+18,esquerda:-20,movSociais:-20,healthcare:+5,budget:+5,politicalCapital:-12 } },
      { label:"Reforma estrutural do SUS", discurso:"tecnico", description:"Reestruturar financiamento e gestão", effects:{ populacao:+5,midia:+5,direita:+3,esquerda:+8,movSociais:+8,congresso:+5,healthcare:+8,budget:-12,politicalCapital:-10 } },
    ] },
  { id:"corrupcao", title:"Escândalo de Corrupção", icon:"💰", urgency:"critica",
    description:"Ministro flagrado em desvio milionário. Oposição pede CPI.",
    options:[
      { label:"Demitir e investigar", discurso:"tecnico", description:"Afastar e pedir investigação independente", effects:{ populacao:+15,midia:+18,direita:+8,esquerda:+12,movSociais:+15,congresso:+8,politicalCapital:-20 } },
      { label:"Defender o ministro", discurso:"pragmatico", description:"Alegar perseguição política", effects:{ populacao:-18,midia:-20,direita:-5,esquerda:-8,movSociais:-18,congresso:-12,politicalCapital:-25 } },
      { label:"Investigação sigilosa interna", discurso:"pragmatico", description:"Comissão interna sem alarde", effects:{ populacao:-8,midia:-10,direita:0,esquerda:-5,movSociais:-8,congresso:-5,politicalCapital:-15 } },
      { label:"Aceitar CPI e cooperar", discurso:"populista", description:"Convocar CPI e garantir transparência", effects:{ populacao:+10,midia:+12,direita:+5,esquerda:+8,movSociais:+10,congresso:+15,politicalCapital:-18 } },
    ] },
  { id:"inflacao_alimentos", title:"Inflação dos Alimentos", icon:"🛒", urgency:"alta",
    description:"Cesta básica sobe 35%. Fome volta ao debate nacional.",
    options:[
      { label:"Controle de preços temporário", discurso:"populista", description:"Tabelar alimentos essenciais por 6 meses", effects:{ populacao:+10,midia:+3,direita:-18,esquerda:+15,mercado:-25,movSociais:+18,inflation:-1.0,politicalCapital:-12 } },
      { label:"Zerar impostos da cesta básica", discurso:"tecnico", description:"Desoneração total de impostos federais", effects:{ populacao:+12,midia:+8,direita:+8,esquerda:+10,mercado:-5,budget:-15,inflation:-0.8,politicalCapital:-10 } },
      { label:"Auxílio emergencial alimentar", discurso:"progressista", description:"R$300 mensais para famílias de baixa renda", effects:{ populacao:+15,midia:+5,direita:-5,esquerda:+18,movSociais:+20,inequality:+10,budget:-20,politicalCapital:-8 } },
      { label:"Negociar com produtores", discurso:"pragmatico", description:"Acordo voluntário de moderação de preços", effects:{ populacao:0,midia:0,direita:+5,esquerda:-3,mercado:+8,inflation:-0.3,politicalCapital:-5 } },
    ] },
  { id:"pandemia", title:"Nova Pandemia Emergente", icon:"🦠", urgency:"critica",
    description:"Novo vírus detectado. 3.000 casos e crescendo 30% ao dia.",
    options:[
      { label:"Lockdown nacional imediato", discurso:"tecnico", description:"Fechar o país por 30 dias", effects:{ populacao:-8,midia:+5,direita:-15,esquerda:+10,movSociais:+8,mercado:-20,internacional:+15,healthcare:+5,gdpGrowth:-1.5,politicalCapital:-15 } },
      { label:"Protocolo de contenção regional", discurso:"pragmatico", description:"Lockdowns apenas nas áreas de foco", effects:{ populacao:+3,midia:+8,direita:+5,esquerda:+8,mercado:-5,internacional:+10,healthcare:+8,politicalCapital:-10 } },
      { label:"Vacinação acelerada", discurso:"progressista", description:"Imunizar 50% em 90 dias", effects:{ populacao:+10,midia:+12,direita:+8,esquerda:+12,movSociais:+15,internacional:+20,healthcare:+15,budget:-22,politicalCapital:-8 } },
      { label:"Manter economia aberta", discurso:"populista", description:"Confiar na imunidade natural", effects:{ populacao:-12,midia:-15,direita:+10,esquerda:-20,movSociais:-18,internacional:-20,healthcare:-10,politicalCapital:-20 } },
    ] },
  { id:"reforma_prev", title:"Pressão por Reforma da Previdência", icon:"👴", urgency:"alta",
    description:"Déficit de R$800bi projetado. FMI cobra ação.",
    options:[
      { label:"Nova reforma completa", discurso:"tecnico", description:"Aumentar idade mínima e contribuição", effects:{ populacao:-15,midia:+5,direita:+20,esquerda:-22,mercado:+22,movSociais:-20,debt:-10,politicalCapital:-20 } },
      { label:"Ajustes pontuais", discurso:"pragmatico", description:"Reformas menores sem mexer nas regras gerais", effects:{ populacao:-5,midia:0,direita:+8,esquerda:-8,mercado:+10,movSociais:-8,debt:-4,politicalCapital:-10 } },
      { label:"Tributar super-ricos", discurso:"progressista", description:"Imposto sobre heranças e dividendos", effects:{ populacao:+8,midia:+3,direita:-20,esquerda:+18,mercado:-15,movSociais:+15,politicalCapital:-15 } },
      { label:"Ignorar e resolver depois", discurso:"populista", description:"Postergar para o próximo mandato", effects:{ populacao:+2,midia:-5,direita:-5,esquerda:+5,mercado:-10,politicalCapital:+5,debt:+5 } },
    ] },
  { id:"crise_habitacao", title:"Déficit Habitacional Explosivo", icon:"🏠", urgency:"media",
    description:"8 milhões de sem-teto. MTST acampa na Esplanada.",
    options:[
      { label:"Minha Casa Minha Vida 2.0", discurso:"progressista", description:"2 milhões de unidades habitacionais", effects:{ populacao:+12,midia:+5,direita:-3,esquerda:+18,movSociais:+20,mercado:+5,inequality:+8,budget:-25,gdpGrowth:+0.5,politicalCapital:-10 } },
      { label:"Regularização fundiária", discurso:"pragmatico", description:"Titular áreas de ocupação informal", effects:{ populacao:+8,midia:+3,direita:0,esquerda:+12,movSociais:+15,inequality:+5,budget:-8,politicalCapital:-8 } },
      { label:"Incentivos para mercado privado", discurso:"tecnico", description:"Desoneração para construtoras", effects:{ populacao:+3,midia:+2,direita:+15,esquerda:-5,mercado:+18,budget:-5,gdpGrowth:+0.3,politicalCapital:-6 } },
      { label:"Reintegração de posse", discurso:"pragmatico", description:"Usar PF para desocupar áreas", effects:{ populacao:-10,midia:-5,direita:+15,esquerda:-20,movSociais:-25,politicalCapital:-15 } },
    ] },
];

// ══════════════════════════════════════════════════════════════════════
// EVENTOS ALEATÓRIOS
// ══════════════════════════════════════════════════════════════════════
const RANDOM_EVENTS = [
  { text:"🌧️ Enchentes no RS destroem infraestrutura em 40 municípios", effects:{ populacao:-5,budget:-10 }, type:"desastre" },
  { text:"📈 Brasil sobe 8 posições no ranking de negócios", effects:{ mercado:+10,internacional:+8,gdpGrowth:+0.2 }, type:"positivo" },
  { text:"💰 Investimento estrangeiro bate recorde histórico", effects:{ mercado:+12,gdpGrowth:+0.4,reserves:+15 }, type:"positivo" },
  { text:"📱 Fake news sobre 'golpe' derruba bolsa 5%", effects:{ populacao:-8,midia:-5,mercado:-8 }, type:"negativo" },
  { text:"⚽ Seleção conquista Copa do Mundo", effects:{ populacao:+20,midia:+10,internacional:+5 }, type:"positivo" },
  { text:"💻 Ataque hacker derruba sistemas do governo", effects:{ populacao:-8,midia:-5,politicalCapital:-5 }, type:"negativo" },
  { text:"🕵️ Construtora ligada ao governo investigada", effects:{ populacao:-10,midia:-12,congresso:-8 }, type:"negativo" },
  { text:"🏆 Nobel de Medicina para pesquisador brasileiro", effects:{ populacao:+5,midia:+5,internacional:+10 }, type:"positivo" },
  { text:"✊ Greve de professores paralisa 18 estados", effects:{ populacao:-5,movSociais:-8,education:-3 }, type:"negativo" },
  { text:"💊 Escândalo: vacinas desviadas", effects:{ midia:-12,populacao:-10,politicalCapital:-8 }, type:"negativo" },
];

// ══════════════════════════════════════════════════════════════════════
// ESTADO INICIAL EXPANDIDO
// ══════════════════════════════════════════════════════════════════════
const INITIAL_STATE = {
  // Identidade
  nome:"Jogador", idade:35, cargo:null, partido:null,
  // Tempo
  year:2025, month:1, term:1, maxTerms:2, monthsInOffice:0,
  // Aprovação
  approval:{ populacao:52,midia:48,direita:30,esquerda:65,movSociais:58,congresso:45,mercado:40,internacional:55 },
  // Economia
  economy:{ gdpGrowth:2.1,inflation:4.8,unemployment:7.2,debt:89,reserves:350 },
  // Indicadores sociais
  socialIndicators:{ education:62,healthcare:58,security:45,inequality:52,infrastructure:50 },
  // Recursos
  politicalCapital:80, budget:100, riquezaPessoal:50000,
  // Orçamento detalhado (para Executivo)
  orcamento:{ saude:15, educacao:12, seguranca:10, infraestrutura:8, assistencia:10, meio_ambiente:4, cultura:3, ciencia:4, administracao:10, previdencia:24 },
  // Bancadas
  bancadas:{ ruralista:30,evangelica:25,municipalista:50,progressista:80,seguranca:20,empresarial:45,centro:55,ambientalista:70 },
  // Risco
  riscoInvestigacao:0, empresasAceitas:[], favoresPendentes:[],
  // Saúde política
  saudePolitica:100, estresse:0,
  // Histórico
  legislation:[], decretos_usados:[], reformas_usadas:[],
  // Game state
  gameOver:false, reelected:false, impeached:false, aposentado:false,
  // Legado
  legado:{ crisesResolvidas:0, leisAprovadas:0, escandalos:0, pessoasAjudadas:0 },
};

// ══════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════
const clamp = v => Math.max(0, Math.min(100, Math.round(v)));
const clampEco = (v, min, max) => Math.max(min, Math.min(max, v));

const applyEffects = (s, fx) => {
  const ns = JSON.parse(JSON.stringify(s));
  const appr = ["populacao","midia","direita","esquerda","movSociais","congresso","mercado","internacional"];
  const eco = ["gdpGrowth","inflation","unemployment","debt","reserves"];
  const soc = ["education","healthcare","security","inequality","infrastructure"];
  for (const [k,v] of Object.entries(fx)) {
    if (appr.includes(k)) ns.approval[k] = clamp(ns.approval[k]+v);
    else if (eco.includes(k)) {
      if (k==="reserves") ns.economy.reserves = Math.max(0, ns.economy.reserves+v);
      else if (k==="debt") ns.economy.debt = Math.max(0, ns.economy.debt+v);
      else ns.economy[k] = Math.round((ns.economy[k]+v)*10)/10;
    } else if (soc.includes(k)) ns.socialIndicators[k] = clamp(ns.socialIndicators[k]+v);
    else if (k==="politicalCapital") ns.politicalCapital = Math.max(0, Math.min(100, ns.politicalCapital+v));
    else if (k==="budget") ns.budget = Math.max(0, ns.budget+v);
    else if (k==="riquezaPessoal") ns.riquezaPessoal = Math.max(0, ns.riquezaPessoal+v);
    else if (k==="riscoInvestigacao") ns.riscoInvestigacao = clamp(ns.riscoInvestigacao+v);
    else if (k==="saudePolitica") ns.saudePolitica = clamp(ns.saudePolitica+v);
    else if (k==="estresse") ns.estresse = clamp(ns.estresse+v);
  }
  return ns;
};

const getOverall = s => {
  const vs = Object.values(s.approval);
  return Math.round(vs.reduce((a,b)=>a+b,0)/vs.length);
};

// Gera manchete da mídia baseada no viés do veículo e no discurso usado
const gerarManchete = (veiculo, decisao, discurso) => {
  const tom = veiculo.tom[discurso] || 0;
  const aprov = tom >= 2 ? "elogia" : tom <= -2 ? "critica duramente" : "comenta com ressalvas";
  const exemplos = {
    populista: ["promessa audaciosa", "demagogia perigosa", "medida popular mas arriscada"],
    pragmatico: ["negociação nos bastidores", "acordão do centrão", "jogo político calculado"],
    progressista: ["avanço histórico", "pauta identitária", "justiça social em ação"],
    tecnico: ["decisão técnica responsável", "frieza tecnocrática", "gestão eficiente"],
  };
  const descricao = exemplos[discurso]?.[Math.floor(Math.random()*3)] || "decisão";
  return `${veiculo.icon} **${veiculo.nome}**: ${aprov} a ${descricao} — "${decisao}".`;
};

// Cálculo de votos no Congresso
const calcVotes = (bancadas_approval, apoio_base, politicalCapital, overall) => {
  let sim = 0, nao = 0;
  const breakdown = {};
  BANCADAS.forEach(b => {
    const base = apoio_base[b.id] || 30;
    const rel = (bancadas_approval[b.id] || 50) - 50;
    const capBonus = (politicalCapital - 50) * 0.2;
    const popBonus = (overall - 50) * 0.1;
    const rng = (Math.random() - 0.5) * 25;
    const prob = Math.max(5, Math.min(95, base + rel * 0.3 + capBonus + popBonus + rng));
    const votosSim = Math.round(b.cadeiras * (prob / 100));
    const votosNao = b.cadeiras - votosSim;
    sim += votosSim; nao += votosNao;
    breakdown[b.id] = { sim: votosSim, nao: votosNao, prob: Math.round(prob) };
  });
  return { sim, nao, total: TOTAL_CADEIRAS, aprovado: sim > TOTAL_CADEIRAS / 2, breakdown };
};

// ══════════════════════════════════════════════════════════════════════
// COLORS
// ══════════════════════════════════════════════════════════════════════
const C = {
  bg:"#040811", surface:"#080E1C", border:"#101828",
  text:"#E2E8F4", muted:"#4A5568", dim:"#1A2238",
  green:"#00D68F", red:"#FF3D57", yellow:"#FFB700",
  blue:"#4080FF", accent:"#C8952A", purple:"#8B5CF6",
};

// ══════════════════════════════════════════════════════════════════════
// UI COMPONENTS
// ══════════════════════════════════════════════════════════════════════
const Bar = ({ label, value, icon, color="#4080FF" }) => {
  const v = Math.max(0, Math.min(100, value||0));
  const col = v>=50 ? color : v>=35 ? C.yellow : C.red;
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:11, color:C.muted, fontFamily:"'IBM Plex Mono',monospace" }}>{icon} {label}</span>
        <span style={{ fontSize:12, fontWeight:700, color:col, fontFamily:"'IBM Plex Mono',monospace" }}>{v}%</span>
      </div>
      <div style={{ height:4, background:C.dim, borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${v}%`, background:col, borderRadius:2, transition:"width 0.6s ease" }}/>
      </div>
    </div>
  );
};

const Tag = ({ children, color=C.muted }) => (
  <span style={{ fontSize:10, padding:"2px 8px", borderRadius:10, background:color+"22", color, border:`1px solid ${color}44`, fontFamily:"'IBM Plex Mono',monospace" }}>{children}</span>
);

const Notif = ({ n }) => n ? (
  <div style={{ position:"fixed", top:16, left:"50%", transform:"translateX(-50%)", zIndex:1000, background:C.surface,
    border:`1px solid ${n.type==="danger"?C.red:n.type==="success"?C.green:n.type==="warn"?C.yellow:C.blue}`,
    borderRadius:8, padding:"10px 20px", fontSize:11, color:C.text, maxWidth:"90vw", textAlign:"center",
    boxShadow:"0 4px 30px #00000090" }}>
    {n.msg}
  </div>
) : null;

// ══════════════════════════════════════════════════════════════════════
// TELA DE CRISE (com estilos de discurso)
// ══════════════════════════════════════════════════════════════════════
const ScenarioScreen = ({ scenario, state, onChoice, onBack }) => {
  const discursosEmoji = { populista:"🗣️", pragmatico:"🤝", progressista:"✊", tecnico:"📊" };
  const urgCol = { critica:C.red, alta:C.yellow, media:C.blue, baixa:C.muted };
  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'IBM Plex Mono',monospace", color:C.text, padding:20 }}>
      <div style={{ maxWidth:660, margin:"0 auto" }}>
        <div style={{ display:"flex", gap:8, marginBottom:20, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ background:urgCol[scenario.urgency]+"22", color:urgCol[scenario.urgency], fontSize:10, padding:"3px 10px", borderRadius:20, border:`1px solid ${urgCol[scenario.urgency]}44` }}>
            {scenario.urgency?.toUpperCase()}
          </span>
          <span style={{ color:C.muted, fontSize:10 }}>Cap.Pol: {state.politicalCapital}pts</span>
          <span style={{ color:C.muted, fontSize:10 }}>Estresse: {state.estresse}%</span>
        </div>
        <div style={{ fontSize:52, marginBottom:10 }}>{scenario.icon}</div>
        <h2 style={{ fontFamily:"'Bebas Neue'", fontSize:34, color:C.text, letterSpacing:2, margin:"0 0 12px" }}>{scenario.title}</h2>
        <p style={{ color:C.muted, fontSize:13, lineHeight:1.8, marginBottom:24, borderLeft:`3px solid ${C.dim}`, paddingLeft:16 }}>{scenario.description}</p>
        <div style={{ fontSize:10, color:C.muted, marginBottom:12, letterSpacing:3 }}>ESCOLHA SEU DISCURSO E DECISÃO:</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {scenario.options.map((opt,i)=>(
            <button key={i} onClick={()=>onChoice(opt)}
              style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:16, textAlign:"left", cursor:"pointer", transition:"border-color 0.2s, transform 0.15s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.transform="translateX(5px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateX(0)";}}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ fontSize:18 }}>{discursosEmoji[opt.discurso]}</span>
                <Tag color={opt.discurso==="populista"?C.red:opt.discurso==="progressista"?C.purple:opt.discurso==="pragmatico"?C.yellow:C.blue}>
                  {opt.discurso?.toUpperCase()}
                </Tag>
                <span style={{ fontWeight:700, color:C.text, fontSize:13 }}>{opt.label}</span>
              </div>
              <div style={{ color:C.muted, fontSize:11, lineHeight:1.6, marginBottom:8, marginLeft:26 }}>{opt.description}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginLeft:26 }}>
                {Object.entries(opt.effects).filter(([,v])=>typeof v==="number").slice(0,6).map(([k,v])=>(
                  <Tag key={k} color={v>0?C.green:C.red}>{v>0?"+":""}{v} {k}</Tag>
                ))}
                <Tag color={C.muted}>+ imprevistos</Tag>
              </div>
            </button>
          ))}
        </div>
        <button onClick={onBack} style={{ marginTop:16, width:"100%", padding:10, background:"transparent", border:`1px solid ${C.dim}`, borderRadius:8, color:C.muted, fontSize:11, cursor:"pointer" }}>← Voltar</button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════
// TELA DE ORÇAMENTO DETALHADO (Executivo)
// ══════════════════════════════════════════════════════════════════════
const OrcamentoScreen = ({ state, onBack, onStateChange, showNotif }) => {
  const [orc, setOrc] = useState({...state.orcamento});
  const totalAtual = Object.values(orc).reduce((a,b)=>a+b,0);

  const aplicar = () => {
    if (Math.abs(totalAtual-100)>0.5) { showNotif("❌ A soma precisa ser exatamente 100%!","danger"); return; }
    const ns = {...state, orcamento:orc};
    // Verificar áreas abaixo do mínimo
    AREAS_ORCAMENTO.forEach(a=>{
      if (orc[a.id] < a.min) {
        showNotif(`⚠️ ${a.nome} abaixo do mínimo! ${a.crises_abaixo} — crise iminente.`,"warn");
      }
    });
    onStateChange(ns);
    showNotif("✅ Orçamento atualizado. Consequências virão nas próximas crises.","success");
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'IBM Plex Mono',monospace", color:C.text }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, letterSpacing:2 }}>💰 ORÇAMENTO DETALHADO</div>
          <div style={{ fontSize:10, color:C.muted }}>Aloque % entre as áreas — baseado no orçamento real brasileiro</div>
        </div>
        <button onClick={onBack} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6, color:C.muted, fontSize:11, padding:"6px 12px", cursor:"pointer" }}>← VOLTAR</button>
      </div>
      <div style={{ maxWidth:660, margin:"0 auto", padding:20 }}>
        <div style={{ background:"rgba(255,183,0,0.06)", border:`1px solid ${C.yellow}22`, borderRadius:10, padding:14, marginBottom:16 }}>
          <div style={{ fontSize:11, color:C.muted, lineHeight:1.7 }}>
            ⚠️ Cortar áreas abaixo do <strong style={{color:C.yellow}}>mínimo</strong> causará crises específicas nos próximos meses. Previdência é quase obrigatória — cortes profundos exigem reforma.
          </div>
        </div>
        <div style={{ textAlign:"right", marginBottom:20, fontFamily:"'Playfair Display',serif", fontSize:28, color:Math.abs(totalAtual-100)<1?C.green:C.red }}>
          Total: {totalAtual}% {Math.abs(totalAtual-100)<1?"✅":"❌"}
        </div>
        {AREAS_ORCAMENTO.map(a=>{
          const val = orc[a.id]||0;
          const abaixo = val < a.min;
          return (
            <div key={a.id} style={{ background:C.surface, border:`1px solid ${abaixo?C.red+"44":C.border}`, borderRadius:10, padding:14, marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div>
                  <span style={{ fontSize:20, marginRight:8 }}>{a.icon}</span>
                  <span style={{ fontWeight:700, fontSize:13, color:C.text }}>{a.nome}</span>
                  <span style={{ fontSize:10, color:C.muted, marginLeft:8 }}>(Base: {a.base}% | Mín: {a.min}%)</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <button onClick={()=>setOrc(p=>({...p,[a.id]:Math.max(0,val-1)}))}
                    style={{ width:28,height:28,background:C.dim,border:"none",borderRadius:6,color:C.text,cursor:"pointer",fontSize:16 }}>−</button>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:abaixo?C.red:C.text, minWidth:40, textAlign:"center" }}>{val}%</span>
                  <button onClick={()=>setOrc(p=>({...p,[a.id]:Math.min(30,val+1)}))}
                    style={{ width:28,height:28,background:C.dim,border:"none",borderRadius:6,color:C.text,cursor:"pointer",fontSize:16 }}>+</button>
                </div>
              </div>
              <div style={{ height:6, background:C.dim, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${val}%`, background:abaixo?C.red:a.base>=15?C.blue:C.green, borderRadius:3, transition:"width 0.4s" }}/>
              </div>
              <div style={{ marginTop:6, fontSize:9, color:abaixo?C.red:C.muted }}>{a.desc}</div>
              {abaixo && <div style={{ marginTop:4, fontSize:9, color:C.red, fontStyle:"italic" }}>⚠️ {a.crises_abaixo}</div>}
            </div>
          );
        })}
        <button onClick={aplicar}
          style={{ width:"100%", padding:14, background:Math.abs(totalAtual-100)<1?C.green+"22":C.dim, border:`1px solid ${Math.abs(totalAtual-100)<1?C.green:C.border}`, borderRadius:10, color:Math.abs(totalAtual-100)<1?C.green:C.muted, fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:2, cursor:"pointer" }}>
          ✅ APLICAR ORÇAMENTO
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════
// TELA DE FINANCIAMENTO EMPRESARIAL
// ══════════════════════════════════════════════════════════════════════
const FinanciamentoScreen = ({ state, onBack, onStateChange, showNotif }) => {
  const [aba, setAba] = useState("ofertas"); // ofertas | pendentes | historico

  const aceitarOferta = (empresa) => {
    if (state.empresasAceitas.includes(empresa.id)) { showNotif("Já aceitou desta empresa.","warn"); return; }
    const valor = Math.floor(empresa.oferta.min + Math.random()*(empresa.oferta.max-empresa.oferta.min));
    const ns = applyEffects(state, { riquezaPessoal:valor, riscoInvestigacao:5 });
    ns.empresasAceitas = [...ns.empresasAceitas, empresa.id];
    // Favor chega em 1-3 crises
    const prazo = 1 + Math.floor(Math.random()*3);
    ns.favoresPendentes = [...ns.favoresPendentes, { empresa:empresa.id, favor:empresa.favor, prazo, valor }];
    onStateChange(ns);
    showNotif(`💰 Aceitou R$${(valor/1000).toFixed(0)}k de ${empresa.nome}. Risco +5%. Favor em ${prazo} crises.`,"warn");
  };

  const recusarFavor = (idx) => {
    const ns = {...state};
    const favor = ns.favoresPendentes[idx];
    ns.favoresPendentes = ns.favoresPendentes.filter((_,i)=>i!==idx);
    // Risco de chantagem
    if (Math.random()<0.3) {
      ns.riscoInvestigacao = clamp(ns.riscoInvestigacao+10);
      showNotif(`⚠️ ${favor.empresa} ameaça expor! Risco +10%.`,"danger");
    } else {
      showNotif(`✓ Favor recusado. Relação azedou mas sem vazamento.`,"info");
    }
    onStateChange(ns);
  };

  const cumprirFavor = (idx) => {
    const ns = {...state};
    const favor = ns.favoresPendentes[idx];
    ns.favoresPendentes = ns.favoresPendentes.filter((_,i)=>i!==idx);
    ns.riscoInvestigacao = clamp(ns.riscoInvestigacao+15);
    // Teste de vazamento
    const emp = EMPRESAS.find(e=>e.id===favor.empresa);
    if (emp && Math.random()*100 < emp.risco_vazamento) {
      ns.riscoInvestigacao = clamp(ns.riscoInvestigacao+20);
      showNotif(`🚨 VAZAMENTO! ${favor.favor} — investigação acelerada!`,"danger");
    } else {
      showNotif(`🔒 Favor cumprido. Risco +15%. Até agora, silêncio.`,"warn");
    }
    onStateChange(ns);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'IBM Plex Mono',monospace", color:C.text }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, letterSpacing:2 }}>💼 FINANCIADORES</div>
          <div style={{ fontSize:10, color:C.muted }}>Sistema de risco — favores podem gerar investigação</div>
        </div>
        <button onClick={onBack} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6, color:C.muted, fontSize:11, padding:"6px 12px", cursor:"pointer" }}>← VOLTAR</button>
      </div>

      <div style={{ display:"flex", background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 16px" }}>
        {[["ofertas","🏢 Ofertas"],["pendentes","⏳ Pendentes"],["historico","📋 Histórico"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setAba(id)}
            style={{ padding:"10px 14px", background:"none", border:"none", borderBottom:`2px solid ${aba===id?C.blue:"transparent"}`, color:aba===id?C.blue:C.muted, fontSize:10, cursor:"pointer" }}>
            {lbl}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:660, margin:"0 auto", padding:20 }}>
        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
          <Tag color={C.red}>🚨 Risco de Investigação: {state.riscoInvestigacao}%</Tag>
          <Tag color={C.green}>💰 Riqueza: R${(state.riquezaPessoal/1000).toFixed(0)}k</Tag>
          <Tag color={C.yellow}>⏳ {state.favoresPendentes.length} favores pendentes</Tag>
        </div>

        {aba==="ofertas" && (
          <div>
            <div style={{ background:"rgba(255,61,87,0.06)", border:`1px solid ${C.red}22`, borderRadius:8, padding:12, marginBottom:16 }}>
              <div style={{ fontSize:11, color:C.muted, lineHeight:1.7 }}>
                ⚠️ Cada empresa aceita +5% de risco permanente. Favores cumpridos +15%. Se risco passar de <strong style={{color:C.red}}>70%</strong>, PF pode bater.
              </div>
            </div>
            {EMPRESAS.map(emp=>{
              const aceita = state.empresasAceitas.includes(emp.id);
              return (
                <div key={emp.id} style={{ background:C.surface, border:`1px solid ${aceita?C.dim:C.border}`, borderRadius:10, padding:14, marginBottom:10, opacity:aceita?0.5:1 }}>
                  <div style={{ display:"flex", gap:10, marginBottom:6 }}>
                    <span style={{ fontSize:28 }}>{emp.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:12, color:C.text }}>{emp.nome}</div>
                      <div style={{ fontSize:10, color:C.muted }}>{emp.setor} · Oferta: R${(emp.oferta.min/1000).toFixed(0)}k–R${(emp.oferta.max/1000).toFixed(0)}k</div>
                      <div style={{ fontSize:10, color:C.yellow, marginTop:4 }}>Favor futuro: {emp.favor}</div>
                      <div style={{ fontSize:9, color:C.red }}>Risco de vazamento: {emp.risco_vazamento}%</div>
                    </div>
                  </div>
                  {aceita ? (
                    <div style={{ fontSize:10, color:C.muted }}>✓ Já aceito</div>
                  ) : (
                    <button onClick={()=>aceitarOferta(emp)}
                      style={{ width:"100%", padding:8, background:C.accent+"22", border:`1px solid ${C.accent}`, borderRadius:6, color:C.accent, fontSize:10, cursor:"pointer" }}>
                      💰 ACEITAR DOAÇÃO
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {aba==="pendentes" && (
          <div>
            {state.favoresPendentes.length===0 ? (
              <div style={{ color:C.muted, fontSize:12, textAlign:"center", padding:40 }}>Nenhum favor pendente no momento.</div>
            ) : (
              state.favoresPendentes.map((f,i)=>(
                <div key={i} style={{ background:C.surface, border:`1px solid ${C.yellow}44`, borderRadius:10, padding:14, marginBottom:10 }}>
                  <div style={{ fontWeight:700, fontSize:12, color:C.text, marginBottom:4 }}>
                    {EMPRESAS.find(e=>e.id===f.empresa)?.icon} {f.empresa}
                  </div>
                  <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Favor: {f.favor}</div>
                  <div style={{ fontSize:10, color:C.yellow, marginBottom:8 }}>Prazo: {f.prazo} crise(s)</div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>cumprirFavor(i)}
                      style={{ flex:1, padding:8, background:C.red+"22", border:`1px solid ${C.red}44`, borderRadius:6, color:C.red, fontSize:10, cursor:"pointer" }}>
                      ✅ Cumprir (+15% risco)
                    </button>
                    <button onClick={()=>recusarFavor(i)}
                      style={{ flex:1, padding:8, background:C.dim, border:`1px solid ${C.border}`, borderRadius:6, color:C.muted, fontSize:10, cursor:"pointer" }}>
                      ❌ Recusar (30% chantagem)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {aba==="historico" && (
          <div style={{ color:C.muted, fontSize:11, lineHeight:1.8 }}>
            <p>Empresas que já contribuíram: {state.empresasAceitas.length===0 ? "Nenhuma." : state.empresasAceitas.map(id=>EMPRESAS.find(e=>e.id===id)?.nome).join(", ")}</p>
            <p>Risco total acumulado: <strong style={{color:state.riscoInvestigacao>=70?C.red:state.riscoInvestigacao>=40?C.yellow:C.green}}>{state.riscoInvestigacao}%</strong></p>
            {state.riscoInvestigacao>=70 && <p style={{color:C.red}}>🚨 ALERTA: Polícia Federal pode iniciar operação a qualquer momento!</p>}
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════
// TELA DE MÍDIA (8 veículos)
// ══════════════════════════════════════════════════════════════════════
const MidiaScreen = ({ state, onBack, ultimasManchetes }) => {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'IBM Plex Mono',monospace", color:C.text }}>
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, letterSpacing:2 }}>📺 IMPRENSA NACIONAL</div>
          <div style={{ fontSize:10, color:C.muted }}>8 veículos — cada um com seu viés</div>
        </div>
        <button onClick={onBack} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6, color:C.muted, fontSize:11, padding:"6px 12px", cursor:"pointer" }}>← VOLTAR</button>
      </div>
      <div style={{ maxWidth:660, margin:"0 auto", padding:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {VEICULOS_MIDIA.map(v=>(
            <div key={v.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <span style={{ fontSize:16 }}>{v.icon}</span>
                <span style={{ fontWeight:700, fontSize:11, color:C.text }}>{v.nome}</span>
              </div>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                <Tag color={v.cor}>{v.vies}</Tag>
                <Tag color={C.muted}>Alcance: {v.alcance}%</Tag>
              </div>
              <div style={{ fontSize:9, color:C.muted, marginTop:6, lineHeight:1.5 }}>{v.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:14 }}>
          <div style={{ fontSize:12, color:C.accent, marginBottom:10, letterSpacing:2 }}>📰 ÚLTIMAS MANCHETES</div>
          {(ultimasManchetes||[]).length===0 ? (
            <div style={{ color:C.muted, fontSize:11 }}>Nenhuma manchete recente. Tome decisões para ver a reação da mídia.</div>
          ) : (
            ultimasManchetes.slice(-6).reverse().map((m,i)=>(
              <div key={i} style={{ padding:"8px 0", borderBottom:`1px solid ${C.dim}`, fontSize:11, color:C.text, lineHeight:1.6 }}>
                <span style={{ color:C.muted, fontSize:9 }}>{m.data} · </span>
                {m.texto}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════
// TELA DE SELEÇÃO DE CARGO / CAMPANHA
// ══════════════════════════════════════════════════════════════════════
const CampanhaScreen = ({ state, onStart, onBack }) => {
  const [cargoSel, setCargoSel] = useState(null);
  const [partidoSel, setPartidoSel] = useState(null);
  const [nome, setNome] = useState(state.nome||"Jogador");
  const [idade, setIdade] = useState(state.idade||35);
  const [estilo, setEstilo] = useState("pragmatico"); // Estilo de discurso padrão

  const podeIniciar = cargoSel && partidoSel && nome.trim() && idade >= (cargoSel?.idade_min||18);

  const iniciar = () => {
    const ns = {...state, nome, idade, cargo:cargoSel, partido:partidoSel, estilo_discurso:estilo, year:2025, month:1, term:1};
    onStart(ns);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'IBM Plex Mono',monospace", color:C.text, padding:20 }}>
      <div style={{ maxWidth:600, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:30 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🇧🇷</div>
          <h2 style={{ fontFamily:"'Bebas Neue'", fontSize:36, letterSpacing:4, margin:"0 0 8px" }}>NOVA CAMPANHA</h2>
          <p style={{ color:C.muted, fontSize:11 }}>Escolha seu caminho político</p>
        </div>

        {/* Nome e Idade */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:12 }}>
          <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>IDENTIDADE</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <input value={nome} onChange={e=>setNome(e.target.value)}
              style={{ flex:1, background:C.dim, border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 12px", color:C.text, fontSize:13, minWidth:140 }}
              placeholder="Seu nome" />
            <input type="number" value={idade} onChange={e=>setIdade(parseInt(e.target.value)||18)}
              style={{ width:70, background:C.dim, border:`1px solid ${C.border}`, borderRadius:6, padding:"8px", color:C.text, fontSize:13, textAlign:"center" }}
              min={18} max={90} />
            <span style={{ color:C.muted, fontSize:10, alignSelf:"center" }}>anos</span>
          </div>
        </div>

        {/* Cargo */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:12 }}>
          <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>CARGO</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {CARGOS.map(c=>{
              const bloqueado = idade < c.idade_min;
              return (
                <button key={c.id} onClick={()=>!bloqueado&&setCargoSel(c)}
                  style={{ padding:10, background:cargoSel?.id===c.id?C.blue+"22":C.dim, border:`1px solid ${cargoSel?.id===c.id?C.blue:bloqueado?C.dim:C.border}`, borderRadius:8, color:bloqueado?C.muted:C.text, fontSize:10, cursor:bloqueado?"not-allowed":"pointer", textAlign:"left", opacity:bloqueado?0.4:1 }}>
                  <div style={{ fontSize:16 }}>{c.icon}</div>
                  <div style={{ fontWeight:700, fontSize:11 }}>{c.nome}</div>
                  <div style={{ fontSize:9, color:C.muted }}>{c.tipo} · {c.nivel}</div>
                  <div style={{ fontSize:9, color:C.muted }}>Salário: R${(c.salario/1000).toFixed(0)}k/mês</div>
                  {bloqueado && <div style={{ fontSize:8, color:C.red }}>Idade mínima: {c.idade_min}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Partido */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:12 }}>
          <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>PARTIDO</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {PARTIDOS.map(p=>(
              <button key={p.id} onClick={()=>setPartidoSel(p)}
                style={{ padding:10, background:partidoSel?.id===p.id?p.cor+"22":C.dim, border:`1px solid ${partidoSel?.id===p.id?p.cor:C.border}`, borderRadius:8, color:C.text, fontSize:10, cursor:"pointer", textAlign:"left" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:14 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:11 }}>{p.nome}</div>
                    <div style={{ fontSize:9, color:C.muted }}>{p.ideologia} · {p.tamanho}</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:4, marginTop:4, flexWrap:"wrap" }}>
                  <Tag color={C.yellow}>TV: {p.tempo_tv}s</Tag>
                  <Tag color={C.green}>Fundo: R${p.fundo_eleitoral}M</Tag>
                  <Tag color={p.fidelidade==="Alta"?C.red:p.fidelidade==="Média"?C.yellow:C.green}>Fidelidade: {p.fidelidade}</Tag>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Estilo de discurso */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:14, marginBottom:12 }}>
          <div style={{ fontSize:11, color:C.muted, marginBottom:8 }}>ESTILO DE DISCURSO PADRÃO</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {[
              { id:"populista", icon:"🗣️", label:"Populista", desc:"Promessas heróicas, ganho rápido de massa", cor:C.red },
              { id:"pragmatico", icon:"🤝", label:"Pragmático", desc:"Acordos, cargos, manter o poder", cor:C.yellow },
              { id:"progressista", icon:"✊", label:"Progressista", desc:"Causas sociais e futuro sustentável", cor:C.purple },
              { id:"tecnico", icon:"📊", label:"Técnico", desc:"Números e gestão eficiente", cor:C.blue },
            ].map(e=>(
              <button key={e.id} onClick={()=>setEstilo(e.id)}
                style={{ padding:10, background:estilo===e.id?e.cor+"22":C.dim, border:`1px solid ${estilo===e.id?e.cor:C.border}`, borderRadius:8, color:C.text, fontSize:10, cursor:"pointer", textAlign:"left" }}>
                <div style={{ fontSize:16 }}>{e.icon}</div>
                <div style={{ fontWeight:700, fontSize:11, color:e.cor }}>{e.label}</div>
                <div style={{ fontSize:9, color:C.muted }}>{e.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onBack} style={{ flex:1, padding:14, background:C.dim, border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:2, cursor:"pointer" }}>
            ← VOLTAR
          </button>
          <button onClick={iniciar} disabled={!podeIniciar}
            style={{ flex:2, padding:14, background:podeIniciar?`linear-gradient(135deg,#1A3580,${C.blue})`:C.dim, border:"none", borderRadius:10, color:podeIniciar?"#fff":C.muted, fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:3, cursor:podeIniciar?"pointer":"not-allowed" }}>
            INICIAR CAMPANHA 🗳️
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════
// MAIN GAME
// ══════════════════════════════════════════════════════════════════════
export default function PoliticoRPG() {
  const [state, setState] = useState({...INITIAL_STATE});
  const [phase, setPhase] = useState("menu"); // menu | campanha | game | scenario | congresso | decretos | orcamento | financiamento | midia | results
  const [currentScenario, setCurrentScenario] = useState(null);
  const [notif, setNotif] = useState(null);
  const [ultimasManchetes, setUltimasManchetes] = useState([]);
  const [aiText, setAiText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [usedScenarios, setUsedScenarios] = useState([]);
  const [activeTab, setActiveTab] = useState("painel");
  const ntRef = useRef(null);

  useEffect(() => {
    document.title = "🇧🇷 Político RPG — O Candidato";
  }, []);

  const showNotif = (msg, type="info") => {
    setNotif({msg,type});
    if (ntRef.current) clearTimeout(ntRef.current);
    ntRef.current = setTimeout(()=>setNotif(null), 5000);
  };

  const overall = getOverall(state);

  // Gerar manchetes da mídia
  const gerarManchetes = (decisao, discurso) => {
    const manchetes = VEICULOS_MIDIA.map(v=>{
      const tom = v.tom[discurso] || 0;
      const variacao = Math.floor(Math.random()*5)-2;
      const tomFinal = Math.max(-5, Math.min(5, tom+variacao));
      let texto;
      if (tomFinal>=3) texto=`${v.icon} **${v.nome}** elogia: "${decisao} foi uma decisão histórica e corajosa."`;
      else if (tomFinal>=1) texto=`${v.icon} **${v.nome}** aprova com ressalvas: "${decisao} — acertou, mas precisa de ajustes."`;
      else if (tomFinal>=-1) texto=`${v.icon} **${v.nome}** relata de forma neutra: "${decisao} divide opiniões no Congresso."`;
      else if (tomFinal>=-3) texto=`${v.icon} **${v.nome}** critica: "${decisao} foi precipitada e trará consequências."`;
      else texto=`${v.icon} **${v.nome}** ataca duramente: "${decisao} é um desastre para o país."`;
      return { veiculo:v.id, texto, tom:tomFinal, data:`${state.month}/${state.year}` };
    });
    setUltimasManchetes(p=>[...p.slice(-30), ...manchetes]);
  };

  const doAdvanceMonth = (s) => {
    const ns = JSON.parse(JSON.stringify(s));
    ns.month+=1; ns.monthsInOffice+=1;
    if(ns.month>12){ns.month=1;ns.year+=1;ns.idade+=1;}
    // Economia flutua
    ns.economy.inflation = clampEco(ns.economy.inflation+(Math.random()*0.4-0.2), 1, 20);
    ns.economy.unemployment = clampEco(ns.economy.unemployment+(Math.random()*0.3-0.15), 3, 20);
    ns.economy.gdpGrowth = clampEco(ns.economy.gdpGrowth+(Math.random()*0.4-0.2), -5, 10);
    ns.politicalCapital = Math.min(100,ns.politicalCapital+2);
    ns.budget = Math.min(100,ns.budget+3);
    // Estresse acumula
    ns.estresse = clamp(ns.estresse+Math.floor(Math.random()*3));
    if (ns.estresse>70) ns.saudePolitica = clamp(ns.saudePolitica-2);
    if (ns.saudePolitica<30) showNotif("🏥 Saúde política crítica! Risco de afastamento.","danger");
    // Risco diminui lentamente se não houver novos ilícitos
    if (ns.riscoInvestigacao>0 && ns.favoresPendentes.length===0) ns.riscoInvestigacao = clamp(ns.riscoInvestigacao-1);
    // Verificar PF
    if (ns.riscoInvestigacao>=70 && Math.random()*100 < ns.riscoInvestigacao*0.5) {
      ns.riscoInvestigacao = clamp(ns.riscoInvestigacao+10);
      showNotif("🚔 OPERAÇÃO DA POLÍCIA FEDERAL! Investigação em curso...","danger");
      ns.politicalCapital = Math.max(0, ns.politicalCapital-20);
      ns.approval.populacao = clamp(ns.approval.populacao-10);
      ns.approval.midia = clamp(ns.approval.midia-8);
    }
    // Efeitos do orçamento
    AREAS_ORCAMENTO.forEach(a=>{
      if ((ns.orcamento?.[a.id]||a.base) < a.min && Math.random()<0.3) {
        showNotif(`⚠️ Crise orçamentária: ${a.nome} abaixo do mínimo!`,"warn");
        ns.approval.populacao = clamp(ns.approval.populacao-3);
      }
    });
    // Bancadas drift
    const ov = getOverall(ns);
    BANCADAS.forEach(b=>{
      const current = ns.bancadas?.[b.id]??50;
      const drift = (ov-50)*0.05 + (Math.random()-0.5)*3;
      ns.bancadas[b.id] = Math.max(5,Math.min(95,current+drift));
    });
    // Salário
    if (ns.cargo) ns.riquezaPessoal += ns.cargo.salario;
    // Favores pendentes — reduz prazo
    ns.favoresPendentes = ns.favoresPendentes.map(f=>({...f,prazo:f.prazo-1})).filter(f=>{
      if (f.prazo<=0) { showNotif(`⏰ Favor venceu: ${f.favor} — cobrança iminente!`,"warn"); return true; }
      return true;
    });
    // Evento aleatório
    let ev=null;
    if (Math.random()<0.28){
      const e=RANDOM_EVENTS[Math.floor(Math.random()*RANDOM_EVENTS.length)];
      const ns2 = applyEffects(ns,e.effects);
      Object.assign(ns,ns2);
      ev={text:e.text,type:e.type,month:ns.month,year:ns.year};
    }
    // Verificar fim de mandato
    const mandatoMeses = (ns.cargo?.mandato_anos||4)*12;
    if (ns.monthsInOffice >= mandatoMeses) {
      const ov2 = getOverall(ns);
      if (ns.term < ns.maxTerms && ov2 >= 45) {
        ns.term+=1; ns.monthsInOffice=0; ns.month=1; ns.reelected=true;
        setState(ns); setPhase("results"); return {state:ns, event:null, fimMandato:true};
      }
      ns.gameOver=true; setState(ns); setPhase("results"); return {state:ns, event:null, fimMandato:true};
    }
    // Impeachment
    if (ns.approval.congresso<15 && ov2<20 && ns.politicalCapital<20) {
      ns.impeached=true; ns.gameOver=true; setState(ns); setPhase("results");
      return {state:ns, event:null, fimMandato:true};
    }
    return {state:ns,event:ev};
  };

  const handleChoice = async (option) => {
    let ns = applyEffects(state, option.effects);
    // Ajustar estresse baseado no discurso
    if (option.discurso) {
      if (option.discurso==="populista") ns.estresse = clamp(ns.estresse-3);
      else if (option.discurso==="pragmatico") ns.estresse = clamp(ns.estresse+2);
      else if (option.discurso==="progressista") ns.estresse = clamp(ns.estresse+1);
      else ns.estresse = clamp(ns.estresse-1);
      // Gerar manchetes
      gerarManchetes(option.label, option.discurso);
      // Atualizar legado
      ns.legado.crisesResolvidas += 1;
    }
    const {state:ns2,event} = doAdvanceMonth(ns);
    ns = ns2;
    if (event) showNotif(event.text, event.type==="positivo"?"success":"warn");
    setState(ns); setCurrentScenario(null); setPhase("game");
    showNotif(`✅ ${option.label}`,"success");
    // AI analysis
    setLoadingAI(true); setAiText("");
    try {
      const disc = option.discurso||"pragmatico";
      const prompt = `Analista político brasileiro. Em até 50 palavras, comente a decisão "${option.label}" (estilo ${disc}) de um político. Seja direto.`;
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:150,
          messages:[{role:"user",content:prompt}]})
      });
      const data=await res.json();
      setAiText(data.content?.find(b=>b.type==="text")?.text||"Análise indisponível.");
    } catch { setAiText("📺 Análise política em desenvolvimento..."); }
    setLoadingAI(false);
  };

  const triggerScenario = () => {
    const avail = SCENARIOS.filter(s=>!usedScenarios.includes(s.id));
    if (!avail.length){showNotif("♻️ Novo ciclo de crises.","info");setUsedScenarios([]);return;}
    const sc = avail[Math.floor(Math.random()*avail.length)];
    setUsedScenarios(p=>[...p,sc.id]);
    setCurrentScenario(sc); setPhase("scenario");
  };

  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Bebas+Neue&family=Playfair+Display:wght@700;900&display=swap'); *{box-sizing:border-box;}`;

  // ════════════════ RENDER: MENU ════════════════
  if (phase==="menu") return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'IBM Plex Mono',monospace",padding:24}}>
      <style>{fontImport}</style>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 50% at 50% 0%,rgba(64,128,255,0.07) 0%,transparent 70%)"}}/>
      <div style={{textAlign:"center",maxWidth:520,position:"relative"}}>
        <div style={{fontSize:72,marginBottom:8}}>🇧🇷</div>
        <h1 style={{fontFamily:"'Bebas Neue'",fontSize:"clamp(48px,10vw,76px)",color:C.text,letterSpacing:8,margin:"0 0 4px",lineHeight:1}}>O CANDIDATO</h1>
        <p style={{color:C.muted,fontSize:11,marginBottom:8,letterSpacing:5}}>POLÍTICO RPG · SIMULADOR BRASILEIRO</p>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:24,textAlign:"left"}}>
          <p style={{color:C.muted,fontSize:11,lineHeight:2,margin:0}}>
            🏛️ Comece como vereador ou presidente.<br/>
            📜 Gerencie orçamento real com causa e efeito.<br/>
            💼 Aceite financiamento empresarial — e pague favores.<br/>
            📺 8 veículos de mídia com viés político real.<br/>
            ⚖️ Congresso com bancadas, decretos e impeachment.<br/>
            🚔 Risco de investigação da PF.<br/><br/>
            <span style={{color:C.yellow}}>⚠️ Cada escolha tem consequências imprevisíveis.</span>
          </p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button onClick={()=>setPhase("campanha")} style={{width:"100%",padding:18,background:`linear-gradient(135deg,#1A3580,${C.blue})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue'",fontSize:22,letterSpacing:4,cursor:"pointer"}}>
            🗳️ NOVA CAMPANHA
          </button>
          <button onClick={()=>{const ns={...INITIAL_STATE,cargo:CARGOS[6],partido:PARTIDOS[2],nome:"Presidente",idade:45};setState(ns);setPhase("game");showNotif("🇧🇷 Presidência iniciada!","success");}}
            style={{width:"100%",padding:14,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,color:C.muted,fontFamily:"'Bebas Neue'",fontSize:15,letterSpacing:2,cursor:"pointer"}}>
            ⚡ PULAR PARA PRESIDÊNCIA
          </button>
        </div>
      </div>
    </div>
  );

  // ════════════════ RENDER: CAMPANHA ════════════════
  if (phase==="campanha") return (
    <>
      <style>{fontImport}</style>
      <CampanhaScreen state={state} onBack={()=>setPhase("menu")} onStart={(ns)=>{setState(ns);setPhase("game");showNotif(`🗳️ Campanha concluída! ${ns.cargo?.nome} eleito(a)!`,"success");}}/>
    </>
  );

  // ════════════════ RENDER: SCENARIO ════════════════
  if (phase==="scenario"&&currentScenario) return (
    <>
      <style>{fontImport}</style>
      <ScenarioScreen scenario={currentScenario} state={state} onChoice={handleChoice} onBack={()=>{setCurrentScenario(null);setPhase("game");}}/>
      <Notif n={notif}/>
    </>
  );

  // ════════════════ RENDER: ORÇAMENTO ════════════════
  if (phase==="orcamento") return (
    <>
      <style>{fontImport}</style>
      <OrcamentoScreen state={state} onBack={()=>setPhase("game")} onStateChange={setState} showNotif={showNotif}/>
      <Notif n={notif}/>
    </>
  );

  // ════════════════ RENDER: FINANCIAMENTO ════════════════
  if (phase==="financiamento") return (
    <>
      <style>{fontImport}</style>
      <FinanciamentoScreen state={state} onBack={()=>setPhase("game")} onStateChange={setState} showNotif={showNotif}/>
      <Notif n={notif}/>
    </>
  );

  // ════════════════ RENDER: MÍDIA ════════════════
  if (phase==="midia") return (
    <>
      <style>{fontImport}</style>
      <MidiaScreen state={state} onBack={()=>setPhase("game")} ultimasManchetes={ultimasManchetes}/>
      <Notif n={notif}/>
    </>
  );

  // ════════════════ RENDER: RESULTS ════════════════
  if (phase==="results") return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'IBM Plex Mono',monospace",padding:24}}>
      <style>{fontImport}</style>
      <div style={{maxWidth:520,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:72,marginBottom:12}}>{state.impeached?"⚡":state.reelected?"🎉":overall<45?"📉":"🏛️"}</div>
        <h1 style={{fontFamily:"'Bebas Neue'",fontSize:52,color:state.impeached?C.red:state.reelected?C.green:C.text,letterSpacing:4,margin:"0 0 8px"}}>
          {state.impeached?"IMPEACHMENT":state.reelected?"REELEITO!":"FIM DO MANDATO"}
        </h1>
        <p style={{color:C.muted,fontSize:12,marginBottom:16}}>
          {state.impeached?"O Congresso encerrou seu governo.":state.reelected?"O povo confiou em você por mais um mandato!":`Mandato encerrado em ${state.year} com ${overall}% de aprovação.`}
        </p>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:14}}>
          <div style={{fontSize:10,color:C.accent,marginBottom:8,letterSpacing:2}}>🏆 LEGADO</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:10,color:C.muted}}>
            {[["Crises resolvidas",state.legado.crisesResolvidas],["Leis aprovadas",state.legado.leisAprovadas],["Escândalos",state.legado.escandalos],["Riqueza final",`R$${(state.riquezaPessoal/1000).toFixed(0)}k`]].map(([l,v])=>(
              <div key={l} style={{background:C.dim,borderRadius:6,padding:"8px 10px"}}>
                <div style={{fontSize:8,marginBottom:2}}>{l}</div>
                <div style={{fontSize:16,fontWeight:800,color:C.text}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={()=>{setState({...INITIAL_STATE});setPhase("campanha");setUltimasManchetes([]);setAiText("");setUsedScenarios([]);}}
            style={{padding:14,background:`linear-gradient(135deg,#1A3580,${C.blue})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue'",fontSize:16,letterSpacing:3,cursor:"pointer"}}>
            🗳️ NOVA CAMPANHA
          </button>
          <button onClick={()=>{setState({...INITIAL_STATE,cargo:CARGOS[6],partido:PARTIDOS[2],nome:"Presidente",idade:45});setPhase("game");setUltimasManchetes([]);setUsedScenarios([]);}}
            style={{padding:14,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,color:C.muted,fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:2,cursor:"pointer"}}>
            ⚡ PRESIDÊNCIA RÁPIDA
          </button>
        </div>
      </div>
    </div>
  );

  // ════════════════ RENDER: GAME (PAINEL PRINCIPAL) ════════════════
  const cargoInfo = state.cargo || CARGOS[6];
  const tabs=[
    {id:"painel",lbl:"PAINEL"},
    {id:"aprovacao",lbl:"APROVAÇÃO"},
    {id:"economia",lbl:"ECONOMIA"},
    {id:"social",lbl:"SOCIAL"},
    {id:"bancadas",lbl:"BANCADAS"},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'IBM Plex Mono',monospace",color:C.text}}>
      <style>{fontImport}</style>
      <Notif n={notif}/>

      {/* Header */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:17,letterSpacing:2}}>
            {cargoInfo.icon} {cargoInfo.nome?.toUpperCase()||"PRESIDENTE"} — {state.nome?.toUpperCase()||"JOGADOR"}
          </div>
          <div style={{fontSize:9,color:C.muted}}>
            {["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"][state.month-1]} {state.year} · 
            {state.term}º Mandato · {state.idade} anos · 
            {state.partido?.icon} {state.partido?.nome||"Sem partido"} · 
            {usedScenarios.length} crises
          </div>
        </div>
        <div style={{textAlign:"right",display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:overall>=50?C.green:overall>=35?C.yellow:C.red,lineHeight:1}}>{overall}%</div>
            <div style={{fontSize:8,color:C.muted}}>APROVAÇÃO</div>
          </div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:state.riscoInvestigacao>=70?C.red:state.riscoInvestigacao>=40?C.yellow:C.green,lineHeight:1}}>{state.riscoInvestigacao}%</div>
            <div style={{fontSize:8,color:C.muted}}>RISCO PF</div>
          </div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:state.saudePolitica<40?C.red:C.green,lineHeight:1}}>{state.saudePolitica}%</div>
            <div style={{fontSize:8,color:C.muted}}>SAÚDE</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 12px",overflowX:"auto"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{padding:"10px 12px",background:"none",border:"none",borderBottom:`2px solid ${activeTab===t.id?C.blue:"transparent"}`,color:activeTab===t.id?C.blue:C.muted,fontSize:10,cursor:"pointer",whiteSpace:"nowrap"}}>
            {t.lbl}
          </button>
        ))}
      </div>

      <div style={{maxWidth:660,margin:"0 auto",padding:20}}>

        {/* PAINEL */}
        {activeTab==="painel" && (
          <div>
            {/* Stats rápidos */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
              {[
                ["⚡ CAP.POL",state.politicalCapital+"pts",C.yellow],
                ["💰 ORÇAMENTO",state.budget+"%",C.green],
                ["💵 RIQUEZA",`R$${(state.riquezaPessoal/1000).toFixed(0)}k`,C.accent],
                ["📈 PIB",state.economy.gdpGrowth.toFixed(1)+"%",state.economy.gdpGrowth>2?C.green:C.red],
                ["💸 INFLAÇÃO",state.economy.inflation.toFixed(1)+"%",state.economy.inflation>6?C.red:C.green],
                ["👥 DESEMPREGO",state.economy.unemployment.toFixed(1)+"%",state.economy.unemployment>8?C.red:C.green],
              ].map(([l,v,col])=>(
                <div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontSize:8,color:C.muted,marginBottom:3}}>{l}</div>
                  <div style={{fontSize:16,fontWeight:800,color:col,fontFamily:"'Playfair Display',serif"}}>{v}</div>
                </div>
              ))}
            </div>

            {/* AI Text */}
            {(aiText||loadingAI) && (
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{fontSize:9,color:C.accent,marginBottom:6,letterSpacing:2}}>📺 ANÁLISE POLÍTICA</div>
                {loadingAI ? <div style={{color:C.muted,fontSize:10}}>Analisando repercussão...</div> :
                  <p style={{color:C.muted,fontSize:10,lineHeight:1.7,margin:0,fontStyle:"italic"}}>{aiText}</p>}
              </div>
            )}

            {/* Últimas manchetes resumidas */}
            {ultimasManchetes.length>0 && (
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:14,maxHeight:120,overflowY:"auto"}}>
                <div style={{fontSize:9,color:C.muted,marginBottom:6}}>📰 ÚLTIMAS MANCHETES</div>
                {ultimasManchetes.slice(-3).reverse().map((m,i)=>(
                  <div key={i} style={{fontSize:9,color:C.text,padding:"3px 0",borderBottom:`1px solid ${C.dim}`,lineHeight:1.4}}>
                    <span style={{color:C.muted}}>{m.data}</span> {m.texto.split('"')[1]||m.texto}
                  </div>
                ))}
              </div>
            )}

            {/* Alertas de favores pendentes */}
            {state.favoresPendentes.length>0 && (
              <div style={{background:"rgba(255,183,0,0.06)",border:`1px solid ${C.yellow}44`,borderRadius:8,padding:10,marginBottom:14}}>
                <div style={{fontSize:10,color:C.yellow}}>⏰ {state.favoresPendentes.length} favor(es) empresarial(is) pendente(s)!</div>
              </div>
            )}

            {/* Botões de ação */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <button onClick={triggerScenario}
                style={{padding:14,background:`linear-gradient(135deg,#5C0000,${C.red})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:2,cursor:"pointer",lineHeight:1.3}}>
                ⚡ NOVA CRISE<br/><span style={{fontSize:8,fontFamily:"'IBM Plex Mono'",opacity:.7}}>{usedScenarios.length} resolvidas</span>
              </button>
              <button onClick={()=>setPhase("decretos")}
                style={{padding:14,background:`linear-gradient(135deg,#3A2800,${C.accent})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:2,cursor:"pointer",lineHeight:1.3}}>
                📜 DECRETOS<br/><span style={{fontSize:8,fontFamily:"'IBM Plex Mono'",opacity:.7}}>Ação executiva</span>
              </button>
              {cargoInfo.tipo==="Executivo" && (
                <button onClick={()=>setPhase("orcamento")}
                  style={{padding:12,background:`linear-gradient(135deg,#0D5010,${C.green})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:2,cursor:"pointer"}}>
                  💰 ORÇAMENTO
                </button>
              )}
              <button onClick={()=>setPhase("financiamento")}
                style={{padding:12,background:`linear-gradient(135deg,#4A2000,${C.accent})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:2,cursor:"pointer"}}>
                💼 FINANCIADORES
              </button>
              <button onClick={()=>setPhase("midia")}
                style={{padding:12,background:`linear-gradient(135deg,#0D2050,${C.blue})`,border:"none",borderRadius:10,color:"#fff",fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:2,cursor:"pointer"}}>
                📺 IMPRENSA
              </button>
              <button onClick={()=>{
                const {state:ns,event}=doAdvanceMonth(state);
                if (event) showNotif(event.text, event.type==="positivo"?"success":"warn");
                setState(ns);
                showNotif("📅 Mês avançado. Salário recebido.","info");
              }}
                style={{padding:12,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,color:C.muted,fontFamily:"'Bebas Neue'",fontSize:14,letterSpacing:2,cursor:"pointer"}}>
                ⏩ AVANÇAR MÊS
              </button>
            </div>
          </div>
        )}

        {/* APROVAÇÃO */}
        {activeTab==="aprovacao" && (
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
            <div style={{fontSize:12,color:C.accent,marginBottom:12,letterSpacing:2}}>📊 APROVAÇÃO POR GRUPO</div>
            {Object.entries(state.approval).map(([k,v])=>(
              <Bar key={k} label={{populacao:"População",midia:"Mídia",direita:"Direita",esquerda:"Esquerda",movSociais:"Mov.Sociais",congresso:"Congresso",mercado:"Mercado",internacional:"Internacional"}[k]}
                value={v}
                icon={{populacao:"👥",midia:"📺",direita:"🔵",esquerda:"🔴",movSociais:"✊",congresso:"🏛️",mercado:"📈",internacional:"🌐"}[k]}
                color={{populacao:C.blue,midia:C.purple,direita:"#2563EB",esquerda:"#DC2626",movSociais:"#EF4444",congresso:C.yellow,mercado:C.green,internacional:"#8B5CF6"}[k]}/>
            ))}
          </div>
        )}

        {/* ECONOMIA */}
        {activeTab==="economia" && (
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
            <div style={{fontSize:12,color:C.accent,marginBottom:12,letterSpacing:2}}>📈 INDICADORES ECONÔMICOS</div>
            {[
              ["📈 Crescimento do PIB",state.economy.gdpGrowth.toFixed(1)+"%",state.economy.gdpGrowth>2?C.green:C.red],
              ["💸 Inflação",state.economy.inflation.toFixed(1)+"%",state.economy.inflation>6?C.red:C.green],
              ["👥 Desemprego",state.economy.unemployment.toFixed(1)+"%",state.economy.unemployment>8?C.red:C.green],
              ["📉 Dívida Pública",state.economy.debt.toFixed(0)+"% do PIB",state.economy.debt>90?C.red:C.yellow],
              ["💵 Reservas Internacionais",`US$${state.economy.reserves.toFixed(0)} bi`,C.green],
            ].map(([l,v,col])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.dim}`}}>
                <span style={{fontSize:11,color:C.muted}}>{l}</span>
                <span style={{fontSize:13,fontWeight:700,color:col,fontFamily:"'Playfair Display',serif"}}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* SOCIAL */}
        {activeTab==="social" && (
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
            <div style={{fontSize:12,color:C.accent,marginBottom:12,letterSpacing:2}}>🌟 INDICADORES SOCIAIS</div>
            {Object.entries(state.socialIndicators).map(([k,v])=>(
              <Bar key={k} label={{education:"Educação",healthcare:"Saúde",security:"Segurança",inequality:"Igualdade",infrastructure:"Infraestrutura"}[k]}
                value={v} color={C.purple}
                icon={{education:"📚",healthcare:"🏥",security:"🛡️",inequality:"⚖️",infrastructure:"🏗️"}[k]}/>
            ))}
            {cargoInfo.tipo==="Executivo" && (
              <div style={{marginTop:16,background:C.dim,borderRadius:8,padding:10}}>
                <div style={{fontSize:10,color:C.muted,marginBottom:6}}>📋 ORÇAMENTO ATUAL</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {AREAS_ORCAMENTO.map(a=>{
                    const val = state.orcamento?.[a.id]||a.base;
                    const abaixo = val < a.min;
                    return <Tag key={a.id} color={abaixo?C.red:C.green}>{a.icon} {a.nome}: {val}%</Tag>;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BANCADAS */}
        {activeTab==="bancadas" && (
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
            <div style={{fontSize:12,color:C.accent,marginBottom:12,letterSpacing:2}}>🏛️ BANCADAS NO CONGRESSO</div>
            {BANCADAS.map(b=>{
              const apoio = state.bancadas?.[b.id]??50;
              return (
                <div key={b.id} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:10,color:C.muted}}>{b.icon} {b.sigla} ({b.cadeiras} cad.)</span>
                    <span style={{fontSize:11,fontWeight:700,color:apoio>=50?C.green:apoio>=35?C.yellow:C.red}}>{apoio}%</span>
                  </div>
                  <div style={{height:5,background:C.dim,borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${apoio}%`,background:apoio>=50?b.cor:C.red,borderRadius:2,transition:"width 0.5s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
   }
