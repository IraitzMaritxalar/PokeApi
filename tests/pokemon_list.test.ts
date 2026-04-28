import { capitalize } from "../js/pokemon_list"; 
import { isInDreamTeam } from "../js/pokemon_list";

describe("capitalize", () => {

  it("capitaliza la primera letra", () => {
    expect(capitalize("pikachu")).toBe("Pikachu");
  });

  it("no cambia el resto del string", () => {
    expect(capitalize("bulbasaur")).toBe("Bulbasaur");
  });

  it("string vacío devuelve string vacío", () => {
    expect(capitalize("")).toBe("");
  });

  it("string de un solo carácter", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("ya capitalizado se mantiene", () => {
    expect(capitalize("Charmander")).toBe("Charmander");
  });

});

describe("isInDreamTeam", () => {
  it("devuelve false si no hay nada en localStorage", () => {
    localStorage.clear();

    expect(isInDreamTeam(1)).toBe(false);
  });

  it("devuelve true si el pokemon está en el dream team", () => {
    localStorage.setItem(
      "dreamTeam",
      JSON.stringify([{ id: 25, name: "pikachu" }])
    );

    expect(isInDreamTeam(25)).toBe(true);
  });

  it("devuelve false si el pokemon no está en el dream team", () => {
    localStorage.setItem(
      "dreamTeam",
      JSON.stringify([{ id: 25, name: "pikachu" }])
    );

    expect(isInDreamTeam(1)).toBe(false);
  });

  it("funciona con varios pokemon en el equipo", () => {
    localStorage.setItem(
      "dreamTeam",
      JSON.stringify([
        { id: 1, name: "bulbasaur" },
        { id: 4, name: "charmander" },
        { id: 7, name: "squirtle" }
      ])
    );

    expect(isInDreamTeam(4)).toBe(true);
  });

  it("devuelve false si localStorage está corrupto o vacío", () => {
    localStorage.setItem("dreamTeam", "[]");

    expect(isInDreamTeam(999)).toBe(false);
  });
});