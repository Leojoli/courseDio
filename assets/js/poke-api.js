const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) =>{
    return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset, limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}$limit=${limit}`
    return fetch(url)
    .then((response) => response.json())
    .then((jsonaody) => jsonaody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails)
}


// ------------------------ Detalhe do pokemon ----------------------//
const pokeApiModal = {}

function dividir(valor) {
    const result  = valor / 10 
    const textRes = result.toString().length

    if (textRes === 1) {
       return "0." + result
    }  else if(textRes === 2 ){
        return result + ".0"
    }else if(textRes === 3 ){
        return result + ".0"
    } else{
        return result
    }
    
}

function converPokeApiDetailPokemonModal(pokemonModal){
    const pokemonModals = new PokemonModal()
    pokemonModals.number = pokemonModal.id
    pokemonModals.name = pokemonModal.name
    const types = pokemonModal.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemonModals.types = types
    pokemonModals.type = type
    pokemonModals.photo = pokemonModal.sprites.other.dream_world.front_default
    const stats = pokemonModal.stats.map((statSlots) => statSlots.stat.name)
    pokemonModals.stats = stats
    const stat = pokemonModal.stats.map((statSlots) => statSlots.base_stat)
    pokemonModals.stat = stat
    const abilities = pokemonModal.abilities.map((abilitiesSlots) => abilitiesSlots.ability.name)
    const [ability] = abilities
    pokemonModals.abilities  = ability
    pokemonModals.weight = dividir(pokemonModal.weight)
    pokemonModals.height = dividir(pokemonModal.height)    
    pokemonModals.photo = pokemonModal.sprites.other.home.front_default
    return pokemonModals
}

pokeApiModal.getModalPokemon = (number) => {
    const urlModal = `https://pokeapi.co/api/v2/pokemon/${number}` 
    return fetch(urlModal)
    .then((response) => response.json())
    .then((jsonModalPoke) => jsonModalPoke)
    .then((pokemonModal) => converPokeApiDetailPokemonModal(pokemonModal))
}