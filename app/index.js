import { View, ScrollView, SafeAreaView } from "react-native";
import { COLORS, SIZES, icons, images } from '../constants';
import { PokemonList, Welcome, ScreenHeaderBtn } from '../components';
import { Provider } from "react-redux";
import store from "./redux/store";
import { Stack } from "expo-router";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
          <Stack.Screen
            options={{
              headerStyle: { backgroundColor: COLORS.bluewhite },
              headerLeft: () => (<ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />),
              headerRight: () => (<ScreenHeaderBtn iconUrl={images.profile} dimension="100%" />),
            }}
          />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, padding: SIZES.medium }}>
            <Welcome />
            <PokemonList />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
}
