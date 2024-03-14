import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';

import { Description, Tabs, ScreenHeaderBtn, MainImage } from '../../components';
import { COLORS, icons, SIZES } from '../../constants';
import useFetch from '../../hook/useFetch';

const PokemonDetails = () => {
    const [pokemon, setPokemon] = useState({})
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('About');

    const router = useRouter()
    const fetchData = useFetch();
    const params = useLocalSearchParams();
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch().then(() => { setRefreshing(false) });
    }, []);

    useEffect(() => {
        const getThePokemon = async () => {
            try {
                setIsLoaded(false);
                const { data: pkData } = await fetchData("pokemon", params.id);
                const { data: pkSpecies } = await fetchData("url", pkData.species?.url);
                const imgArt = pkData.sprites?.other?.['official-artwork'].front_shiny;
                const imgStatic = pkData.sprites?.front_shiny;
                const desc = pkSpecies.flavor_text_entries?.[5]?.flavor_text;
                const type = pkData.types?.map(p => p.type.name);
                const abilities = pkData.abilities?.map(a => a.ability.name);

                setPokemon({
                    name: pkData.name,
                    id: pkData.id,
                    desc: desc,
                    type: type,
                    imgArt: imgArt,
                    imgStatic: imgStatic,
                    height: pkData.height,
                    weight: pkData.weight,
                    abilities: abilities
                });
                setError(null)
            } catch (error) {
                setError(error.message)
            } finally {
                setIsLoaded(true);
            }
        }
        getThePokemon();
    }, [])


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.lightWhite },
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    headerLeft: () => (
                        <ScreenHeaderBtn
                            iconUrl={icons.left}
                            dimension={"60%"}
                            handlePress={() => router.back()}
                        ></ScreenHeaderBtn>
                    ),
                    headerRight: () => (
                        <ScreenHeaderBtn
                            iconUrl={icons.share}
                            dimension={"60%"}
                        ></ScreenHeaderBtn>
                    ),
                    headerTitle: ""
                }}
            ></Stack.Screen>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>
            }>
                {!isLoaded ? <ActivityIndicator size="large" color={COLORS.primary} />
                    : error ? <Text>{error.message}</Text> : !pokemon ? <Text>No data available</Text>
                        : <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
                            <MainImage
                                imgArt={pokemon.imgArt}
                                imgStatic={pokemon.static}
                            />
                            <Tabs
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            ></Tabs>
                            <Description
                                activeTab={activeTab}
                                pokemon={pokemon}
                            />
                        </View>
                }
            </ScrollView>
        </SafeAreaView>

    )
}
export default PokemonDetails;