import { View, ScrollView, SafeAreaView } from "react-native";
import { Stack } from 'expo-router';
import { COLORS, icons, images, SIZES } from '../constants';
import { PokemonList, ScreenHeaderBtn, Welcome } from '../components';
import { Provider } from "react-redux";
import store from "./redux/store";
import { useSelector } from "react-redux";

export default function Home() {
  return (
    <Provider store={store}>
      <App />
    </Provider>

  );
}

const App = () => {
  // const texConfig = useSelector(state => state.texConfig)
  // console.log("text config: ", texConfig); //print "Number"
  // // const pokemons = useSelector(state => state.pokemons)
  // // console.log("pokemons: ", pokemons);
  // const list = useSelector(state => state.pokeID)
  // console.log("pokemonList: ", list);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.bluewhite },
          headerShadowVisible: false,
          headerLeft: () => (<ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />),
          headerRight: () => (<ScreenHeaderBtn iconUrl={images.profile} dimension="100%" />),
          headerTitle: ""
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: SIZES.medium }}>
          <Welcome />
          <PokemonList />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
