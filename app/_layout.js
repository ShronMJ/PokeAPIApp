import { Stack } from "expo-router";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { COLORS, icons, images } from '../constants';
import { ScreenHeaderBtn } from '../components';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const [fontsLoaded] = useFonts({
        DMBold: require('../assets/fonts/DMSans-Bold.ttf'),
        DMMedium: require('../assets/fonts/DMSans-Medium.ttf'),
        DMRegular: require('../assets/fonts/DMSans-Regular.ttf')
    })

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) await SplashScreen.hideAsync();
    }, [fontsLoaded])


    if (!fontsLoaded) return null;
    return <Stack
        onLayout={onLayoutRootView}
        initialRouteName="index"
        screenOptions={{
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTitle: ""
        }}
    />
}