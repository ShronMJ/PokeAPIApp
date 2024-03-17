import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { isLoading } from 'expo-font';


export const getPokemon = createAsyncThunk('pokemon/getPokemon', async (idList) => {
    const response = await Promise.all(idList.map(async id => await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)))
    const resData = await Promise.all(response.map(r => r.json()));
    //console.log("resData: ", resData);
    return resData;
})

export const getPokeID = createAsyncThunk('idList/getPokeID', async ({ filter, value }) => {
    if(!value) value = '';
    const response = await fetch(`https://pokeapi.co/api/v2/${filter}/${value}`);
    const resData = await response.json();
    const urlList = (() => {
        switch (filter) {
            case "type":
                return resData?.pokemon?.map(p => p.pokemon.url) || [];
            case "pokemon":
                return resData?.results?.map(p => p.url) || [];
            default:
                return urlList = resData?.pokemon_species?.map(p => p.url) || [];
        }
    })();
    const idList = urlList.map(url => {
        const parts = url?.split('/');
        return parts[parts?.length - 2]
    });
    return {idList, filter};
})

export const getSpecies = createAsyncThunk('pokemonDetail/species', async (id_url) => {
    console.log("id_url: ", id_url);
    const response = await Promise.all(id_url.map(async p => await fetch(p.url)));
    const desc = await Promise.all(response.map(r => r.json()))
    return {id :id_url.id, desc: desc};
})

const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState: {
        isLoading: false,
        data: [],
        error: null
    },
    reducers: {
        resetPokemonList: (state) => {
            state.error = null;
            state.data = [];
            state.isLoading = false;
        },
        sortPokemon: (state, action) => {
            switch (action) {
                case "Name":
                    state.data = state.data.sort((a, b) => (
                        a.pokemon.name || '').localeCompare(b.pokemon.name || ''))
                    break;
                case "Number":
                    state.data = state.data.sort((a, b) => (
                        a.pokemon.id || 0) - (b.pokemon.id || 0))
                    break;
                case "Weight":
                    state.data = state.data.sort((a, b) => (
                        a.pokemon.weight || 0) - (b.pokemon.weight || 0))
                    break;
                default:
                    return state.data;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPokemon.pending, (state) => {
            state.isLoading = true;
            state.error = null
        })
        builder.addCase(getPokemon.fulfilled, (state, action) => {
            
            state.isLoading = false;
            state.data.push(action.payload);
            state.error = null
        })
        builder.addCase(getPokemon.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        })
    }
})

const pokeIDSlice = createSlice({
    name: 'idList',
    initialState: {
        isLoading: false,
        data: null,
        defaultData: null,
        error: null
    },
    reducers: {
        resetIdList: (state) => {
            state.error = null;
            state.data = null;
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPokeID.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(getPokeID.fulfilled, (state, action) => {   
            if (action.payload.idList.length === 0) {
                state.error = null;
                state.isLoading = false;
                return;
            }
            if (state.data === null) {
                
                state.data = action.payload.idList;
                state.defaultData = action.payload.idList;
            }
            else state.data = state.data.filter(id => action.payload.idList.includes(id));
            state.error = null;
            state.isLoading = false;
        })
        builder.addCase(getPokeID.rejected, (state, action) => {
            state.isLoading = false;
            if(!state.error) state.error = {};
            state.error[action.payload.filter] = action.error;
        })
    }
})

const pokemonDetailSlice = createSlice({
    name: "pokemonDetail",
    initialState:{
        isLoading: false,
        data: [],
        error: null
    },
    reducers:{
        resetDesc: (state) => {
            state.error = null;
            state.data = [];
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSpecies.pending, (state) => {
            state.isLoading = true;
            state.error = false;
        })
        builder.addCase(getSpecies.fulfilled, (state, action) => {
            console.log("action: ", action.payload);
            state.isLoading = false;
            state.data.push(action.payload)
            state.error = false;
        })
        builder.addCase(getSpecies.rejected, (state,action) => {
            state.isLoading = false;
            state.error = action.error;
        })

    }
})

export const { resetIdList } = pokeIDSlice.actions;
export const { resetPokemonList, sortPokemon } = pokemonSlice.actions;
export const { resetDesc} = pokemonDetailSlice.actions;
export const pokeIdReducer = pokeIDSlice.reducer;
export const pokemonReducer = pokemonSlice.reducer;
export const pokemonDetailReducer = pokemonDetailSlice.reducer;
