
import { View, Text, ActivityIndicator } from 'react-native';
import styles from './pokemonList.style';
import { COLORS } from '../../../constants';
import PokemonCard from '../../common/cards/PokemonCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getPokemon, getPokeID, getSpecies } from '../../../app/redux/fetchSlice';
import { sortPokemon } from '../../../app/redux/fetchSlice';

const PokemonList = () => {
  const dispatch = useDispatch();
  const filterValue = useSelector(state => state.texConfig.filter)
  const searchValue = useSelector(state => state.texConfig.search)
  const sortValue = useSelector(state => state.texConfig?.sort)
  const idList = useSelector(state => state.pokeID.data)
  const pokemons = useSelector(state => state.pokemons.data)
  const idError = useSelector(state => state.pokeID.error)
  // console.log("filterValue: ", filterValue)
  // //console.log("searchValue: ", searchValue)
  // console.log("sortValue: ", sortValue)
  //console.log("pokemons: ", pokemons)
  // console.log("idList: ", idList)
  useEffect(() => {


    const fetchPokemonList = async () => {
      try {
        filterValue.Type &&
          dispatch(getPokeID({ filter: "type", value: filterValue.Type }));
        filterValue.Generation &&
          dispatch(getPokeID({ filter: "generation", value: filterValue.Generation }));
        filterValue["Egg Group"] &&
          dispatch(getPokeID({ filter: "egg-group", value: filterValue["Egg Group"] }));
        searchValue &&
          dispatch(getPokeID({ filter: "pokemon", value: searchValue }));

        !filterValue.Type && !filterValue.Generation && !filterValue["Egg Group"] && !searchValue
          && dispatch(getPokeID({ filter: "pokemon" }))


      } catch (error) {
        console.error("Internal error: ", error)
      }
    };
    fetchPokemonList();
  }, [searchValue, filterValue.Type, filterValue.Generation, filterValue["Egg Group"]]);

  useEffect(() => {
    if (idList) {
      dispatch(getPokemon(idList)); // Fetch Pokémon data
    }
  }, [idList]);

  useEffect(() => {
    console.log("pokemon speci: ", pokemons);
    if (pokemons.length > 0) {
      const id_url = pokemons.map(p => ({ id: p.id, url: p.species.url }));
      dispatch(getSpecies(id_url)); // Fetch species data
    }
  }, [pokemons]);

  // useEffect(() => {
  //   dispatch(sortPokemon(sortValue))
  // }, [sortValue])

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.notyText}>
          {idList?.length &&
            (idList?.length < 1 && "No Pokémon is found") ||
            (idList?.length > 1 && `${idList.length} Pokémons are found`) ||
            (idList?.length === 1 && `${idList.length} Pokémon is found`) ||
            (idError?.pokemon && `Cannot find Pokémon named "${searchValue}"`)}
        </Text>

        <Text style={styles.notyText}>
          {idList?.type && `Type "${filterValue.Type}" is unknown`}
        </Text>
        <Text style={styles.notyText}>
          {idList?.generation && `Generation "${filterValue.Generation}" is none`}
        </Text>
        <Text style={styles.notyText}>
          {idList?.["Egg Group"] && `Can't find Egg group "${filterValue["Egg Group"]}"`}
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {useSelector(s => s.pokeID.isLoading)
          ? <ActivityIndicator size="large" color={COLORS.primary} />
          : pokemons?.map((p) => (
            <PokemonCard
              pokeId={p?.id}
              key={`poke-${p?.id}`}
            ></PokemonCard>
          ))
        }
      </View>
    </View>
  )
}
export default PokemonList
