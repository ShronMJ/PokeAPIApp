import { configureStore } from "@reduxjs/toolkit";
import {pokeIdReducer, pokemonReducer, pokemonDetailReducer} from "./fetchSlice";
import texConfigReducer from "./textSlice";



//thunk and devtool extension is included by default
const store = configureStore({
    reducer: {
        pokeID: pokeIdReducer,
        pokemons: pokemonReducer,
        pokemonDesc: pokemonDetailReducer,
        texConfig: texConfigReducer

    }

});
export default store;