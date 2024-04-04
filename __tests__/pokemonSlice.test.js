import { configureStore } from '@reduxjs/toolkit';
import { pokemonReducer, pokeIdReducer, getPokemon } from '../app/redux/fetchSlice';

describe('getPokemon async thunk', () => {

    it('fetch and adds pokemon to the state', async () => {
        const store = setupStore([])
        await store.dispatch(getPokemon(10));
        const pokemons = store.getState().pokemons.data;
        expect(pokemons.length).toBe(1);
        const pokemon = pokemons[0];
        expect(pokemon.id).toBe(10);
    });

    it('fetch and adds another pokemon to the state', async () => {
        const store = setupStore([{ id: 11 }, { id: 12 }])
        await store.dispatch(getPokemon(13));
        const pokemons = store.getState().pokemons.data;
        expect(pokemons.length).toBe(3);
    });

    it('does not fetch and add the existing pokemon', async () => {
        const store = setupStore([{ id: 11 }, { id: 12 }])
        await store.dispatch(getPokemon(12));
        const pokemons = store.getState().pokemons.data;
        expect(pokemons.length).toBe(2);
    });

});

const setupStore = data => {
    return configureStore({
        reducer: {
            pokeID: pokeIdReducer,
            pokemons: pokemonReducer,
        },
        preloadedState: { pokemons: { data, error: [] } }
    })
}