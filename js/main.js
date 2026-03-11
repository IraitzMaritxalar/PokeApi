let currentCss;

function loadPage(page) {
  fetch(`../html/${page}`)
    .then(res => res.text())
    .then(async html => {
      document.getElementById("content").innerHTML = html;

      if(currentCss) currentCss.remove();

      const cssPath = `../css/${page.replace(".html", ".css")}`;
      fetch(cssPath).then(res => {
        if(res.ok) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = cssPath;
          document.head.appendChild(link);
          currentCss = link;
        }
      });
      if(page === "pokemon_list.html") {
        const module = await import("../js/pokemon_list.js");
        module.initPokemonList();
      }
    });
}

document.getElementById("homeBtn").addEventListener("click", () => {
  loadPage("home.html");
});

document.getElementById("pokemonBtn").addEventListener("click", () => {
  loadPage("pokemon_list.html");
});

loadPage("home.html");