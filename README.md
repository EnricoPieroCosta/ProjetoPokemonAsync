# ProjetoPokemonAsync

## Foram definidos as principais funcionalidades do site e que API iriamos usar. Depois de definirmos isso decidimos separar em features o que cada um iria fazer e criamos o repositório do projeto e colocamos a mão na massa.

## Dividimos em três principais features:
- Batalha
- Advinha
- Pokedex

## A batalha é constituida por um pokemon que você escolhe e um sorteado aleatoriamente ai é sorteado os golpes do pokemon escolhido pelo usuário e tambem pelo sorteado. Então a luta da inicio com cada um fazendo um ataque até o outro até um deles zerar a vida do outro.

## O advinha é constituido por um pokemon que é sorteado aleatoriamente e o usuário deve acertar por um input com o número de caixas sendo o número de letras do nome, existe uma lógica para fornecer dicas sendo a letra que você acertar já fica verde e facilita advinhar

## Documentação do Código - Pokédex

## Resumo
Este código cria uma Pokédex interativa que consome a PokéAPI para listar 1010 Pokémons. Ele permite filtrar por nome, tipo, geração e ordenar os Pokémons de diferentes formas. O sistema utiliza funções assíncronas para obter os dados e exibi-los dinamicamente na interface do usuário.

## Funcionamento das Funções Assíncronas

### 1. **Chamo a função principal `fetchPokemon()` que busca todos os Pokémons da API**
- A função `fetchPokemon()` é assíncrona porque faz requisições HTTP para obter dados externos.
- Primeiro, faz uma requisição para `API_URL` usando `fetch()`, que retorna uma `Promise`.
- Usamos `await` para esperar a resposta antes de continuar.
- Convertendo a resposta para JSON também utilizamos `await`.

```javascript
const response = await fetch(API_URL);
const data = await response.json();
```

### 2. **Faço uma nova requisição para cada Pokémon na lista**
- O array `data.results` contém URLs individuais para cada Pokémon.
- Com `map()`, criamos um array de Promises onde cada Pokémon faz uma requisição para sua própria URL.
- Usamos `Promise.all()` para esperar todas as requisições terminarem antes de prosseguir.

```javascript
allPokemon = await Promise.all(
  data.results.map(async (poke) => {
    const pokeData = await fetch(poke.url).then((res) => res.json());
    return {
      id: pokeData.id,
      name: pokeData.name,
      sprite: pokeData.sprites.front_default,
      types: pokeData.types.map((t) => t.type.name),
      height: pokeData.height,
      generation: getGeneration(pokeData.id),
    };
  })
);
```

### 3. **Mostro os Pokémons na tela**
- Assim que os dados estão carregados, chamamos `mostraPokemon(allPokemon)` para exibir os Pokémons na interface.

```javascript
mostraPokemon(allPokemon);
```

### 4. **Defino todos os checkboxes com os tipos disponíveis**
- `populateFilters()` é chamado para preencher dinamicamente os filtros baseando-se nos tipos obtidos.

```javascript
populateFilters();
```

## Outras Funções Relacionadas

### `mostraPokemon(pokemonList)`
- **Objetivo**: Renderizar a lista de Pokémons na tela.
- **Fluxo**:
  1. Limpa o container de Pokémons.
  2. Para cada Pokémon, cria um elemento `<div>` com sua imagem, nome e tipos.
  3. Adiciona um evento de clique que leva para uma página de detalhes.
  4. Adiciona o elemento ao container principal.

### `filterPokemon()`
- **Objetivo**: Filtrar e ordenar os Pokémons com base nos filtros de nome, tipo e geração.
- **Fluxo**:
  1. Obtém o texto de busca e os filtros de tipo e geração.
  2. Filtra os Pokémons que correspondem aos critérios.
  3. Ordena a lista conforme a opção selecionada.
  4. Atualiza a exibição chamando `mostraPokemon()`.

### `getGeneration(id)`
- **Objetivo**: Determinar a geração de um Pokémon com base no ID.
- **Fluxo**:
  1. Verifica o ID do Pokémon e retorna a geração correspondente.

### `getSelectedTypes()`
- **Objetivo**: Obter os tipos de Pokémon selecionados pelo usuário.
- **Fluxo**:
  1. Percorre os checkboxes de filtro de tipo.
  2. Retorna um array com os tipos marcados.

### `populateFilters()`
- **Objetivo**: Preencher dinamicamente os filtros de tipo com base nos Pokémons carregados.
- **Fluxo**:
  1. Coleta todos os tipos existentes na lista de Pokémons.
  2. Cria checkboxes para cada tipo.
  3. Adiciona eventos para atualizar os resultados ao selecionar filtros.

### `fetchPokemon()` (Chamada inicial)
- **Objetivo**: Inicia a aplicação carregando os Pokémons assim que a página é aberta.
