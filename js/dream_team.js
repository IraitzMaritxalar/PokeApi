"use strict";
function initDreamTeam() {
    const emptyState = document.getElementById('empty-state');
    const filledState = document.getElementById('filled-state');
    const frame = document.getElementById('pokemon-frame');
    const clearBtn = document.getElementById('clear-btn');
    function getTeam() {
        try {
            const stored = localStorage.getItem('dreamTeam');
            if (!stored)
                return [];
            const parsed = JSON.parse(stored);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            localStorage.removeItem('dreamTeam');
            return [];
        }
    }
    function render(pokemons) {
        if (pokemons.length === 0) {
            emptyState.classList.remove('hidden');
            filledState.classList.add('hidden');
            return;
        }
        emptyState.classList.add('hidden');
        filledState.classList.remove('hidden');
        const teamContainer = document.getElementById("team-pokemon");
        const iconContainer = document.getElementById("team-icons");
        teamContainer.innerHTML = "";
        iconContainer.innerHTML = "";
        pokemons.slice(0, 6).forEach((pokemon, index) => {
            if (!pokemon.sprites?.front_default)
                return;
            const img = document.createElement("img");
            img.src = pokemon.sprites.front_default;
            img.alt = pokemon.name;
            img.loading = "lazy";
            img.className = `team-pokemon-img pos-${index}`;
            teamContainer.appendChild(img);
            const icon = document.createElement("img");
            icon.src = pokemon.sprites.front_default;
            icon.alt = pokemon.name;
            icon.className = "team-icon";
            iconContainer.appendChild(icon);
        });
    }
    clearBtn.onclick = () => {
        if (confirm('Clear Dream Team?')) {
            localStorage.removeItem('dreamTeam');
            render([]);
        }
    };
    render(getTeam());
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDreamTeam);
}
else {
    initDreamTeam();
}
