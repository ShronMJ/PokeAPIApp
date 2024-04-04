import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getPokeID = createAsyncThunk('idList/getPokeID', async ({ filter, value }, thunkAPI) => {
    const response = await fetch(`https://pokeapi.co/api/v2/${filter}/${value}`);
    const resData = await response.json();
    const urlList = (() => {
        switch (filter) {
            case "type":
                return resData?.pokemon?.map(p => p.pokemon.url) || [];
            case "pokemon":
                if (!value) return resData?.results?.map(p => p.url) || [];
                else return resData?.id || [];
            default:
                return resData?.pokemon_species?.map(p => p.url) || [];
        }
    })();

    if (!Array.isArray(urlList)) {
        await thunkAPI.dispatch(getPokemon(urlList))
        return [urlList];
    } else {
        const newIdList = urlList.map(url => {
            const parts = url?.split('/');
            return Number(parts[parts?.length - 2])
        });

        const currentIdlist = thunkAPI.getState().pokeID.fetchData;
        const idList = currentIdlist.length > 0 ? currentIdlist.filter(id => newIdList.includes(id)) : newIdList;
        idList.forEach(async id => {
            await thunkAPI.dispatch(getPokemon(id))
        });
        return idList;
    }
})

export const getPokemon = createAsyncThunk('pokemon/getPokemon', async (pokeId, thunkAPI) => {
    const existingPokemon = thunkAPI.getState().pokemons.data;
    const currentIdlist = thunkAPI.getState().pokeID.fetchData;
    if (existingPokemon.some(p => p.id === pokeId) || currentIdlist.includes(pokeId)) return;

    const res1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
    const info = await res1.json();

    const res2 = await fetch(info.species.url);
    const species = await res2.json();

    const {id, name, weight, height} = info;
    const imgGif = info.sprites.other.showdown.front_shiny;
    const imgStatic = info.sprites.front_shiny;
    const imgArt = info.sprites.other['official-artwork'].front_shiny;
    const type = info.types.map(p => p.type.name);
    const abilities = info.abilities?.map(a => a.ability.name);

    const textList = species.flavor_text_entries || [];
    const shuffledList = textList.slice().sort(() => Math.random() - 0.5);
    const text = shuffledList ? shuffledList.find(t => t.language.name === "en") : '';
    const desc = text.flavor_text;
    return pokemon = { id, name, imgGif, imgStatic, imgArt, type, desc, weight, abilities, height };
});

const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState: {
        data: [],
        error: []
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPokemon.fulfilled, (state, action) => {
                const id = action.meta.arg;

                action.payload && state.data.push(action.payload);
                state.error = state.error.filter(error => error.id !== id);
            })
            .addCase(getPokemon.rejected, (state, action) => {
                const id = action.meta.arg;
                state.error.push({ id, error: action.error })
            })
    }
})

const pokeIDSlice = createSlice({
    name: 'idList',
    initialState: {
        isLoading: false,
        fetchData: [],
        compileData: [],
        error: []
    },
    reducers: {
        resetIdList: (state) => {
            state.fetchData = [];
            state.error = [];
        },
        sortPokemon: (state, action) => {
            const { sortMode, sortValue } = action.payload;
            const ascending = sortMode.isAscending
            switch (sortMode.mode) {
                case "Name":
                    const nameAsc = sortValue.sort((a, b) => (a.name || '').localeCompare(b.name || '')).map(p => p.id);
                    state.compileData = ascending ? nameAsc : nameAsc.reverse();
                    break;
                case "Number":
                    const idAsc  = sortValue.sort((a, b) => (a.id || 0) - (b.id || 0)).map(p => p.id);
                    state.compileData = ascending ? idAsc : idAsc.reverse();
                    break;
                case "Weight":
                    const weightValue  = sortValue.sort((a, b) => (a.weight || 0) - (b.weight || 0)).map(p => p.id);
                    state.compileData = ascending ? weightValue : weightValue.reverse();
                    break;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPokeID.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getPokeID.fulfilled, (state, action) => {
                if (action.payload.length === 0) return;
                state.fetchData = action.payload;
                state.isLoading = false;
            })
            .addCase(getPokeID.rejected, (state, action) => {
                const filterValue = action.meta.arg;
                state.error.push(filterValue);
                state.isLoading = false;
            })
    }
})

export const { resetIdList, sortPokemon } = pokeIDSlice.actions;
export const pokeIdReducer = pokeIDSlice.reducer;
export const pokemonReducer = pokemonSlice.reducer;
