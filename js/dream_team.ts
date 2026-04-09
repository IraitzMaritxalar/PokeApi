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

  function setFrameSize(count: number): void {
    frame.className = 'white-frame';
    if (count === 1) frame.classList.add('size-1');
    else if (count === 2) frame.classList.add('size-2');
    else if (count === 3) frame.classList.add('size-3');
    else if (count === 4) frame.classList.add('size-4');
    else if (count === 5) frame.classList.add('size-5');
    else frame.classList.add('size-6');
  }

  function render(pokemons: Pokemon[]): void {
    if (pokemons.length === 0) {
      emptyState.classList.remove('hidden');
      filledState.classList.add('hidden');
      return;
    }
    
    emptyState.classList.add('hidden');
    filledState.classList.remove('hidden');
    
    setFrameSize(pokemons.length);
    frame.innerHTML = '';
    
    // Render only existing Pokémon (no empty slots!)
    pokemons.slice(0, 6).forEach((pokemon: Pokemon) => {
      if (pokemon.sprites?.front_default) {
        const slot: HTMLDivElement = document.createElement('div');
        slot.className = 'pokemon-slot';
        
        const img: HTMLImageElement = document.createElement('img');
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;
        img.loading = 'lazy';
        
        slot.appendChild(img);
        frame.appendChild(slot);
      }
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