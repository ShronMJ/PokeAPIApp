import { useState } from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { Stack } from 'expo-router';
import { COLORS, icons, images, SIZES } from '../constants';
import { PokemonList, ScreenHeaderBtn, Welcome } from '../components';

export default function Home() {
  return (
      <App />
  );
}

const App = () => {
  const [textConfig, setTextConfig] = useState({
    search: "",
    sort: "Number",
    filter: {
      Type: "",
      Generation: '',
      "Egg Group": ""
    }
  })

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.bluewhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={images.profile} dimension="100%" />
          ),
          headerTitle: ""
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: SIZES.medium }}>
          <Welcome
            textConfig={textConfig}
            setTextConfig={setTextConfig}
          />
          <PokemonList
            textConfig={textConfig}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
