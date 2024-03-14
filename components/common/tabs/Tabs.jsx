import React from 'react'
import { View, Text ,TouchableOpacity, FlatList} from 'react-native'

import styles from './tabs.style'
import { SIZES } from '../../../constants'

const TabButton = ({name, activeTab, onClicking}) => (
  <TouchableOpacity
    style={styles.btn(name, activeTab)}
    onPress={onClicking}
    >
    <Text style={styles.btnText(name,activeTab)}>{name}</Text>
  </TouchableOpacity>
)

const Tabs = ({ activeTab, setActiveTab}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={["About", "Description"]}
        renderItem={ ({item}) =>(
          <TabButton
            name={item}
            activeTab={activeTab}
            onClicking={() => setActiveTab(item)}
          ></TabButton>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        key={["About", "Description"]}
        contentContainerStyl={{columnGap:SIZES.small/2}}
      ></FlatList>
    </View>
  )
}

export default Tabs