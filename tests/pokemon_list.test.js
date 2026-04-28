"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pokemon_list_1 = require("../js/pokemon_list");
describe("capitalize", () => {
    it("capitaliza la primera letra", () => {
        expect((0, pokemon_list_1.capitalize)("pikachu")).toBe("Pikachu");
    });
    it("no cambia el resto del string", () => {
        expect((0, pokemon_list_1.capitalize)("bulbasaur")).toBe("Bulbasaur");
    });
    it("string vacío devuelve string vacío", () => {
        expect((0, pokemon_list_1.capitalize)("")).toBe("");
    });
    it("string de un solo carácter", () => {
        expect((0, pokemon_list_1.capitalize)("a")).toBe("A");
    });
    it("ya capitalizado se mantiene", () => {
        expect((0, pokemon_list_1.capitalize)("Charmander")).toBe("Charmander");
    });
});
