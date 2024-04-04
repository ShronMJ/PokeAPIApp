import { pokeIdReducer, pokemonReducer, resetIdList, sortPokemon, getPokeID } from '../app/redux/fetchSlice';
import { configureStore } from '@reduxjs/toolkit';

const previousState = {
    fetchData: [],
    compileData: [47, 13, 65, 84, 29, 91, 38, 5],
    error: []
}
const sortValue = [
    { id: 47, name: 'Parasect', weight: 65.0 },
    { id: 13, name: 'Weedle', weight: 3.2 },
    { id: 65, name: 'Alakazam', weight: 48.0 },
    { id: 84, name: 'Onix', weight: 210.0 },
    { id: 29, name: 'Nidoran (female)', weight: 7.0 },
    { id: 91, name: 'Arbok', weight: 65.0 },
    { id: 38, name: 'Starmie', weight: 80.0 },
    { id: 5, name: 'Charmeleon', weight: 19.0 }
]

const tests = [
    { sortMode: { isAscending: true, mode: "Number" }, expected: [5, 13, 29, 38, 47, 65, 84, 91] },
    { sortMode: { isAscending: false, mode: "Number" }, expected: [91, 84, 65, 47, 38, 29, 13, 5] },
    { sortMode: { isAscending: true, mode: "Name" }, expected: [65, 91, 5, 29, 84, 47, 38, 13] },
    { sortMode: { isAscending: false, mode: "Name" }, expected: [13, 38, 47, 84, 29, 5, 91, 65] },
    { sortMode: { isAscending: true, mode: "Weight" }, expected: [13, 29, 5, 65, 91, 47, 38, 84] },
    { sortMode: { isAscending: false, mode: "Weight" }, expected: [84, 38, 47, 91, 65, 5, 29, 13] },
];

describe("Slice of ID's list", () => {

    it("should reset the ID's list", () => {
        expect(pokeIdReducer(previousState, resetIdList())).toEqual(
            { fetchData: [], error: [], compileData: previousState.compileData }
        )
    })

    it("should sort ID's list by Number ascendingly", () => {
        const { compileData } = pokeIdReducer(previousState,
            sortPokemon({ sortMode: tests[0].sortMode, sortValue }))
        expect(compileData).toEqual(tests[0].expected)
    })

    it("should sort ID's list by Number descendingly", () => {
        const { compileData } = pokeIdReducer(previousState,
            sortPokemon({ sortMode: tests[1].sortMode, sortValue }))
        expect(compileData).toEqual(tests[1].expected)
    })

    it("should sort ID's list by Name ascendingly", () => {
        const { compileData } = pokeIdReducer(previousState,
            sortPokemon({ sortMode: tests[2].sortMode, sortValue }))
        expect(compileData).toEqual(tests[2].expected)
    })

    it("should sort ID's list by Name descendingly", () => {
        const { compileData } = pokeIdReducer(previousState,
            sortPokemon({ sortMode: tests[3].sortMode, sortValue }))
        expect(compileData).toEqual(tests[3].expected)
    })

    it("should sort ID's list by Weight ascendingly", () => {
        const { compileData } = pokeIdReducer(previousState,
            sortPokemon({ sortMode: tests[4].sortMode, sortValue }))
        expect(compileData).toEqual(tests[4].expected)
    })

    it("should sort ID's list by Weight descendingly", () => {
        const { compileData } = pokeIdReducer(previousState,
            sortPokemon({ sortMode: tests[5].sortMode, sortValue }))
        expect(compileData).toEqual(tests[5].expected)
    })
})

describe("getPokeID async thunk", () => {

    it("find, filter, and store the searched ID", async () => {
        const store = setupStore()
        await store.dispatch(getPokeID({ filter: "pokemon", value: "pichu" }))
        expect(store.getState().pokeID.fetchData[0]).toEqual(172);
    })

    it("handle invalid searched ID", async () => {
        const store = setupStore()
        await store.dispatch(getPokeID({ filter: "pokemon", value: "doraemon" }))
        const data = store.getState().pokeID;
        expect(data.fetchData).toEqual([1, 2, 3, 4]);
        expect(data.error).toEqual([{ filter: "pokemon", value: "doraemon" }]);
    })

    it("get the Generation and filter the existing ID", async () => {
        const store = setupStore([1, 2, 3, 152, 153, 154, 200, 400, 401, 700])
        await store.dispatch(getPokeID({ filter: "generation", value: "2" }))
        const data = store.getState().pokeID;
        expect(data.fetchData).toEqual([152, 153, 154, 200]);
    })
})

const setupStore = (setFetchData = [1, 2, 3, 4]) => {
    return configureStore({
        reducer: {
            pokeID: pokeIdReducer,
            pokemons: pokemonReducer,
        },
        preloadedState: { pokeID: { fetchData: setFetchData, error: [] } }
    });
};
