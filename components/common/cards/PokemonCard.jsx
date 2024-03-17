import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import styles from './pokemonCard.style'
import { COLORS, images } from '../../../constants';
import { checkImgURL } from '../../../utils/index';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSpecies, resetDesc } from '../../../app/redux/fetchSlice';

const PokemonCard = ({ pokeId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pokemon = useSelector(state => state.pokemons.data.find(p => p.id === pokeId))
  const ddd = useSelector(state => state.pokemonDesc.data)
  console.log("ddd: ",ddd);
  const desc = useSelector(state => {
    const obj = state?.pokemonDesc?.find(p => p.id === pokeId)
    console.log("obj: ", obj);
    return obj ? obj.desc.flavor_text_entries?.[2]?.flavor_text : null;
  })

  const imgGif = pokemon.sprites?.other?.showdown.front_shiny;
  const imgStatic = pokemon.sprites?.front_shiny;
  const type = pokemon.types?.map(p => p.type.name)

  useEffect(() => {
    const getThePokemon = async () => {
      try {
        
        console.log("dispacthced");
      } catch (error) {
        console.error("Internal error: ", error)
      }
    }
    getThePokemon();
  }, [pokemon])

  const number = () => {
    let n = pokemon.id;
    switch (true) {
      case n < 10: return "000" + n.toString();
      case n < 100: return "00" + n.toString();
      case n < 1000: return "0" + n.toString();
      case n >= 1000: return n.toString();
      default: return "Missing Pokemon";
    }
  }
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/pokemon-details/${pokemon.id}`)}
    >
      {!isLoaded
        ? <ActivityIndicator size="small" color={COLORS.primary} />
        : error
          ? <View style={styles.textContainer}>
            <Text style={styles.desc}>{error}</Text>
          </View>
          : (
            <>
              <TouchableOpacity style={styles.imgContainer}>
                <Image
                  source={checkImgURL(imgGif)
                    ? { uri: imgGif }
                    : checkImgURL(imgStatic)
                      ? { uri: imgStatic }
                      : images.noImg
                  }
                  resizeMode='contain'
                  style={styles.img}
                ></Image>
              </TouchableOpacity>

              <View style={styles.textContainer}>
                <Text style={styles.name} numberOfLines={1}>#{number()} {pokemon.name} </Text>
                <Text style={styles.desc}>
                  {desc ? desc : "We know nothing about\nthis Pokémon :("}
                </Text>
              </View>

              <View style={styles.typeContainer}>
                {type?.map(slot => (
                  <View style={styles.typeBox(slot)} key={`type-${slot}`}>
                    <Text style={styles.typeText}>{slot}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
    </TouchableOpacity>
  )
}

export default PokemonCard