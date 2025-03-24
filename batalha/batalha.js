const pesquisaMeuPokemon = document.getElementById("pesquisa-meu-poke")
const pesquisaPokemonAdversario =  document.getElementById("pesquisa-poke-adversario")
const nomeMeuPokemon = document.getElementById("nome-meu-poke")
const fotoMeuPokemon = document.getElementById("img-meu-poke")
const hpMeuPokemon = document.getElementById("hp-meu-poke")
const hpPorcentagemMeuPokemon = document.getElementById("hp-porcentagem-meu-poke")
const nomePokemonAdversario = document.getElementById("nome-poke-adversario")
const fotoPokemonAdversario = document.getElementById("img-poke-adversario")
const hpPokemonAdversario = document.getElementById("hp-poke-adversario")
const hpPorcentagemPokemonAdversario = document.getElementById("hp-porcentagem-poke-adversario")
const ataque1MeuPokemon = document.getElementById("golpe-1")
const ataque2MeuPokemon = document.getElementById("golpe-2")
const caixinhaMeuPokemon = document.getElementById("meu-poke-pesquisa")
const caixinhaPokemonAdversario = document.getElementById("poke-adversario-pesquisa")
const meuPokemon = document.getElementById("meu-poke")
const message = document.getElementById("message")
const batalha = document.getElementById("battle-container")
const report = document.getElementById("report")
const restart = document.getElementById("restart")

let ataque1Adversario = {nome:"",tipo:""}
let ataque2Adversario = {nome:"",tipo:""}
let fraquezasMeuPokemon = {}
let fraquezasAdversario = {}
let hpPokemonAdversarioValor = 100
let hpMeuPokemonValor = 100

async function carregarPokemonAdversario() {
  const idPokemon = Math.floor(Math.random() * 1000) + 1;
  const dadosPokemon1 = await pegarPokemon(idPokemon); 
  console.log(dadosPokemon1);

  nomePokemonAdversario.innerText = dadosPokemon1.species.name.toUpperCase();   
  fotoPokemonAdversario.src = dadosPokemon1.sprites.front_default;
  hpPorcentagemPokemonAdversario.innerText = "100%";
  let list1 = dadosPokemon1.moves
      const [golpe1retornoAdv, golpe2retornoAdv] = await Promise.all([
        pegarGolpe(list1[Math.floor(Math.random() * (list1.length - 0 + 1))].move.url),
        pegarGolpe(list1[Math.floor(Math.random() * (list1.length - 0 + 1))].move.url)
    ]);
  ataque1Adversario.nome = golpe1retornoAdv.name
  ataque1Adversario.tipo = golpe1retornoAdv.type.name
  ataque2Adversario.nome = golpe2retornoAdv.name
  ataque2Adversario.tipo = golpe2retornoAdv.type.name
  fraquezasAdversario = await pegarFraquezas(dadosPokemon1.name)
}
window.onload = carregarPokemonAdversario();


let ataque1 = {nome:"",tipo:""}
let ataque2 = {nome:"",tipo:""}
async function pegarPokemon(nomePokemon) {
  try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + nomePokemon);
      if (!response.ok) {
          throw new Error(`Erro: ${response.status}`);
      }
      const data = await response.json();
      console.log('Dados recebidos:', data);
      return data; 
  } catch (error) {
      console.error('Erro na requisição:', error);
  }
}

