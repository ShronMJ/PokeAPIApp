import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getPokeID = createAsyncThunk('idList/getPokeID', async ({ filter, value }) => {
    if (!value) value = '';
    const response = await fetch(`https://pokeapi.co/api/v2/${filter}/${value}`);
    const resData = await response.json();
    const urlList = (() => {
        switch (filter) {
            case "type":
                return resData?.pokemon?.map(p => p.pokemon.url) || [];
            case "pokemon":
                if(!value) return resData?.results?.map(p => p.url) || [];
                
                else return resData?.id || [];
            default:
                return resData?.pokemon_species?.map(p => p.url) || [];
        }
    })();

    if(typeof urlList === 'number') return { idList: [urlList], filter };

    const idList = urlList.map(url => {
        const parts = url?.split('/');
        return parts[parts?.length - 2]
    });
    return { idList, filter };
})

export const getPokemon = createAsyncThunk('pokemon/getPokemon', async (id) => {

    const res1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const info = await res1.json();

    const res2 = await fetch(info.species.url);
    const species = await res2.json();

    const pokemon = { info, species };
    return pokemon;

});



const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState: {
        isLoading: {},
        data: {},
        error: {}
    },
    reducers: {
        resetPokemonList: (state) => {
            state.error = {};
            state.data = {};
            state.isLoading = {};
        },

    },
    extraReducers: (builder) => {
        builder.addCase(getPokemon.pending, (state, action) => {
            const id = action.meta.arg;
            state.isLoading[id] = true;
            state.error[id] = null
        })
        builder.addCase(getPokemon.fulfilled, (state, action) => {
            const id = action.meta.arg;
            state.data[id] = action.payload;
            state.error[id] = null;
            state.isLoading[id] = false;
        });

        builder.addCase(getPokemon.rejected, (state, action) => {
            const id = action.meta.arg;
            state.error[id] = action.error;
            state.isLoading[id] = false;
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
            state.isLoading = true;
        },
        sortPokemon: (state, action) => {
            const { sortMode, sortValue } = action.payload;

            switch (sortMode) {
                case "Name":
                    state.data = sortValue.sort((a, b) => (a.name || '').localeCompare(b.name || '')).map(p => p.id);
                    break;
                case "Number":
                    state.data = sortValue.sort((a, b) => (a.id || 0) - (b.id || 0)).map(p => p.id);
                    break;
                case "Weight":
                    state.data = sortValue.sort((a, b) => (a.weight || 0) - (b.weight || 0)).map(p => p.id);
                    break;
            }
        },
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

            if (state.data !== null) state.data = state.data.filter(id => action.payload.idList.includes(id));
            state.error = null;
            state.isLoading = false;
        })
        builder.addCase(getPokeID.rejected, (state, action) => {
            state.isLoading = false;
            if (!state.error) state.error = {};
            state.error = action.error;
        })
    }
})


export const { resetIdList, sortPokemon } = pokeIDSlice.actions;
export const { resetPokemonList } = pokemonSlice.actions;
export const pokeIdReducer = pokeIDSlice.reducer;
export const pokemonReducer = pokemonSlice.reducer;
