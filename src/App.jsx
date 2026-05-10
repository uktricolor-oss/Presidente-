<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>O Candidato - Simulador de Carreira Política</title>
    <style>
        :root { --primary: #1a5c1a; --secondary: #f9d71c; --dark: #2c3e50; --danger: #e74c3c; }
        body { font-family: 'Segoe UI', sans-serif; background: #eef2f3; margin: 0; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
        
        /* HUD Superior */
        #hud { background: var(--dark); color: white; padding: 10px 20px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; border-bottom: 4px solid var(--secondary); font-size: 0.9em; }
        .stat-box { display: flex; flex-direction: column; align-items: center; }
        .val { font-weight: bold; color: var(--secondary); font-size: 1.1em; }

        /* Área Principal */
        #game-container { flex: 1; display: flex; justify-content: center; align-items: center; padding: 20px; overflow-y: auto; }
        .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 100%; max-width: 800px; }
        
        /* Estilos de Botões e Inputs */
        .btn { background: var(--dark); color: white; border: none; padding: 15px; margin: 8px 0; width: 100%; border-radius: 8px; cursor: pointer; font-size: 1em; transition: 0.2s; text-align: left; position: relative; }
        .btn:hover { background: #34495e; padding-left: 20px; }
        .btn-acao { background: var(--primary); text-align: center; font-weight: bold; }
        
        /* Orçamento Sliders */
        .budget-row { display: flex; align-items: center; gap: 15px; margin: 10px 0; }
        input[type=range] { flex: 1; }
        .budget-label { width: 120px; font-weight: bold; font-size: 0.85em; }

        /* Jornal Reação */
        #news-ticker { background: #000; color: #0f0; padding: 12px; font-family: 'Courier New', monospace; text-transform: uppercase; font-size: 0.8em; }
        .hidden { display: none !important; }
        
        .bancada-icons { display: flex; justify-content: space-around; margin-top: 15px; font-size: 0.7em; color: #666; }
    </style>
</head>
<body>

<div id="hud">
    <div class="stat-box">IDADE <span class="val" id="h-idade">18</span></div>
    <div class="stat-box">CARGO <span class="val" id="h-cargo">Civil</span></div>
    <div class="stat-box">PARTIDO <span class="val" id="h-partido">Nenhum</span></div>
    <div class="stat-box">DINHEIRO <span class="val" id="h-grana">R$ 5.000</span></div>
    <div class="stat-box">POPULARIDADE <span class="val" id="h-pop">0%</span></div>
</div>

<div id="news-ticker">O CANDIDATO: INICIE SUA JORNADA POLÍTICA PARA ESCREVER A HISTÓRIA.</div>

<div id="game-container">
    <!-- TELA 1: FILIAÇÃO -->
    <div id="screen-setup" class="card">
        <h2>Selecione seu Partido e Estilo</h2>
        <p>Escolha uma legenda para sua primeira candidatura (Vereador):</p>
        <div id="partidos-list"></div>
    </div>

    <!-- TELA 2: GABINETE (EXECUTIVO) -->
    <div id="screen-executivo" class="card hidden">
        <h2>Gestão de Orçamento</h2>
        <p>Distribua os recursos. Lembre-se: áreas com pouca verba geram crises.</p>
        <div id="budget-sliders"></div>
        <div style="margin-top:20px; font-weight:bold">Total Alocado: <span id="budget-total">0</span>% / 100%</div>
        <button class="btn btn-acao" onclick="passarTurno()">Aplicar e Avançar Mês</button>
    </div>

    <!-- TELA 3: PLENÁRIO (LEGISLATIVO) -->
    <div id="screen-legislativo" class="card hidden">
        <h2 id="leg-titulo">Crise no Mandato</h2>
        <p id="leg-desc">Carregando...</p>
        <div id="leg-opcoes"></div>
        <div class="bancada-icons">
            <span>🚜 Ruralista: <b id="b-rural">50</b></span>
            <span>⛪ Religiosa: <b id="b-relig">50</b></span>
            <span>👮 Segurança: <b id="b-seg">50</b></span>
            <span>🎓 Social: <b id="b-soc">50</b></span>
        </div>
    </div>
</div>

<script>
// --- BANCO DE DADOS ---
const PARTIDOS = [
    { nome: "PT", verba: 80000, cor: "vermelho", bonus: "Social", exigencia: "Alta" },
    { nome: "PL", verba: 100000, cor: "azul", bonus: "Seguranca", exigencia: "Media" },
    { nome: "MDB", verba: 50000, cor: "verde", bonus: "Pragmatismo", exigencia: "Baixa" },
    { nome: "PSOL", verba: 20000, cor: "rosa", bonus: "Ambiental", exigencia: "Maxima" }
];

const CRISES_VEREADOR = [
    {
        txt: "Greve dos lixeiros por falta de pagamento.",
        opcoes: [
            { txt: "Pagar o bônus usando verba da cultura (Pragmático)", pop: 5, bancada: {soc: 5, rural: 0}, pf: 5, grana: 0 },
            { txt: "Fazer discurso inflamado contra o sindicato (Populista)", pop: 15, bancada: {seg: 10, soc: -15}, pf: 0, grana: 0 },
            { txt: "Privatizar a coleta em caráter de urgência (Técnico)", pop: -10, bancada: {rural: 15, soc: -5}, pf: 0, grana: 20000 },
            { txt: "Prometer aumento mas não cumprir (Mentira)", pop: 10, bancada: {soc: -20}, pf: 10, grana: 0 }
        ]
    }
];

// --- MOTOR DO JOGO ---
let estado = {
    idade: 18, meses: 0, dinheiro: 5000, cargo: "Civil", partido: null,
    pop: 30, pf: 0, 
    bancadas: { rural: 50, relig: 50, seg: 50, soc: 50 },
    orcamento: { Saude: 15, Educacao: 15, Seguranca: 10, Infra: 10, Social: 10, Outros: 40 },
    isExecutivo: false
};

function init() {
    const list = document.getElementById('partidos-list');
    PARTIDOS.forEach(p => {
        const b = document.createElement('button');
        b.className = 'btn';
        b.innerHTML = `<b>${p.nome}</b> - Verba: R$ ${p.verba.toLocaleString()} | Bônus: ${p.bonus}`;
        b.onclick = () => filiar(p);
        list.appendChild(b);
    });
}

function filiar(p) {
    estado.partido = p.nome;
    estado.dinheiro += p.verba;
    estado.cargo = "Vereador";
    proximaFase();
}

function proximaFase() {
    atualizarHUD();
    // Alterna entre Legislativo (Crises) e Executivo (Se for o caso)
    if (["Prefeito", "Governador", "Presidente"].includes(estado.cargo)) {
        abrirExecutivo();
    } else {
        abrirLegislativo();
    }
}

function abrirLegislativo() {
    document.getElementById('screen-setup').classList.add('hidden');
    document.getElementById('screen-executivo').classList.add('hidden');
    document.getElementById('screen-legislativo').classList.remove('hidden');
    
    const crise = CRISES_VEREADOR[0]; // Pegar aleatório no futuro
    document.getElementById('leg-titulo').innerText = `${estado.cargo}: Mês ${estado.meses + 1}`;
    document.getElementById('leg-desc').innerText = crise.txt;
    
    const container = document.getElementById('leg-opcoes');
    container.innerHTML = "";
    crise.opcoes.forEach(o => {
        const b = document.createElement('button');
        b.className = 'btn';
        b.innerText = o.txt;
        b.onclick = () => resolverCrise(o);
        container.appendChild(b);
    });
}

function resolverCrise(o) {
    estado.pop += o.pop;
    estado.pf += o.pf;
    estado.dinheiro += o.grana;
    // Atualiza bancadas
    for (let k in o.bancada) estado.bancadas[k] += o.bancada[k];
    
    passarTurno();
}

function abrirExecutivo() {
    document.getElementById('screen-legislativo').classList.add('hidden');
    document.getElementById('screen-executivo').classList.remove('hidden');
    const container = document.getElementById('budget-sliders');
    container.innerHTML = "";
    for (let area in estado.orcamento) {
        container.innerHTML += `
            <div class="budget-row">
                <div class="budget-label">${area}</div>
                <input type="range" min="0" max="40" value="${estado.orcamento[area]}" 
                    oninput="updateBudget('${area}', this.value)">
                <span>${estado.orcamento[area]}%</span>
            </div>`;
    }
}

function updateBudget(area, val) {
    estado.orcamento[area] = parseInt(val);
    let total = Object.values(estado.orcamento).reduce((a, b) => a + b, 0);
    document.getElementById('budget-total').innerText = total;
    proximaFase(); // Redesenha
}

function passarTurno() {
    estado.meses++;
    if (estado.meses % 12 === 0) {
        estado.idade++;
        estado.dinheiro += 15000; // Salário
    }
    
    // Sistema de Promoção (Exemplo rápido)
    if (estado.meses === 48) {
        if (estado.pop > 60) {
            estado.cargo = "Deputado Federal";
            alert("VOCÊ FOI ELEITO DEPUTADO FEDERAL!");
        } else {
            alert("PERDEU A ELEIÇÃO. Você agora é um cidadão comum.");
            estado.cargo = "Civil";
        }
    }

    // Verificação de Game Over
    if (estado.pf > 90) {
        alert("A PF BATEU NA PORTA! FIM DE CARREIRA.");
        location.reload();
    } else if (estado.idade > 85) {
        alert("Você se aposentou. Seu legado foi escrito.");
        location.reload();
    }

    proximaFase();
}

function atualizarHUD() {
    document.getElementById('h-idade').innerText = estado.idade;
    document.getElementById('h-cargo').innerText = estado.cargo;
    document.getElementById('h-partido').innerText = estado.partido;
    document.getElementById('h-grana').innerText = `R$ ${estado.dinheiro.toLocaleString()}`;
    document.getElementById('h-pop').innerText = `${estado.pop}%`;
    
    document.getElementById('b-rural').innerText = estado.bancadas.rural;
    document.getElementById('b-relig').innerText = estado.bancadas.relig;
    document.getElementById('b-seg').innerText = estado.bancadas.seg;
    document.getElementById('b-soc').innerText = estado.bancadas.soc;
}

init();
</script>
</body>
</html>
