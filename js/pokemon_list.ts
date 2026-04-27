interface PokemonSpecies {
  color: {
    name: string;
  };
}

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface PokemonType {
  type: {
    name: string;
  };
}

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
  weight: number;
  height: number;
  stats: PokemonStat[];
  species: {
    url: string;
  };
  color?: string;
}

interface PokemonListResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
}

const statMap: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SAT",
  "special-defense": "SDF",
  speed: "SPD"
};

export async function initPokemonList(): Promise<void> {
  const pokemonListEl = document.getElementById("pokemonList") as HTMLUListElement;
  const loader = document.getElementById("loader") as HTMLUListElement;
  const searchInput = document.querySelector(".pokemonSearch") as HTMLInputElement;
  const errorEl = document.getElementById("error") as HTMLDivElement;
  const noPokemonEl = document.getElementById("no-pokemon") as HTMLDivElement;

  let allPokemon: Pokemon[] = [];

  function getDreamTeam(): Pokemon[] {
    const stored = localStorage.getItem('dreamTeam');
    return stored ? JSON.parse(stored) as Pokemon[] : [];
  }

  function createDreamTeam(pokemon: Pokemon): void {
    const dreamTeam = getDreamTeam();
    const isInTeam = dreamTeam.some(p => p.id === pokemon.id);
    
    let updatedTeam: Pokemon[];
    
    if (isInTeam) {
      updatedTeam = dreamTeam.filter(p => p.id !== pokemon.id);
    } else {
      if (dreamTeam.length >= 6) {
        alert("Dream Team is full! (Max 6 Pokémon)");
        return;
      }
      updatedTeam = [...dreamTeam, pokemon];
    }
    
    localStorage.setItem('dreamTeam', JSON.stringify(updatedTeam));
  }

  function isPokemonInDreamTeam(pokemonId: number): boolean {
    const dreamTeam = getDreamTeam();
    return dreamTeam.some(p => p.id === pokemonId);
  }

  async function fetchPokemonList(limit: number): Promise<void> {
    try {
      showLoader();
      
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PokemonListResponse = await response.json();
      const results = data.results;

      const detailedPokemon: Pokemon[] = await Promise.all(
        results.map(async (poke): Promise<Pokemon> => {
          const res = await fetch(poke.url);
          const pokemonData: Pokemon = await res.json();

          const speciesRes = await fetch(pokemonData.species.url);
          const speciesData: PokemonSpecies = await speciesRes.json();

          (pokemonData as Pokemon & { color: string }).color = speciesData.color.name;

          return pokemonData;
        })
      );

      allPokemon = detailedPokemon;
      loader.style.display = "grid";

      setTimeout(() => {
        loader.style.display = "none";
        showPokemonList();
        renderPokemon(allPokemon);
      }, 2000);

    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      showError();
    }
  }

  function renderPokemon(pokemons: Pokemon[]): void {
    pokemonListEl.innerHTML = "";

    pokemons.forEach((p: Pokemon) => {
      const types: string[] = p.types.map(t => t.type.name);
      const weight: number = p.weight / 10;
      const height: number = p.height / 10;
      const mainType: string = p.types[0]?.type.name || '';
      const isInDreamTeamLocal = isPokemonInDreamTeam(p.id);

      const li: HTMLLIElement = document.createElement("li");
      li.className = "pokemon";

      const a: HTMLAnchorElement = document.createElement("a");
      a.innerHTML = `
        <div class="card ${mainType}">
            <div class="pokemon_title">
                <p class="izena">${capitalize(p.name)}</p>
                <p class="zenbakia">#${p.id.toString().padStart(3, '0')}</p>
            </div>

            <img src="${p.sprites.front_default}" alt="${p.name}" width="140" height="170" class="pokemon_img">

            <div class="pokemon_info">
                <button class="favorite_star ${isInDreamTeamLocal ? 'selected' : ''}" 
                        type="button" 
                        aria-label="${isInDreamTeamLocal ? 'Remove from' : 'Add to'} Dream Team"
                        title="${isInDreamTeamLocal ? 'Remove from Dream Team' : 'Add to Dream Team'}">
                    ★
                </button>
                <ul class="pokemon_type" role="list">
                    ${types.map(type => `<li class="pokemon_type ${type}" role="listitem">${capitalize(type)}</li>`).join('')}
                </ul>
                <div class="pokemon_neurriak">
                    <div class="pokemon_neurria">
                        <img src="../img/bascula2.png" alt="Logo de una bascula" width="30" height="30">
                        <p class="pixua">${weight.toFixed(1)}kg</p>
                    </div>
                    <div class="pokemon_neurria">
                        <img src="../img/regla2.png" alt="Logo de una regla" width="30" height="20">
                        <p class="altura">${height.toFixed(1)}m</p>
                    </div>
                </div>
                <div>
                    ${p.stats.map((stat: PokemonStat) => {
                      const statKey = stat.stat.name as keyof typeof statMap;
                      const statAbbr = statMap[statKey];
                      return `
                        <div class="stat">
                            <p class="stat_name">${statAbbr}</p>
                            <p class="stat_value">${stat.base_stat}</p>
                            <div class="barra">
                                <div class="progreso" style="width: ${Math.min(stat.base_stat, 100)}%;"></div>
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

      const star: HTMLButtonElement | null = li.querySelector(".favorite_star");
      if (star) {
        star.addEventListener("click", (e: MouseEvent) => {
          createDreamTeam(p);
          
          const isNowInTeam = !isInDreamTeamLocal;
          star.classList.toggle("selected", isNowInTeam);
          star.setAttribute("aria-label", isNowInTeam ? "Remove from Dream Team" : "Add to Dream Team");
          star.title = isNowInTeam ? "Remove from Dream Team" : "Add to Dream Team";
        });
      }
    });
  }

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  searchInput.addEventListener("input", (e: Event) => {
    const target = e.target as HTMLInputElement;
    const filtered: Pokemon[] = allPokemon.filter(p =>
      p.name.toLowerCase().includes(target.value.toLowerCase())
    );

    if (filtered.length === 0) {
      showNoPokemon();
    } else {
      showPokemonList();
      renderPokemon(filtered);
    }
  });

  function showError(): void {
    if (errorEl) errorEl.style.display = "flex";
    if (noPokemonEl) noPokemonEl.style.display = "none";
    pokemonListEl.style.display = "none";
    loader.style.display = "none";
  }

  function showNoPokemon(): void {
    if (errorEl) errorEl.style.display = "none";
    if (noPokemonEl) noPokemonEl.style.display = "flex";
    pokemonListEl.style.display = "none";
  }

  function showPokemonList(): void {
    if (errorEl) errorEl.style.display = "none";
    if (noPokemonEl) noPokemonEl.style.display = "none";
    pokemonListEl.style.display = "grid";
  }

  function showLoader(): void {
    loader.style.display = "grid";
    pokemonListEl.style.display = "none";
    if (errorEl) errorEl.style.display = "none";
    if (noPokemonEl) noPokemonEl.style.display = "none";
  }

  await fetchPokemonList(70);
}

initPokemonList().catch(console.error);