"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = capitalize;
exports.toggleDreamTeam = toggleDreamTeam;
exports.isInDreamTeam = isInDreamTeam;
exports.fetchPokemonList = fetchPokemonList;
exports.renderPokemon = renderPokemon;
exports.showLoader = showLoader;
exports.showError = showError;
exports.showNoPokemon = showNoPokemon;
exports.showPokemonList = showPokemonList;
exports.initPokemonList = initPokemonList;
const MAX_TEAM_SIZE = 6;
const MAX_STAT_VALUE = 100;
const LOADER_DELAY = 2000;
const POKEMON_LIMIT = 70;
const statMap = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SAT",
    "special-defense": "SDF",
    speed: "SPD"
};
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function getDreamTeam() {
    const stored = localStorage.getItem("dreamTeam");
    return stored ? JSON.parse(stored) : [];
}
function toggleDreamTeam(pokemon) {
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
function isInDreamTeam(id) {
    return getDreamTeam().some(p => p.id === id);
}
async function fetchPokemonList(limit) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    if (!res.ok)
        throw new Error();
    const data = await res.json();
    return Promise.all(data.results.map(async (poke) => {
        const res = await fetch(poke.url);
        const pokemon = await res.json();
        const speciesRes = await fetch(pokemon.species.url);
        const species = await speciesRes.json();
        pokemon.color = species.color.name;
        return pokemon;
    }));
}
function renderPokemon(pokemons) {
    const pokemonListEl = document.getElementById("pokemonList");
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
            const key = stat.stat.name;
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
        const star = li.querySelector(".favorite_star");
        star.addEventListener("click", () => {
            toggleDreamTeam(pokemon);
            star.classList.toggle("selected");
        });
    });
}
function showLoader() {
    const loader = document.getElementById("loader");
    const pokemonListEl = document.getElementById("pokemonList");
    const errorEl = document.getElementById("error");
    const noPokemonEl = document.getElementById("no-pokemon");
    loader.style.display = "grid";
    pokemonListEl.style.display = "none";
    errorEl.style.display = "none";
    noPokemonEl.style.display = "none";
}
function showError() {
    const loader = document.getElementById("loader");
    const pokemonListEl = document.getElementById("pokemonList");
    const errorEl = document.getElementById("error");
    const noPokemonEl = document.getElementById("no-pokemon");
    errorEl.style.display = "flex";
    pokemonListEl.style.display = "none";
    loader.style.display = "none";
    noPokemonEl.style.display = "none";
}
function showNoPokemon() {
    const pokemonListEl = document.getElementById("pokemonList");
    const errorEl = document.getElementById("error");
    const noPokemonEl = document.getElementById("no-pokemon");
    noPokemonEl.style.display = "flex";
    pokemonListEl.style.display = "none";
    errorEl.style.display = "none";
}
function showPokemonList() {
    const loader = document.getElementById("loader");
    const pokemonListEl = document.getElementById("pokemonList");
    const errorEl = document.getElementById("error");
    const noPokemonEl = document.getElementById("no-pokemon");
    pokemonListEl.style.display = "grid";
    loader.style.display = "none";
    errorEl.style.display = "none";
    noPokemonEl.style.display = "none";
}
async function initPokemonList() {
    const searchInput = document.querySelector(".pokemonSearch");
    let allPokemon = [];
    searchInput.addEventListener("input", (e) => {
        const value = e.target.value;
        const filtered = allPokemon.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));
        if (filtered.length === 0) {
            showNoPokemon();
        }
        else {
            showPokemonList();
            renderPokemon(filtered);
        }
    });
    try {
        showLoader();
        const data = await fetchPokemonList(POKEMON_LIMIT);
        allPokemon = data;
        setTimeout(() => {
            renderPokemon(allPokemon);
            showPokemonList();
        }, LOADER_DELAY);
    }
    catch {
        showError();
    }
}
initPokemonList().catch(console.error);
