import React from 'react'
import { View, Text } from 'react-native'

import styles from './description.style'

const Description = ({ activeTab, pokemon }) => {

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
  const naming = (str) => {
    if (typeof str !== 'string' || str.length === 0) {
      return '';
    }
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <View>
      {activeTab === 'About' && (
        <View style={styles.container}>
          <Text style={styles.intro}>#{number()} {naming(pokemon.name)}</Text>
          <View style={styles.contentBox}>
            <Text style={styles.contextText}>{pokemon.desc}</Text>
          </View>
        </View>)
      }
      {activeTab === 'Description' && (
        <View style={{...styles.container, flexDirection: "row",}}>
          <View style={styles.contentBox}>
            <Text style={styles.intro}>Stat</Text>
            <Text style={{...styles.headText, marginTop: 12}}>Weight: {pokemon.weight}</Text>
            <Text style={styles.headText }>Height: {pokemon.height}</Text>
          </View>


            <View style={styles.contentBox}>
              <Text style={styles.intro}>Abilities</Text>
              <View style={styles.pointsContainer}>
                {pokemon.abilities.map((item, index) => (
                  <View style={styles.pointWrapper} key={item + index}>
                    <View style={styles.pointDot}></View>
                    <Text style={styles.pointText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
        </View>
      )}
    </View>
  )
}

      export default Description;