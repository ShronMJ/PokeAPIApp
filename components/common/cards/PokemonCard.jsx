import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from './pokemonCard.style'
import { images } from '../../../constants';
import { checkImgURL } from '../../../utils/index';
import { useRouter } from 'expo-router';
import {  memo } from 'react';

const PokemonCard = memo(function PokemonCard({ pokemon, error }) {
  const router = useRouter();
  const { id, name, imgGif, imgStatic, desc, type } = pokemon ?? {};

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/pokemon-details/${id}`)}
    >
      {error
        ? <View style={styles.textContainer}>
          <Text style={styles.desc}>{error.message}</Text>
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
                testID="pokemon-image"
              ></Image>
            </TouchableOpacity>

            <View style={styles.textContainer}>
              <Text style={styles.name} numberOfLines={1}>#{number(id)} {name} </Text>
              <Text style={styles.desc}>{desc ? desc : "We know nothing about\nthis Pokémon :("}</Text>
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
});

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