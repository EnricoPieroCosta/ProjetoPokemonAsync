const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=151";
let allPokemon = [];

async function fetchPokemon() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const pokemonPromises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        allPokemon = await Promise.all(pokemonPromises);
        displayPokemon(allPokemon);
    } catch (error) {
        console.error("Erro ao buscar os Pokémon:", error);
    }
}

function displayPokemon(pokemonList) {
    const container = document.getElementById("pokemon-container");
    container.innerHTML = "";
    
    pokemonList.forEach(pokemon => {
        const pokemonDiv = document.createElement("div");
        pokemonDiv.classList.add("pokemon");
        pokemonDiv.innerHTML = `
            <h3>${pokemon.name.toUpperCase()}</h3>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        `;
        container.appendChild(pokemonDiv);
    });
}

function filterPokemon() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const filtered = allPokemon.filter(pokemon => pokemon.name.includes(searchTerm));
    displayPokemon(filtered);
}

fetchPokemon();