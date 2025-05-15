let faseAtual = [];
let vencedores = [];

function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function gerarChaves(nomes = null) {
    document.getElementById('proximaFase').innerHTML = '';
    if (!nomes) {
        const input = document.getElementById('nomes').value;
        nomes = input.split('\n').map(n => n.trim()).filter(n => n);
        if (nomes.length < 2) {
            document.getElementById('resultado').innerHTML = "<p>Ei, você esqueceu de escrever os participantes!</p>";
            return;
        }
        embaralhar(nomes);
    }

    faseAtual = [];
    vencedores = [];
    let html = '';

    // Se número de participantes for ímpar, sorteia um para avançar para a próxima fase
    let classificadosDiretos = [];
    if (nomes.length % 2 !== 0) {
        embaralhar(nomes); // embaralha para sorteio justo
        const sorteado = nomes.pop(); // remove e guarda o sorteado
        classificadosDiretos.push(sorteado);
    }

    // Monta os pares de duelos
    for (let i = 0; i < nomes.length; i += 2) {
        faseAtual.push([nomes[i], nomes[i + 1]]);
        html += `
            <div class="par" id="par${i / 2}">
                <button onclick="marcarVencedor(${i / 2}, 0, this)"> ${nomes[i]} </button><br>
                <button onclick="marcarVencedor(${i / 2}, 1, this)"> ${nomes[i + 1]} </button>
            </div>
        `;
    }

    // Adiciona o classificado direto (se houver)
    for (const direto of classificadosDiretos) {
        faseAtual.push([direto, null]);
        const index = faseAtual.length - 1;
        html += `
            <div class="par selecionado" id="par${index}">
                <span class="vencedor"> ☆ ${direto} ☆ (classificado por sorteio)</span><br>
                <em>(aguardando adversário na próxima fase)</em>
            </div>
        `;
        vencedores[index] = direto;
    }

    document.getElementById('resultado').innerHTML = html;
    checarProximaFase();
}



function checarProximaFase() {
    const incompletos = faseAtual.filter((par, i) => !vencedores[i]);

    // Remove qualquer botão/mensagem anterior
    document.getElementById('proximaFase').innerHTML = '';

    if (incompletos.length === 0) {
        // Todos os vencedores definidos
        if (vencedores.length > 1) {
            document.getElementById('proximaFase').innerHTML =
                `<button onclick="gerarChaves(vencedores.slice())">Próxima Fase</button>`;
        } else {
            document.getElementById('proximaFase').innerHTML =
                `<h2 class="parabens"> Parabéns, você venceu, <span class="vencedor">${vencedores[0]}! </span></h2>`;
        }
    } else {
        // Ainda há vencedores não definidos
        document.getElementById('proximaFase').innerHTML =
            `<p class="aviso">Você precisa definir o vencedor de todos os duelos para continuar.</p>`;
        }
}


document.addEventListener('DOMContentLoaded', () => {
    window.marcarVencedor = function(parIndex, nomeIndex, btn) {
        vencedores[parIndex] = faseAtual[parIndex][nomeIndex];
        const parDiv = document.getElementById('par' + parIndex);
        const botoes = parDiv.getElementsByTagName('button');
        for (let i = 0; i < botoes.length; i++) {
            botoes[i].disabled = false;
            botoes[i].classList.remove('vencedor');
        }
        btn.classList.add('vencedor');
        parDiv.classList.add('selecionado');
        checarProximaFase();
    };
});

