"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useFilteredPokemon } from "../hooks/useFilteredPokemon";
const Card = dynamic(() => import('../components/Card'));


interface PokemonSearchProps {
  types: string[];
}

export default function PokemonSearch({ types }: PokemonSearchProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const filteredPokemonNames = useFilteredPokemon(type, search);
  const [detailedPokemons, setDetailedPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      const details = await Promise.all(
        filteredPokemonNames.map(async (p: { name: string }) => {
          try {
            const name = p.name;
            const res = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${name}`
            );
            return await res.json();
          } catch (err) {
            console.error("Error fetching details for", p.name, err);
            return null;
          }
        })
      );
      setDetailedPokemons(details.filter(Boolean));
      setLoading(false);
    }
    loadDetails();
  }, [filteredPokemonNames]);

  return (
    <div
      className="p-4 max-w-6xl mx-auto"
      style={{ color: "var(--foreground)" }}
    >
      <form className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          onChange={(e) => {
            let type = e.target.value;
            setType(type);
          }}
          className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[var(--background)] rounded w-full md:w-[50%]"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          className="p-2 border border-gray-300 dark:border-gray-600 rounded flex-1 bg-white dark:bg-[var(--background)]"
          placeholder="Search Pokémon..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading Pokémon...
        </p>
      ) : detailedPokemons.length === 0 && search ? (
        <p className="text-center text-red-500">
          No Pokémon found. Try another search or type.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {detailedPokemons.map((p, index) => (
            <Card p={p} key={p.name} />
          ))}
        </div>
      )}
    </div>
  );
}
