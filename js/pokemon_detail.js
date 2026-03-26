export async function initPokemonDetail(query){

    const statMap = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SAT",
        "special-defense": "SDF",
        speed: "SPD"
    };

    const params = new URLSearchParams(query);
    const id = params.get("id");

    const container = document.getElementById("pokemonDetail");

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const p = await res.json();

    const speciesRes = await fetch(p.species.url);
    const speciesData = await speciesRes.json();

    const types = p.types.map(t => t.type.name);
    const weight = p.weight / 10;
    const height = p.height / 10;
    const mainType = p.types[0].type.name;

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
                    <p>${weight}kg</p>
                </div>

                <div class="pokemon_neurria">
                    <img src="../img/regla2.png" width="30">
                    <p>${height}m</p>
                </div>

            </div>

            <div>
                ${p.stats.map(stat => `
                    <div class="stat">
                        <p class="stat_name">${statMap[stat.stat.name]}</p>
                        <p class="stat_value">${stat.base_stat}</p>

                        <div class="barra">
                            <div class="progreso" style="width:${Math.min(stat.base_stat,100)}%;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>

        </div>
    </div>
    `;
}

function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

document.addEventListener("DOMContentLoaded", () => {
    initPokemonDetail(window.location.search);
});