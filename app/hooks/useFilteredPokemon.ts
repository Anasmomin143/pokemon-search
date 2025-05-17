import { useEffect, useState } from "react";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useFilteredPokemon(type: string, search: string) {
  const [pokemons, setPokemons] = useState([]);
  const debouncedSearch = useDebouncedValue(search, 400);

  useEffect(() => {
    async function fetchData() {
      let results = [];
      if (type) {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const data = await res.json();
        results = data.pokemon.map((p: any) => p.pokemon);
      } else {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await res.json();
        results = data.results;
      }
      if (debouncedSearch) {
        results = results.filter((p: any) =>
          p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }
      setPokemons(results);
    }
    fetchData();
  }, [type, debouncedSearch]);

  return pokemons;
}
