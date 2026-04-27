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

const statMap: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SAT",
  "special-defense": "SDF",
  speed: "SPD"
};

export async function initPokemonDetail(query: string): Promise<void> {
  const params = new URLSearchParams(query);
  const id: string | null = params.get("id");

  if (!id) return;

  const container = document.getElementById("pokemonDetail") as HTMLDivElement;

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const p: Pokemon = await res.json();

  const speciesRes = await fetch(p.species.url);
  const speciesData: PokemonSpecies = await speciesRes.json();

  // opcional si quieres usar color luego
  p.color = speciesData.color.name;

  const types: string[] = p.types.map((t: PokemonType) => t.type.name);
  const weight: number = p.weight / 10;
  const height: number = p.height / 10;
  const mainType: string = p.types[0]?.type.name || "";

  container.innerHTML = `
    <div class="card detail ${mainType}">
        <div class="pokemon_title">
            <p class="izena">${capitalize(p.name)}</p>
            <p class="zenbakia">#${p.id.toString().padStart(3,'0')}</p>
        </div>

        <img src="${p.sprites.front_default}" alt="${p.name}" class="pokemon_img">

        <div class="pokemon_info">

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
                ${p.stats.map((stat: PokemonStat) => {
                  const statKey = stat.stat.name as keyof typeof statMap;
                  const statAbbr = statMap[statKey];

                  return `
                    <div class="stat">
                        <p class="stat_name">${statAbbr}</p>
                        <p class="stat_value">${stat.base_stat}</p>

                        <div class="barra">
                            <div class="progreso" style="width:${Math.min(stat.base_stat,100)}%;"></div>
                        </div>
                    </div>
                  `;
                }).join('')}
            </div>

        </div>
    </div>
  `;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

document.addEventListener("DOMContentLoaded", () => {
  initPokemonDetail(window.location.search).catch(console.error);
});