import { createSlice } from "@reduxjs/toolkit";

const texConfigSlice = createSlice({
    name: "textConfig",
    initialState: {
        search: "",
        sort: {
            isAscending: true,
            mode: "Number"
        },
        filter: {
            Type: "",
            Generation: '',
            "Egg Group": ""
        }
    },
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setSort: (state, action) => {
            state.sort = action.payload
        },
        setFilter: (state, action) => {
            state.filter = action.payload
        }
    }
})

export const { setSearch, setSort, setFilter } = texConfigSlice.actions;
export default texConfigSlice.reducer;