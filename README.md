# Project Setup

## Implemented method
- State management using Redux
- Handle asynchronous actions with Redux Thunk
- Functionalities (search and sort features)
- Performance optimization, error handling
- Write Redux logic test
- etc.

## Main Used Dependencies
- Redux Toolkit
- Expo
- Axios
- React Native
- Jest

## Architecture
- The program would enter from 'expo-router/entry' to the App component in ./app/index.js.
- This App renders the header, Welcome, and PokemonList's components:
    - Welcome component:
        - Manages the search, sort, and filter functions.
        - All these functions return queries which are later stored and used to query Pokemons.
        - Pokemon can be sorted ascendingly/descendingly or by name, number, or weight.
    - PokemonList: 
        - Use the stored queries (search value, filter value(s)) to get all the Pokemon's ID.
        - Once the ID is compiled, a list of Pokemon's details is produced by fetching Pokemon/ID one by one.
        - If no Pokemon is found, the default list will be generated.
        - Since this is a simple App, the possible internal error would be logged in the console only.
        - The list consists of Pokemon's card which navigates to its detailed info when pressed.
- Redux is used to manage and store:
    - The values of search, sort, and filter functions.
    - An array of fetched IDs, and the finalized list of Pokemon's IDs (reset before new searches).
    - An array of the obtained Pokemon's information (stored until the App is refreshed).
- Jest is used to perform the unit testing as simple as possible. Tested:
    - Fetch and store data from real-time API.
    - Sort and store the updated ID list.
    - Render component without problem.
    - Handle the possible error (typically caused by an invalid URI)

# Sample Images
Default
![Default Display](./assets/sample/default.png)

Filter-search
![filter-search Display](./assets/sample/filter-search.png)

Invalid-search
![Invalid-search Display](./assets/sample/invalid-search.png)

Random Display
![Other Display](./assets/sample/sample.png)
