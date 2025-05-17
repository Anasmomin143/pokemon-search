import PokemonSearch from "./components/PokemonSearch";
import { fetchPokemonTypes } from "./lib/api";

export default async function HomePage() {
  const types = await fetchPokemonTypes();
  return <PokemonSearch types={types} />;
}
