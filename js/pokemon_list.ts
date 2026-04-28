const MAX_TEAM_SIZE = 6;
const MAX_STAT_VALUE = 100;
const LOADER_DELAY = 2000;
const POKEMON_LIMIT = 70;

interface PokemonSpecies {
  color: { name: string };
}

interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

interface PokemonType {
  type: { name: string };
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: PokemonType[];
  weight: number;
  height: number;
  stats: PokemonStat[];
  species: { url: string };
  color?: string;
}

interface PokemonListResponse {
  results: Array<{ name: string; url: string }>;
}

const statMap: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SAT",
  "special-defense": "SDF",
  speed: "SPD"
};

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDreamTeam(): Pokemon[] {
  const stored = localStorage.getItem("dreamTeam");
  return stored ? JSON.parse(stored) : [];
}

export function toggleDreamTeam(pokemon: Pokemon): void {
  const team = getDreamTeam();
  const exists = team.some(p => p.id === pokemon.id);

  if (!exists && team.length >= MAX_TEAM_SIZE) {
    alert("Dream Team is full! (Max 6 Pokémon)");
    return;
  }

  const updated = exists
    ? team.filter(p => p.id !== pokemon.id)
    : [...team, pokemon];

  localStorage.setItem("dreamTeam", JSON.stringify(updated));
}

export function isInDreamTeam(id: number): boolean {
  return getDreamTeam().some(p => p.id === id);
}

export async function fetchPokemonList(limit: number): Promise<Pokemon[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  if (!res.ok) throw new Error();

  const data: PokemonListResponse = await res.json();

  return Promise.all(
    data.results.map(async (poke): Promise<Pokemon> => {
      const res = await fetch(poke.url);
      const pokemon: Pokemon = await res.json();

      const speciesRes = await fetch(pokemon.species.url);
      const species: PokemonSpecies = await speciesRes.json();

      pokemon.color = species.color.name;

      return pokemon;
    })
  );
}

export function renderPokemon(pokemons: Pokemon[]): void {
  const pokemonListEl = document.getElementById("pokemonList") as HTMLUListElement;

  pokemonListEl.innerHTML = "";

  pokemons.forEach((pokemon) => {
    const types = pokemon.types.map(t => t.type.name);
    const weight = pokemon.weight / 10;
    const height = pokemon.height / 10;
    const mainType = pokemon.types[0]?.type.name || "";
    const isFav = isInDreamTeam(pokemon.id);

    const li = document.createElement("li");
    li.className = "pokemon";

    const a = document.createElement("a");

    a.innerHTML = `
      <div class="card ${mainType}">
          <div class="pokemon_title">
              <p class="izena">${capitalize(pokemon.name)}</p>
              <p class="zenbakia">#${pokemon.id.toString().padStart(3, '0')}</p>
          </div>

          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" width="140" height="170" class="pokemon_img">

          <div class="pokemon_info">
              <button class="favorite_star ${isFav ? 'selected' : ''}" type="button">
                  ★
              </button>

              <ul class="pokemon_type">
                  ${types.map(type => `<li class="pokemon_type ${type}">${capitalize(type)}</li>`).join('')}
              </ul>

              <div class="pokemon_neurriak">
                  <div class="pokemon_neurria">
                      <img src="../img/bascula2.png" width="30">
                      <p>${weight.toFixed(1)}kg</p>
                  </div>
                  <div class="pokemon_neurria">
                      <img src="../img/regla2.png" width="30">
                      <p>${height.toFixed(1)}m</p>
                  </div>
              </div>

              <div>
                  ${pokemon.stats.map((stat) => {
                    const key = stat.stat.name as keyof typeof statMap;
                    return `
                      <div class="stat">
                          <p class="stat_name">${statMap[key]}</p>
                          <p class="stat_value">${stat.base_stat}</p>
                          <div class="barra">
                              <div class="progreso" style="width:${Math.min(stat.base_stat, MAX_STAT_VALUE)}%;"></div>
                          </div>
                      </div>
                    `;
                  }).join('')}
              </div>
          </div>
      </div>
    `;

    li.appendChild(a);
    pokemonListEl.appendChild(li);

    const star = li.querySelector(".favorite_star") as HTMLButtonElement;

    star.addEventListener("click", () => {
      toggleDreamTeam(pokemon);
      star.classList.toggle("selected");
    });
  });
}

export function showLoader(): void {
  const loader = document.getElementById("loader") as HTMLUListElement;
  const pokemonListEl = document.getElementById("pokemonList") as HTMLUListElement;
  const errorEl = document.getElementById("error") as HTMLDivElement;
  const noPokemonEl = document.getElementById("no-pokemon") as HTMLDivElement;

  loader.style.display = "grid";
  pokemonListEl.style.display = "none";
  errorEl.style.display = "none";
  noPokemonEl.style.display = "none";
}

export function showError(): void {
  const loader = document.getElementById("loader") as HTMLUListElement;
  const pokemonListEl = document.getElementById("pokemonList") as HTMLUListElement;
  const errorEl = document.getElementById("error") as HTMLDivElement;
  const noPokemonEl = document.getElementById("no-pokemon") as HTMLDivElement;

  errorEl.style.display = "flex";
  pokemonListEl.style.display = "none";
  loader.style.display = "none";
  noPokemonEl.style.display = "none";
}

export function showNoPokemon(): void {
  const pokemonListEl = document.getElementById("pokemonList") as HTMLUListElement;
  const errorEl = document.getElementById("error") as HTMLDivElement;
  const noPokemonEl = document.getElementById("no-pokemon") as HTMLDivElement;

  noPokemonEl.style.display = "flex";
  pokemonListEl.style.display = "none";
  errorEl.style.display = "none";
}

export function showPokemonList(): void {
  const loader = document.getElementById("loader") as HTMLUListElement;
  const pokemonListEl = document.getElementById("pokemonList") as HTMLUListElement;
  const errorEl = document.getElementById("error") as HTMLDivElement;
  const noPokemonEl = document.getElementById("no-pokemon") as HTMLDivElement;

  pokemonListEl.style.display = "grid";
  loader.style.display = "none";
  errorEl.style.display = "none";
  noPokemonEl.style.display = "none";
}

export async function initPokemonList(): Promise<void> {
  const searchInput = document.querySelector(".pokemonSearch") as HTMLInputElement;

  if (!searchInput) return;

  let allPokemon: Pokemon[] = [];

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const value = (e.target as HTMLInputElement).value;

      const filtered = allPokemon.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );

      if (filtered.length === 0) {
        showNoPokemon();
      } else {
        showPokemonList();
        renderPokemon(filtered);
      }
    });
  }

  try {
    showLoader();

    const data = await fetchPokemonList(POKEMON_LIMIT);
    allPokemon = data;

    setTimeout(() => {
      renderPokemon(allPokemon);
      showPokemonList();
    }, LOADER_DELAY);

  } catch {
    showError();
  }
}

if (typeof window !== "undefined") {
  initPokemonList().catch(console.error);
}