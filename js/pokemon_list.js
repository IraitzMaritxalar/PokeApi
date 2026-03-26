export async function initPokemonList() {
    const pokemonListEl = document.getElementById("pokemonList");
    const loader = document.getElementById("loader");
    const searchInput = document.querySelector(".pokemonSearch");
    const errorEl = document.getElementById("error");
    const noPokemonEl = document.getElementById("no-pokemon");
    const statMap = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SAT",
        "special-defense": "SDF",
        speed: "SPD"
    };

    let allPokemon = [];

async function fetchPokemonList(limit) {
    try {   
            showLoader();
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
            const data = await response.json();

            const results = data.results;

            const detailedPokemon = await Promise.all(
                results.map(async (poke) => {
                    const res = await fetch(poke.url);
                    const pokemonData = await res.json();

                    const speciesRes = await fetch(pokemonData.species.url);
                    const speciesData = await speciesRes.json();

                    pokemonData.color = speciesData.color.name;

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
            console.error(error);
            showError();
        }
    }

    function renderPokemon(pokemons) {
        pokemonListEl.innerHTML = "";

        pokemons.forEach(p => {
            const types = p.types.map(t => t.type.name);
            const weight = p.weight / 10;
            const height = p.height / 10;
            const mainType = p.types[0].type.name;

            const li = document.createElement("li");
            li.className = "pokemon";

            const a = document.createElement("a");
            a.href = `pokemon_detail.html?id=${p.id}`;
            a.innerHTML = `
                <div class="card ${mainType}">
                    <div class="pokemon_title">
                        <p class="izena">${capitalize(p.name)}</p>
                        <p class="zenbakia">#${p.id.toString().padStart(3,'0')}</p>
                    </div>
                    <img src="${p.sprites.front_default}" alt="${p.name}" width="140" height="170" class="pokemon_img">
                    <div class="pokemon_info">
                        <ul class="pokemon_type">
                            ${types.map(type => `<li class="pokemon_type ${type}">${capitalize(type)}</li>`).join('')}
                        </ul>
                        <div class="pokemon_neurriak">
                            <div class="pokemon_neurria">
                                <img src="../img/bascula2.png" alt="Logo de una bascula" width="30" height="30">
                                <p class="pixua">${weight}kg</p>
                            </div>
                            <div class="pokemon_neurria">
                                <img src="../img/regla2.png" alt="Logo de una regla" width="30" height="20">
                                <p class="altura">${height}m</p>
                            </div>
                        </div>
                        <div>
                            ${p.stats.map(stat => `
                                <div class="stat">
                                    <p class="stat_name">${statMap[stat.stat.name]}</p>
                                    <p class="stat_value">${stat.base_stat}</p>
                                    <div class="barra">
                                        <div class="progreso" style="width: ${Math.min(stat.base_stat,100)}%;"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            li.appendChild(a);
            pokemonListEl.appendChild(li);
        });
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    searchInput.addEventListener("input", (e) => {
        const filtered = allPokemon.filter(p =>
            p.name.toLowerCase().includes(e.target.value.toLowerCase())
        );

        if (filtered.length === 0) {
            showNoPokemon();
        } else {
            showPokemonList();
            renderPokemon(filtered);
        }
    });

    function showError() {
        errorEl.style.display = "flex";
        noPokemonEl.style.display = "none";
        pokemonListEl.style.display = "none";
        loader.style.display = "none";
    }

    function showNoPokemon() {
        errorEl.style.display = "none";
        noPokemonEl.style.display = "flex";
        pokemonListEl.style.display = "none";
    }

    function showPokemonList() {
        errorEl.style.display = "none";
        noPokemonEl.style.display = "none";
        pokemonListEl.style.display = "grid";
    }

    function showLoader() {
        loader.style.display = "grid";
        pokemonListEl.style.display = "none";
        errorEl.style.display = "none";
        noPokemonEl.style.display = "none";
    }

    fetchPokemonList(70);
}

initPokemonList();