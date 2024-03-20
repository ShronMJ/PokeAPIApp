import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import styles from './pokemonCard.style'
import { COLORS, images } from '../../../constants';
import { checkImgURL } from '../../../utils/index';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPokemon, getSpecies, resetDesc } from '../../../app/redux/fetchSlice';

const PokemonCard = ({ pokeId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pokemon = useSelector(state => state.pokemons.data[pokeId])
  const error = useSelector(state => state.pokemons.error[pokeId])
  const isLoading = useSelector(state => state.pokemons.isLoading[pokeId]);
  const sortMode = useSelector(state => state.textConfig.sort);

  const [desc, setDesc] = useState('');
  const [isDescLoading, setIsDescLoading] = useState(false);

  useEffect(() => {
    pokeId && dispatch(getPokemon(pokeId))
  }, [pokeId])

  useEffect(() => {
    const getDesc = () => {
      const textList = pokemon?.species.flavor_text_entries || null;
      if (!textList) return ''
      const shuffledList = textList.slice().sort(() => Math.random() - 0.5);
      const text = shuffledList ? shuffledList.find(t => t.language.name === "en") : '';
      return text?.flavor_text;
    };
    setIsDescLoading(true);
    setDesc(getDesc());
    setIsDescLoading(false);
  }, [pokemon, sortMode])

  const name = pokemon?.info.name
  const imgGif = pokemon?.info.sprites?.other?.showdown.front_shiny
  const imgStatic = pokemon?.info.sprites?.front_shiny
  const type = pokemon?.info.types?.map(p => p.type.name)



  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/pokemon-details/${pokeId}`)}
    >
      {isLoading
        ? <ActivityIndicator size="small" color={COLORS.primary} />
        : error
          ? <View style={styles.textContainer}>
            <Text style={styles.desc}>{err.message}</Text>
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
                <Text style={styles.name} numberOfLines={1}>#{number(pokeId)} {name} </Text>
                {isDescLoading
                  ? <ActivityIndicator size={15} color={COLORS.primary} />
                  : <Text style={styles.desc}>
                      {desc ? desc : "We know nothing about\nthis Pokémon :("}
                    </Text>
                }

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




const number = (id) => {
  let n = id;
  switch (true) {
    case n < 10: return "000" + n.toString();
    case n < 100: return "00" + n.toString();
    case n < 1000: return "0" + n.toString();
    case n >= 1000: return n.toString();
    default: return "Missing Pokemon";
  }
}