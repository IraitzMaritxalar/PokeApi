import { capitalize } from "../js/pokemon_list"; 

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