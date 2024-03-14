
import { View, Text, ActivityIndicator } from 'react-native';
import { getCommonPokemon, compileError, sortPokemon, getIdList } from './pokemonList.func';
import styles from './pokemonList.style';
import { COLORS } from '../../../constants';
import PokemonCard from '../../common/cards/PokemonCard';
import useFetch from '../../../hook/useFetch';
import { useEffect, useState } from 'react';

const PokemonList = ({ textConfig }) => {
  const fetchData = useFetch();
  const [pokemons, setPokemons] = useState([])
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        setIsLoaded(false);
        const initialList = await fetchData("pokemonList");
        const searchData = await fetchData("pokemon", textConfig.search);
        const typeData = await fetchData("type", textConfig.filter.Type);
        const genData = await fetchData("generation", textConfig.filter.Generation);
        const eggData = await fetchData("egg-group", textConfig.filter["Egg Group"]);

        const initialId = getIdList('initial', initialList.data);
        const searchedId = searchData.data.id ? [searchData.data.id.toString()] : [];
        const typeId = getIdList('type', typeData.data);
        const genId = getIdList('generationData', genData.data);
        const eggId = getIdList('eggGroupData', eggData.data);

        const pokemonList = getCommonPokemon(initialId, typeId, genId, eggId, searchedId);
        const allPokemonsData = await Promise.all(pokemonList.map(async id => await fetchData("pokemon", id)))
        const allPokemons = allPokemonsData.map(array => array.data);
        const listOfErrorsMessage = allPokemonsData.map(array => array.error?.message);

        const fetchError = compileError(
          initialList.error,
          searchData.error,
          typeData.error,
          genData.error,
          eggData.error,
          listOfErrorsMessage
        );

        setPokemons(allPokemons);
        setError(fetchError);

      } catch (error) {
        console.error("Internal error: ", error)
        setError(error.message);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchPokemonList();
  }, [textConfig.search, textConfig.filter.Type, textConfig.filter.Generation, textConfig.filter["Egg Group"]]);
  useEffect(() => {
    const pokemonError = sortPokemon(pokemons, error?.listOfMessage, textConfig.sort);
    const pokemon = pokemonError.map(p => p.pokemon)
    const err = pokemonError.map(p => p.error)
    setPokemons(pokemon);
    setError({ ...error, listOfMessage: err });
  }, [textConfig.sort])
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.notyText}>
          {error?.type && error?.gen && error?.egg
            ? error?.type === 404 && error?.gen === 404 && error?.egg === 404
              ? "No Pokémon is found"
              : `Type Error: ${error.type}, Generation Error: ${error.gen}, Egg Group Error: ${error.egg}` 
            : error?.search
              ? `Cannot find Pokémons named "${textConfig.search}"`
              : pokemons.length > 1
                ? pokemons.length + " Pokémons are found"
                : pokemons.length + " Pokémon is found"
          }
        </Text>
        <Text style={styles.notyText}>
          {error?.type && `Type "${textConfig.filter.Type}" is unknown`}
        </Text>
        <Text style={styles.notyText}>
          {error?.gen && `Generation "${textConfig.filter.Generation}" is none`}
        </Text>
        <Text style={styles.notyText}>
          {error?.egg && `Can't find Egg group "${textConfig.filter["Egg Group"]}"`}
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {!isLoaded
          ? <ActivityIndicator size="large" color={COLORS.primary} />
          : pokemons.map((p) => (
            error.listOfMessage[p]
              ? <Text>{error.listOfMessage[p]}</Text>
              : <PokemonCard
                pokemon={p}
                key={`poke-${p.id}`}
              ></PokemonCard>
          ))
        }
      </View>
    </View>
  )
}
export default PokemonList
