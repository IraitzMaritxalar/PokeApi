interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string };
}

function initDreamTeam(): void {

  const emptyState = document.getElementById('empty-state') as HTMLDivElement;
  const filledState = document.getElementById('filled-state') as HTMLDivElement;
  const frame = document.getElementById('pokemon-frame') as HTMLDivElement;
  const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;

  function getTeam(): Pokemon[] {
    try {
      const stored = localStorage.getItem('dreamTeam');
      if (!stored) return [];

      const parsed: unknown = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed as Pokemon[] : [];
    } catch {
      localStorage.removeItem('dreamTeam');
      return [];
    }
  }

  function render(pokemons: Pokemon[]): void {

    if (pokemons.length === 0) {
      emptyState.classList.remove('hidden');
      filledState.classList.add('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    filledState.classList.remove('hidden');

    const teamContainer = document.getElementById("team-pokemon") as HTMLDivElement;
    const iconContainer = document.getElementById("team-icons") as HTMLDivElement;

    teamContainer.innerHTML = "";
    iconContainer.innerHTML = "";

    pokemons.slice(0, 6).forEach((pokemon: Pokemon, index: number) => {

      if (!pokemon.sprites?.front_default) return;

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

  clearBtn.onclick = (): void => {
    if (confirm('Clear Dream Team?')) {
      localStorage.removeItem('dreamTeam');
      render([]);
    }
  };

  render(getTeam());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDreamTeam);
} else {
  initDreamTeam();
}