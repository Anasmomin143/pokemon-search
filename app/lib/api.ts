export async function fetchPokemonTypes(): Promise<string[]> {
  const res = await fetch("https://pokeapi.co/api/v2/type", {
    cache: "force-cache", // default; ensures build-time fetch
  });
  const data = await res.json();
  return data.results.map((t: any) => t.name);
}
