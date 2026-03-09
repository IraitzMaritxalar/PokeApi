function loadPage(page) {
  fetch(`../html/${page}`)
    .then(res => res.text())
    .then(html => {
      document.getElementById("content").innerHTML = html;
    });
}

document.getElementById("homeBtn").addEventListener("click", () => {
  loadPage("home.html");
});

document.getElementById("pokemonBtn").addEventListener("click", () => {
  loadPage("pokemon_list.html");
});

loadPage("home.html");