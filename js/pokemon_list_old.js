import { loadPage } from "./main.js";
import p1 from "../json/1.json" with { type: "json" };
import p2 from "../json/2.json" with { type: "json" };
import p3 from "../json/3.json" with { type: "json" };
import p4 from "../json/4.json" with { type: "json" };
import p5 from "../json/5.json" with { type: "json" };
import p6 from "../json/6.json" with { type: "json" };

export async function initPokemonList() {
    const pokemonListEl = document.getElementById("pokemonList");
    const searchInput = document.querySelector(".pokemonSearch");
    const statMap = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SAT",
        "special-defense": "SDF",
        speed: "SPD"
    };

    let allPokemon = [p1, p2, p3, p4, p5, p6];
    renderPokemon(allPokemon);

    function renderPokemon(pokemons) {
        pokemonListEl.innerHTML = "";
        pokemons.forEach(p => {
            const types = p.types.map(t => t.type.name);
            const weight = p.weight / 10;
            const height = p.height / 10;
            const mainType = p.types[0].type.name;
            const li = document.createElement("li");
            li.className = "pokemon";
            li.addEventListener("click", () => {
                loadPage(`pokemon_detail.html?id=${p.id}`);
            });
            li.innerHTML = `
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
        renderPokemon(filtered);
    });
}