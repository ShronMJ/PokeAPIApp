import { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, Image, FlatList, TextInput } from 'react-native'
import styles from './welcome.style';
import { COLORS, icons, SIZES } from '../../../constants';

const SortBy = ["Name", "Number", "Weight"];
const keyValFilter = ['Type', 'Generation', "Egg Group"];
const filterPlaceholder = {
  Type: "Try poison, rock, or dragon",
  Generation: "Try 1, 2, 3, 4, 5, 6, 7, 8, or 9",
  "Egg Group": "Try monster, water1, or bug"
};

const Welcome = ({ textConfig, setTextConfig }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState({ Type: "", Generation: "", "Egg Group": "" })
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.welcomeMessage}>Pokemon List</Text>
        <Text style={styles.userName}>Find the Pokemon</Text>
      </View>
      {/** Search function -------------------------------------------------------------------------------------*/}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={(text) => { setSearchTerm(text) }}
            placeholder={"Type the Pokémon's name"}
            placeholderTextColor={COLORS.gray}
            onSubmitEditing={() => {
              setTextConfig({ ...textConfig, search: searchTerm });
            }}
          />
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={() => {
          setTextConfig({ ...textConfig, search: searchTerm });
        }}
        >
          <Image
            source={icons.search}
            resizeMode='contain'
            style={styles.searchBtnImage}
          ></Image>
        </TouchableOpacity>
      </View>

      {/**The sort function----------------------------------------------------------------------------------*/}
      <View style={styles.sortFilter}>
        <Text style={[styles.filterTitle, { paddingRight: SIZES.xSmall }]}>Sort by (Ascending): </Text>

        <FlatList
          data={SortBy}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tab(textConfig.sort, item)}
              onPress={() => { setTextConfig({ ...textConfig, sort: item }); }}
            >
              <Text style={styles.tabText(textConfig.sort, item)}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
          contentContainerStyle={{ columnGap: SIZES.small }}
          horizontal
        ></FlatList>

        <TouchableOpacity onPress={() => { setIsModalVisible(!isModalVisible) }}>
          <Text style={styles.filterTitle}>Filter Search</Text>
        </TouchableOpacity>

        {/**Popup for filtering -------------------------------------------------------------------------------*/}
        <Modal
          visible={isModalVisible}
          onRequestClose={() => { setIsModalVisible(!isModalVisible) }}
          animationType='fade'
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>

              <View style={styles.filterTop}>
                <Text style={styles.filterTitle}>Search Pokémon by their</Text>
                <TouchableOpacity onPress={() => {
                  setIsModalVisible(!isModalVisible)
                  setTextConfig({ ...textConfig, filter: filterMode })
                }}>
                  <Text style={styles.filterClose}>Apply & Close</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setTextConfig({ ...textConfig, filter: {} })
                  setFilterMode({ Type: "", Generation: "", "Egg Group": "" })
                }}
                style={styles.filterOptionContainer}
              >
                <Text style={styles.filterOption(textConfig.filter, {})}>Clear filter</Text>
              </TouchableOpacity>

              <FlatList
                data={keyValFilter}
                renderItem={({ item }) => (
                  <View style={styles.filterOptionContainer} >
                    <Text style={styles.filterOption(filterMode[item])}>{item}</Text>
                    <TextInput
                      style={styles.searchInput}
                      value={filterMode[item]}
                      onChangeText={(text) => { setFilterMode({ ...filterMode, [item]: text }) }}
                      placeholder={filterPlaceholder[item]}
                      placeholderTextColor={COLORS.gray}
                    ></TextInput>
                  </View>
                )}
                keyExtractor={item => item}
                contentContainerStyle={{ columnGap: SIZES.small }}
                vertical
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}

export default Welcome