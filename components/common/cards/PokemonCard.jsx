import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import styles from './pokemonCard.style'
import { COLORS ,images} from '../../../constants';
import { checkImgURL } from '../../../utils/index';
import { useRouter } from 'expo-router';
import useFetch from '../../../hook/useFetch';
import { useEffect, useState } from 'react';


const PokemonCard = ({ pokemon }) => {
  const router = useRouter();
  const [pokemonDetail, setPokemonDetail] = useState({ desc: '', type: [], imgGif: '', imgStatic: '' })
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false);
  const fetchData = useFetch();
  
  useEffect(() => {
    const getThePokemon = async () => {
      try {
        setIsLoaded(false);
        const { data: pokemonSpecies, error: error } = await fetchData("url", pokemon.species?.url);
        const imgGif = pokemon.sprites?.other?.showdown.front_shiny;
        const imgStatic = pokemon.sprites?.front_shiny;
        const desc = pokemonSpecies.flavor_text_entries?.[2]?.flavor_text;
        const type = pokemon.types?.map(p => p.type.name)

        setPokemonDetail({
          desc: desc,
          type: type,
          imgGif: imgGif,
          imgStatic: imgStatic,
        });
        setError(error?.message)

      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoaded(true);
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
                  source={checkImgURL(pokemonDetail.imgGif)
                    ? {uri: pokemonDetail.imgGif}
                    : checkImgURL(pokemonDetail.imgStatic)
                      ? {uri: pokemonDetail.imgStatic}
                      : images.noImg
                  }
                  resizeMode='contain'
                  style={styles.img}
                ></Image>
              </TouchableOpacity>

              <View style={styles.textContainer}>
                <Text style={styles.name} numberOfLines={1}>#{number()} {pokemon.name} </Text>
                <Text style={styles.desc}>
                  {pokemonDetail.desc
                    ? pokemonDetail.desc
                    : "We know nothing about\nthis Pokémon :("
                  }
                </Text>
              </View>

              <View style={styles.typeContainer}>
                {pokemonDetail.type?.map(slot => (
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