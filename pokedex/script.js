const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=1010";

//Setando os elementos do html
const typeFilterContainer = document.getElementById("type-filters");
const genFilter = document.getElementById("gen-filter");
const orderFilter = document.getElementById("order-filter");
const searchInput = document.getElementById("search");
const container = document.getElementById("pokemon-container");

let allPokemon = [];

async function fetchPokemon() {
  //RequestAPI
  const response = await fetch(API_URL);

  //Converte para JSON
  const data = await response.json();

  //Processa os dados de cada Pokémon da resposta
  allPokemon = await Promise.all(
    data.results.map(async (poke, index) => {
      //Para cada Pokémon, faz uma nova requisição para obter mais detalhes
      const pokeData = await fetch(poke.url).then((res) => res.json());

      //Retorna um objeto com os dados relevantes do Pokémon
      return {
        id: pokeData.id, // ID do Pokémon
        name: pokeData.name, // Nome do Pokémon
        sprite: pokeData.sprites.front_default, // Imagem do Pokémon
        types: pokeData.types.map((t) => t.type.name), // Tipos do Pokémon
        height: pokeData.height, // Altura do Pokémon
        generation: getGeneration(pokeData.id), // Geração do Pokémon (determinada pela função getGeneration)
      };
    })
  );

  mostraPokemon(allPokemon);

  populateFilters();
}

//Escolhendo a geração dos Pokémons com base no ID
function getGeneration(id) {
  //Verifica o intervalo do ID para determinar a geração do Pokémon
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  return 9; //Geração 9 para IDs acima de 905
}


function mostraPokemon(pokemonList) {
  //Limpa o conteúdo anterior do container onde mostra os Pokémons
  container.innerHTML = "";

    pokemonList.forEach(pokemon => {
        const div = document.createElement("div");
        div.classList.add("pokemon");

    //Inputa os dados do pokemon na div a ser colocada na lista
    div.innerHTML = `
            <img src="${pokemon.sprite}" alt="${pokemon.name}">
            <p>${pokemon.name}</p>
            <p>Tipo: ${pokemon.types.join(", ")}</p>
        `;

        container.appendChild(div);
    });
}

function filterPokemon() {
  //Captura o texto de busca, tipos selecionados, geração e a ordem de exibição
  const searchText = searchInput.value.toLowerCase();
  const selectedTypes = getSelectedTypes();
  const selectedGen = genFilter.value;
  const order = orderFilter.value;

  //Filtra os Pokémon
  let filteredPokemon = allPokemon.filter(
    (pokemon) =>
      pokemon.name.includes(searchText) && 
      (selectedTypes.length === 0 ||
        selectedTypes.some((type) => pokemon.types.includes(type))) &&
      (selectedGen === "" || pokemon.generation == selectedGen)
  );

  //Ordena os Pokémon conforme o critério selecionado (por nome ou por ID)
  if (order === "a-z") {
    filteredPokemon.sort((a, b) => a.name.localeCompare(b.name));
  } else if (order === "z-a") {
    filteredPokemon.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    filteredPokemon.sort((a, b) => a.id - b.id);
  }

  mostraPokemon(filteredPokemon);
}

function getSelectedTypes() {
  //Retorna um array com os valores dos tipos que estão selecionados nos checkboxes
  return Array.from(
    document.querySelectorAll("#type-filters input:checked")
  ).map((input) => input.value);
}

function populateFilters() {
  //Cria um array com tipos únicos de Pokémon
  const uniqueTypes = [
    ...new Set(allPokemon.flatMap((pokemon) => pokemon.types)),
  ];

  //Para cada tipo, cria uma caixa e add no container
  uniqueTypes.forEach((type) => {
    const label = document.createElement("label");
    label.innerHTML = `
            <input type="checkbox" value="${type}" onchange="filterPokemon()"> ${type}
        `;
    typeFilterContainer.appendChild(label);
  });
}

fetchPokemon();