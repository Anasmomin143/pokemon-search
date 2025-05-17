import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

interface PokemonDetailProps {
  params: { name: string };
}

const pokemonCache = new Map<string, any>();

async function getPokemonDetails(name: string) {
  if (pokemonCache.has(name)) {
    console.log(`Cache hit for ${name}`);
    return pokemonCache.get(name);
  }

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    next: {
      revalidate: 3600, // ISR: Revalidate every hour
    },
  });

  if (!res.ok) {
    console.log(`Failed to fetch Pokémon details for ${name}:`, res.status);
    return null;
  }

  const data = await res.json();
  pokemonCache.set(name, data);
  console.log(`Cache miss for ${name}, fetched and cached.`);
  return data;
}

function PokemonDetailContent({ pokemon }: { pokemon: any }) {
  if (!pokemon) {
    return (
      <p className="text-red-500 text-center">
        Failed to load Pokémon details.
      </p>
    );
  }

  return (
    <div
      className="p-4 max-w-3xl mx-auto"
      style={{ color: "var(--foreground)" }}
    >
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm mb-6 space-x-2 text-gray-500 dark:text-gray-400">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition font-medium"
        >
          Home
        </Link>
        <span>/</span>
        <span className="capitalize font-semibold text-gray-700 dark:text-gray-300">
          {pokemon.name}
        </span>
      </nav>

      {/* Card */}
      <div
        className="shadow-lg rounded-2xl p-6 space-y-6"
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <div className="flex flex-col items-center text-center">
          {pokemon.sprites?.front_default && (
            <Image
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              width={140}
              height={140}
              className="mb-4"
              priority
            />
          )}
          <h1 className="text-3xl capitalize font-bold">{pokemon.name}</h1>
        </div>

        {/* Types */}
        <div>
          <h2 className="font-semibold mb-2">Types:</h2>
          <ul className="flex flex-wrap gap-2">
            {pokemon.types?.map((t: any) => (
              <li
                key={t.type.name}
                className="capitalize bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
              >
                {t.type.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Stats */}
        <div>
          <h2 className="font-semibold mb-2">Stats:</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {pokemon.stats?.slice(0, 6).map((s: any) => (
              <li key={s.stat.name} className="capitalize">
                {s.stat.name}:{" "}
                <span className="font-medium">{s.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Abilities */}
        <div>
          <h2 className="font-semibold mb-2">Abilities:</h2>
          <ul className="flex flex-wrap gap-2 text-sm">
            {pokemon.abilities?.slice(0, 6).map((a: any) => (
              <li
                key={a.ability.name}
                className="capitalize bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full"
              >
                {a.ability.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Moves */}
        <div>
          <h2 className="font-semibold mb-2">Moves:</h2>
          <ul className="flex flex-wrap gap-2 text-sm">
            {pokemon.moves?.slice(0, 6).map((m: any) => (
              <li
                key={m.move.name}
                className="capitalize bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full"
              >
                {m.move.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function LoadingPokemonDetail() {
  return (
    <div className="p-4 max-w-3xl mx-auto flex justify-center items-center h-48">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
}

export default async function PokemonDetail({
  params: { name },
}: PokemonDetailProps) {
  const pokemonDetails = await getPokemonDetails(name);

  return (
    <Suspense fallback={<LoadingPokemonDetail />}>
      <PokemonDetailContent pokemon={pokemonDetails} />
    </Suspense>
  );
}