async function pegarGolpe(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
    }
    const data = await response.json();
    console.log('Dados recebidos:', data);
    return data;  
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}
function golpearAdversario(ataque){
  message.innerText = "Adversário usou " + ataque.nome + "!!!"
  hpMeuPokemonValor = hpMeuPokemonValor - (25 * fraquezasMeuPokemon[ataque.tipo] || 25)
  hpPorcentagemMeuPokemon.innerText = hpMeuPokemonValor + "%"
  hpMeuPokemon.style.width = hpMeuPokemonValor + "%"; 
  if(hpMeuPokemonValor <= 0){
    setarVencedor(false)
  }
}
async function escolherGolpeAdversario(){
    setTimeout(() => {
        const golpe = Math.random()
        if (golpe < 0.5){
          golpearAdversario(ataque1Adversario)
          ataque1MeuPokemon.classList.remove("invisivel")
          ataque2MeuPokemon.classList.remove("invisivel")
          message.innerText = "O Adversário usou "+ataque1Adversario.nome +"\n\nEscolha um golpe!!!"
        }
        else{
          golpearAdversario(ataque2Adversario)
          ataque1MeuPokemon.classList.remove("invisivel")
          ataque2MeuPokemon.classList.remove("invisivel")
          message.innerText = "O Adversário usou "+ataque2Adversario.nome +"\n\nEscolha um golpe!!!"
        }
    }, Math.random() * 10000); 
}
async function golpear(ataque) {
  hpPokemonAdversarioValor = hpPokemonAdversarioValor - (25 * fraquezasAdversario[ataque.tipo] || 25)
  hpPorcentagemPokemonAdversario.innerText = hpPokemonAdversarioValor + "%"
  message.innerText = "Você usou " + ataque.nome + "!!!\n\nO Adversário está escolhendo seu golpe"
  ataque1MeuPokemon.classList.add("invisivel")
  ataque2MeuPokemon.classList.add("invisivel")
}
async function pegarFraquezas(nomePokemon) {
  const dadoPokemon = await pegarPokemon(nomePokemon)
  
  const tipos = dadoPokemon.types.map(t => t.type.name);

  let fraquezas = {};
  
  for (const tipo of tipos) {
      const tipoResposta = await fetch("https://pokeapi.co/api/v2/type/" + tipo);
      const tipoData = await tipoResposta.json();
      
      tipoData.damage_relations.double_damage_from.forEach(t => {
          fraquezas[t.name] = (fraquezas[t.name] || 1) * 2;
      });

      tipoData.damage_relations.half_damage_from.forEach(t => {
          fraquezas[t.name] = (fraquezas[t.name] || 1) * 0.5;
      });

      tipoData.damage_relations.no_damage_from.forEach(t => {
          fraquezas[t.name] = 0;
      });
  }
  console.log(fraquezas);
  
  return fraquezas;
}
function setarVencedor(vitoriaUser){
  batalha.classList.add("invisivel")
    if (vitoriaUser){
      report.innerText = "Você ganhou!!!"
    }
    else{
      report.innerText = "Você perdeu!!!"
    }
  report.classList.remove("invisivel")
  restart.classList.remove("invisivel")
}

pesquisaMeuPokemon.addEventListener('keydown', async (event) => {
  if (event.key === "Enter") {
      const valorCampo = pesquisaMeuPokemon.value.toLowerCase();
      const dadosPokemon = await pegarPokemon(valorCampo); 
      console.log(dadosPokemon);
      nomeMeuPokemon.innerText = dadosPokemon.species.name.toUpperCase()
      fotoMeuPokemon.src = dadosPokemon.sprites.back_default
      hpPorcentagemMeuPokemon.innerText = "100%"
      caixinhaMeuPokemon.classList.add("invisivel")
      let list = dadosPokemon.moves
      const [golpe1retorno, golpe2retorno] = await Promise.all([
        pegarGolpe(list[Math.floor(Math.random() * (list.length - 0 + 1))].move.url),
        pegarGolpe(list[Math.floor(Math.random() * (list.length - 0 + 1))].move.url)
    ]);
    ataque1.nome = golpe1retorno.name
    ataque1.tipo = golpe1retorno.type.name
    ataque2.nome = golpe2retorno.name
    ataque2.tipo = golpe2retorno.type.name

    ataque1MeuPokemon.innerText = ataque1.nome.toUpperCase() + " (" + ataque1.tipo + ")"
    ataque2MeuPokemon.innerText = ataque2.nome.toUpperCase() + " (" + ataque2.tipo + ")"
    fraquezasMeuPokemon = await pegarFraquezas(valorCampo.toLowerCase())
    meuPokemon.classList.remove("invisivel")
    message.innerText = "Escolha um Golpe!!!"
    }
});

ataque1MeuPokemon.addEventListener('click' ,async ()=>{
  await Promise.all([golpear(ataque1),escolherGolpeAdversario()])
  hpPokemonAdversario.style.width = hpPokemonAdversarioValor + "%"
  if(hpPokemonAdversarioValor <= 0){
    setarVencedor(true)
  }
})
ataque2MeuPokemon.addEventListener('click', async()=>{
  await Promise.all([golpear(ataque2),escolherGolpeAdversario()])
  hpPokemonAdversario.style.width = hpPokemonAdversarioValor + "%"
  if(hpPokemonAdversarioValor <= 0){    
    setarVencedor(true)
  }
})
restart.addEventListener('click',()=>{
  window.location.reload()
})
