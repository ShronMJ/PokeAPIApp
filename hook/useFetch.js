import axios from 'axios';

const useFetch = () => {
    const fetchData = async (endpoint, value) => {
        try {
            let url = '';
            switch (endpoint) {
                case "pokemonList":
                    url = 'https://pokeapi.co/api/v2/pokemon';
                    break;
                case "url":
                    url = value;
                    break;
                default:
                    if (value) { url = `https://pokeapi.co/api/v2/${endpoint}/${value}` }
                    else { return { data: {}, error: null } }
                    break;
            }
            const response = await axios.get(url);
            if (response.status === 404) {
                return { data: {}, error: 404 }; 
              }
            return { data: response.data, error: null };  
        } catch (error) {
            return { data: {}, error:error };
        }
    };
    return fetchData;
};

export default useFetch;
