
import { View, Text, ActivityIndicator } from 'react-native';
import styles from './pokemonList.style';
import { COLORS } from '../../../constants';
import PokemonCard from '../../common/cards/PokemonCard';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getPokemon, getPokeID, getSpecies, resetPokemonList } from '../../../app/redux/fetchSlice';
import { sortPokemon, resetIdList } from '../../../app/redux/fetchSlice';

const PokemonList = () => {
  const dispatch = useDispatch();
  const { filter: filterValue, search: searchValue, sort: sortMode } = useSelector(state => state.textConfig)
  const { data: idList, error: idError } = useSelector(state => state.pokeID)
  const pokemons = useSelector(state => state.pokemons.data);

  useEffect(() => {
    const fetchIdList = async () => {
      try {
        dispatch(resetIdList())
        dispatch(resetPokemonList());

        filterValue?.Type && dispatch(getPokeID({ filter: "type", value: filterValue.Type }));
        filterValue?.Generation && dispatch(getPokeID({ filter: "generation", value: filterValue.Generation }));
        filterValue?.["Egg Group"] && dispatch(getPokeID({ filter: "egg-group", value: filterValue["Egg Group"] }));
        searchValue && dispatch(getPokeID({ filter: "pokemon", value: searchValue }));

        !filterValue?.Type && !filterValue?.Generation && !filterValue?.["Egg Group"] && !searchValue && dispatch(getPokeID({ filter: "pokemon" }))
      } catch (error) { console.error("Internal error: ", error) }
    };
    fetchIdList();
  }, [searchValue, filterValue?.Type, filterValue?.Generation, filterValue?.["Egg Group"]]);

  useEffect(() => {
    if (Object.keys(pokemons).length === 0) return;
    const sortValue = Object.keys(pokemons).map(key => {
      return { id: key, name: pokemons[key].info.name, weight: pokemons[key].info.weight 
      }})
    dispatch(sortPokemon({ sortMode, sortValue}))
  }, [sortMode])


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
          : idList?.map((p) => (
            <PokemonCard
              pokeId={p}
              key={`poke-${p}`}
            ></PokemonCard>
          ))
        }
      </View>
    </View>
  )
}
export default PokemonList

