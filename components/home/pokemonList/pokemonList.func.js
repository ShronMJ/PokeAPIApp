//get Pokemon Id from their url----------------------------------------------------------------------------
function getIdList(filter, data) {
  let urlList = [];
  switch (filter) {
    case "type":
      urlList = data?.pokemon?.map(p => p.pokemon.url) || [];
      break;
    case "initial":
      urlList = data.results?.map(p => p.url) || [];
      break;
    default:
      urlList = data?.pokemon_species?.map(p => p.url) || [];
      break;
  }
  const idList = urlList.map(url => {
    const parts = url?.split('/');
    return parts[parts?.length - 2]
  });

  return idList;
}

//comparing array function--------------------------------------------------------------
function getCommonPokemon(initialList, ...filteredList) {

  const nonNullList = filteredList.filter(list => list.length > 0);
  if (nonNullList === undefined || nonNullList.length === 0 || nonNullList === null) {
    return initialList
  }
  const firstList = nonNullList.shift();
  const finalList = firstList.filter(element =>
    nonNullList.every(array => array.includes(element))
  );
  return finalList
}

//Compile error----------------------------------------------------------------------------
function compileError(initialListErr, searchErr, typeErr, genErr, eggErr, listOfErrorsMessage) {
  return {
    initial: initialListErr,
    search: searchErr,
    type: typeErr,
    gen: genErr,
    egg: eggErr,
    listOfMessage: listOfErrorsMessage
  }
}

//Sorting function-------------------------------------------------------------------
function sortPokemon(pokemons, errors, sortMethod) {
  if (!pokemons) return [];
  const combined = pokemons.map((p, index) => ({
    pokemon: p,
    error: errors[index]
  }))
  switch (sortMethod) {
    case "Name":
      return combined.sort((a, b) =>  (a.pokemon.name || '').localeCompare(b.pokemon.name || '') )
    case "Number":
      return combined.sort((a, b) =>  (a.pokemon.id || 0) - (b.pokemon.id || 0) )
    case "Weight":
      return combined.sort((a, b) =>  (a.pokemon.weight || 0) - (b.pokemon.weight || 0) )
    default:
      return [];
  }
}

export { getCommonPokemon, compileError, sortPokemon, getIdList }
