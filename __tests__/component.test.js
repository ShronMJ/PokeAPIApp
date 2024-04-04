import React from 'react';
import { render } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import App from '../app/index'
import images from "../constants/images";
import { Welcome, PokemonCard, Description } from '../components';
import { pokeIdReducer, pokemonReducer } from '../app/redux/fetchSlice'
import textConfigReducer from '../app/redux/textSlice';

jest.mock('expo-router')

describe('App Component', () => {
  it('renders <App /> without crashing', () => {
    const { toJSON } = render(<App />);
     expect(toJSON()).toBeTruthy();
  });
});

describe('Welcome Component', () => {
  jest.unmock('expo-router')
  it("renders correctly with the required text", () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<Welcome />);
    expect(getByText('Pokemon List')).toBeTruthy();
    expect(getByText('Find the Pokemon')).toBeTruthy();
    expect(getByPlaceholderText("Type the Pokémon's name/number, or use filter search")).toBeTruthy();
  });

  it("has access to redux's store", () => {
    const { store } = renderWithProviders(<Welcome />);
    expect(store.getState()).toEqual({
      pokeID: { isLoading: false, fetchData: [], compileData: [], error: [] },
      pokemons: {  data: [], error: [] },
      textConfig: {
        search: '',
        sort: { isAscending: true, mode: 'Number' },
        filter: { Type: '', Generation: '', 'Egg Group': '' }
      }
    })
  });
});

describe('PokemonCard Component', () => {
  jest.unmock('expo-router')
  const pokemon = {
    id: 25,
    name: 'Pikachu',
    imgGif: 'https://example.com/pikachu.gif',
    imgStatic: 'https://example.com/pikachu.png',
    desc: 'An electric-type Pokémon.',
    type: ['Electric']
  };

  it('renders correctly with valid props', () => {
    const { getByText, getByTestId } = render(<PokemonCard pokemon={pokemon} />);

    expect(getByText('#0025 Pikachu')).toBeTruthy();
    expect(getByText('An electric-type Pokémon.')).toBeTruthy();
    expect(getByText('Electric')).toBeTruthy();
    const pokemonImage = getByTestId("pokemon-image");
    expect(pokemonImage.props.source).toEqual({ uri: 'https://example.com/pikachu.gif' });
  });

  it("renders backup image (imgStatic) if imgGif is invalid", () => {
    pokemon.imgGif = "nonsense-url";
    const { getByTestId } = render(<PokemonCard pokemon={pokemon} />)
    const pokemonImage = getByTestId("pokemon-image");
    expect(pokemonImage.props.source).toEqual({ uri: 'https://example.com/pikachu.png' });
  })

  it("renders fallback source if both imgStatic and imgGif are invalid", () => {
    pokemon.imgGif = "nonsense-url";
    pokemon.imgStatic = "nonsense-url";
    const { getByTestId } = render(<PokemonCard pokemon={pokemon} />)

    const pokemonImage = getByTestId("pokemon-image");
    expect(pokemonImage.props.source).toEqual(images.noImg);
  })

  it('renders error message when error prop is provided', () => {
    const error = { message: 'Failed to fetch data.' };
    const { getByText } = render(<PokemonCard error={error} />);
    expect(getByText('Failed to fetch data.')).toBeTruthy();
  });
});

describe("Description component", () => {
  jest.unmock('expo-router')
  const pokemon = {
    id: 1,
    name: "bulbasaur",
    desc: "It's a frog? or a turtle? no one know",
    weight: 69,
    height: 96,
    abilities: ["Spray water", "Jump"]
  }
  it("renders About's tab only", () => {
    const activeTab = "About";
    const { getByText } = render(
      <Description
        activeTab={activeTab}
        pokemon={pokemon}
      />
    )
    expect(getByText('#0001 Bulbasaur')).toBeTruthy()
    expect(getByText("It's a frog? or a turtle? no one know")).toBeTruthy()
  })
  it("renders Description's tab only", () => {
    const activeTab = "Description";
    const { getByText } = render(
      <Description
        activeTab={activeTab}
        pokemon={pokemon}
      />
    )
    expect(getByText('Weight: 69')).toBeTruthy()
    expect(getByText('Height: 96')).toBeTruthy()
    expect(getByText('Spray water')).toBeTruthy()
    expect(getByText('Jump')).toBeTruthy()
  })
})

function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        {children}
      </Provider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}


const setupStore = preloadedState => {
  return configureStore({
    reducer: {
      pokeID: pokeIdReducer,
      pokemons: pokemonReducer,
      textConfig: textConfigReducer
    },
    preloadedState
  })
}