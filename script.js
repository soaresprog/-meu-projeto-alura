/*
  Amigo Secreto - script.js
  - Adiciona participantes
  - Valida duplicatas/nome vazio
  - Realiza sorteio garantindo que ninguém tire a si mesmo
  - Exibe resultado e permite copiar
*/

const nomeInput = document.getElementById('nomeInput');
const adicionarBtn = document.getElementById('adicionarBtn');
const listaParticipantes = document.getElementById('listaParticipantes');
const sortearBtn = document.getElementById('sortearBtn');
const resultadoCard = document.getElementById('resultadoCard');
const resultadoList = document.getElementById('resultadoList');
const limparBtn = document.getElementById('limparBtn');
const copiarBtn = document.getElementById('copiarBtn');

let participantes = [];

function renderLista(){
  listaParticipantes.innerHTML = '';
  participantes.forEach((p, idx) => {
    const li = document.createElement('li');
    li.textContent = p;
    const btn = document.createElement('button');
    btn.textContent = 'Remover';
    btn.style.background='transparent';
    btn.style.border='0';
    btn.style.cursor='pointer';
    btn.onclick = () => {
      participantes.splice(idx,1);
      renderLista();
    };
    li.appendChild(btn);
    listaParticipantes.appendChild(li);
  });
  sortearBtn.disabled = participantes.length < 2;
}

function adicionarNome(){
  const nome = nomeInput.value.trim();
  if(!nome) return alert('Digite um nome válido.');
  if(participantes.includes(nome)) return alert('Nome já adicionado.');
  participantes.push(nome);
  nomeInput.value='';
  renderLista();
  nomeInput.focus();
}

adicionarBtn.addEventListener('click', adicionarNome);
nomeInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') adicionarNome();
});

function shuffle(array){
  for(let i = array.length -1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i],array[j]] = [array[j],array[i]];
  }
}

function gerarParings(partes){
  // tenta gerar pareamentos válidos sem que alguém tire a si próprio
  const maxTentativas = 1000;
  for(let t=0;t<maxTentativas;t++){
    const candidatos = partes.slice();
    shuffle(candidatos);
    let valido = true;
    const resultado = {};
    for(let i=0;i<partes.length;i++){
      if(partes[i] === candidatos[i]){ valido=false; break; }
      resultado[partes[i]] = candidatos[i];
    }
    if(valido) return resultado;
  }
  return null;
}

sortearBtn.addEventListener('click', () => {
  if(participantes.length < 2) return alert('Adicione pelo menos 2 participantes.');
  const resultado = gerarParings(participantes);
  if(!resultado) return alert('Não foi possível gerar um sorteio válido. Tente alterar os nomes.');
  mostrarResultado(resultado);
});

function mostrarResultado(mapResultado){
  resultadoList.innerHTML='';
  for(const [sorteador,sorteado] of Object.entries(mapResultado)){
    const li = document.createElement('li');
    li.textContent = `${sorteador} ➜ ${sorteado}`;
    resultadoList.appendChild(li);
  }
  resultadoCard.hidden = false;
}

limparBtn.addEventListener('click', () => {
  if(!confirm('Deseja limpar a lista de participantes?')) return;
  participantes = [];
  renderLista();
  resultadoCard.hidden = true;
});

copiarBtn.addEventListener('click', () => {
  const lines = Array.from(resultadoList.children).map(li => li.textContent).join('\n');
  navigator.clipboard.writeText(lines).then(()=>{
    alert('Resultado copiado para a área de transferência.');
  }).catch(()=>{
    alert('Não foi possível copiar automaticamente. Selecione e copie manualmente.');
  });
});

// render inicial
renderLista();
