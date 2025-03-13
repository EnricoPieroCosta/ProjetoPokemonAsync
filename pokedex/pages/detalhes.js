// Obtém o ID do Pokémon da URL
const params = new URLSearchParams(window.location.search);
const pokemonId = params.get("id");

// Busca os detalhes do Pokémon
async function fetchPokemonDetails(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = await response.json();

        // Preenche os elementos com os dados do Pokémon
        document.getElementById("pokemon-name").textContent = pokemon.name;
        document.getElementById("pokemon-id").textContent = pokemon.id;
        document.getElementById("pokemon-img").src = pokemon.sprites.front_default;
        document.getElementById("pokemon-types").textContent = pokemon.types.map(t => t.type.name).join(", ");
        document.getElementById("pokemon-weight").textContent = pokemon.weight / 10; // g para kg
        document.getElementById("pokemon-height").textContent = pokemon.height / 10; // dm para m
        document.getElementById("pokemon-abilities").textContent = pokemon.abilities.map(a => a.ability.name).join(", ");

    } catch (error) {
        console.error("Erro ao buscar detalhes do Pokémon:", error);
    }
}

// Chama a função se o ID for válido
if (pokemonId) {
    fetchPokemonDetails(pokemonId);
} else {
    console.error("Nenhum ID de Pokémon encontrado na URL.");
}
