import { View, SafeAreaView, ScrollView } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import store from '../redux/store';
import { Description, Tabs, ScreenHeaderBtn, MainImage } from '../../components';
import { COLORS, icons, SIZES } from '../../constants';

const PokemonDetails = () => {
    const [activeTab, setActiveTab] = useState('About');
    const router = useRouter()
    const params = useLocalSearchParams();

    const pokemon = store.getState().pokemons.data.find(p => p.id === parseInt(params.id))
    const { id, name, imgArt, imgStatic, desc, weight, height, abilities } = pokemon;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <Stack.Screen
            
                options={{
                    headerStyle: { backgroundColor: COLORS.lightWhite },
                    headerLeft: () => (
                        <ScreenHeaderBtn
                            iconUrl={icons.left}
                            dimension={"60%"}
                            handlePress={() => router.back()}
                        />
                    ),
                    headerRight: () => (
                        <ScreenHeaderBtn
                            iconUrl={icons.share}
                            dimension={"60%"}
                        />
                    ),
                }}
            ></Stack.Screen>
            <ScrollView showsVerticalScrollIndicator={false} >
                {<View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
                    <MainImage
                        imgArt={imgArt}
                        imgStatic={imgStatic}
                    />
                    <Tabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    ></Tabs>
                    <Description
                        activeTab={activeTab}
                        pokemon={{
                            id: id,
                            name: name,
                            desc: desc,
                            weight: weight,
                            height: height,
                            abilities: abilities,
                        }}

                    />
                </View>
                }
            </ScrollView>
        </SafeAreaView>
    )
}
export default PokemonDetails;