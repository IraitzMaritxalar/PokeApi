let currentCss;

export function loadPage(page) {

  const [file, query] = page.split("?");

  fetch(`../html/${file}`)
    .then(res => res.text())
    .then(async html => {

      document.getElementById("content").innerHTML = html;

      if(currentCss) currentCss.remove();

      const cssPath = `../css/${file.replace(".html", ".css")}`;

      fetch(cssPath).then(res => {
        if(res.ok){
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = cssPath;
          document.head.appendChild(link);
          currentCss = link;
        }
      });

      if(file === "pokemon_list.html"){
        const module = await import("./pokemon_list.js");
        module.initPokemonList();
      }

      if(file === "pokemon_detail.html"){
        const module = await import("../js/pokemon_detail.js");
        module.initPokemonDetail(query);
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