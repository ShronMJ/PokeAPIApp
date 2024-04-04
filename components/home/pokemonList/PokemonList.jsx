import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import styles from './pokemonList.style';
import { COLORS } from '../../../constants';
import PokemonCard from '../../common/cards/PokemonCard';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getPokeID } from '../../../app/redux/fetchSlice';
import { sortPokemon, resetIdList } from '../../../app/redux/fetchSlice';

const PokemonList = () => {
  const dispatch = useDispatch();
  const { filter: filterValue, search: searchValue, sort: sortMode } = useSelector(state => state.textConfig)
  const { fetchData, compileData: idList, error: idError, isLoading } = useSelector(state => state.pokeID)
  const { data: pokemons, error } = useSelector(state => state.pokemons);

  useEffect(() => {
    const fetchIdList = async () => {
      try {
        dispatch(resetIdList())
        filterValue?.Type && dispatch(getPokeID({ filter: "type", value: filterValue.Type }));
        filterValue?.Generation && dispatch(getPokeID({ filter: "generation", value: filterValue.Generation }));
        filterValue?.["Egg Group"] && dispatch(getPokeID({ filter: "egg-group", value: filterValue["Egg Group"] }));
        searchValue && dispatch(getPokeID({ filter: "pokemon", value: searchValue }));

        !filterValue?.Type && !filterValue?.Generation && !filterValue?.["Egg Group"] && !searchValue
          && dispatch(getPokeID({ filter: "pokemon", value: '' }))

      } catch (error) { console.error("Internal error: ", error) }
    };
    fetchIdList();
  }, [searchValue, filterValue.Type, filterValue.Generation, filterValue["Egg Group"]]);

  useEffect(() => {
    const sortValue = pokemons
      .filter(p => fetchData.includes(p.id))
      .map(p => ({ id: p.id, name: p.name, weight: p.weight }));
    dispatch(sortPokemon({ sortMode, sortValue }))

  }, [sortMode, fetchData, pokemons])

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.notyText}>
          {idError.find(e => e.filter === 'pokemon')
            ? `Can't find Pokémon "${idError.find(e => e.filter === 'pokemon').value}"`
            : idList.length > 1
              ? `${idList.length} Pokémons are found`
              : `${idList.length} Pokémon is found`
          }
        </Text>

        <Text style={styles.notyText}>
          {idError.find(e => e.filter === 'type') &&
            `Type "${idError.find(e => e.filter === 'type').value}" is unknown`}
        </Text>
        <Text style={styles.notyText}>
          {idError.find(e => e.filter === 'generation') &&
            `Generation "${idError.find(e => e.filter === 'generation').value}" is none`}
        </Text>
        <Text style={styles.notyText}>
          {idError.find(e => e.filter === 'egg-group') &&
            `Can't find Egg group "${idError.find(e => e.filter === 'egg-group').value}"`}
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading
          ? <ActivityIndicator size="large" color={COLORS.primary} />
          : idList.length > 0
            ? <FlatList
              data={idList}
              renderItem={({ item }) => {
                const pokemon = pokemons.find(p => p?.id === item)
                const err = error.length !== 0 && error.find(p => p.id === item) || null;
                return <PokemonCard pokemon={pokemon} error={err} />
              }}
              keyExtractor={item => `poke-${item}`}
            />
            : <FlatList
              data={pokemons.slice(0, 30)}
              renderItem={({ item }) => {
                const err = error.length !== 0 && error.find(p => p.id === item.id) || null;
                return <PokemonCard pokemon={item} error={err}></PokemonCard>
              }}
              keyExtractor={item => `poke-${item.id}`}
            />
        }
      </View>
    </View>
  )
}
export default PokemonList