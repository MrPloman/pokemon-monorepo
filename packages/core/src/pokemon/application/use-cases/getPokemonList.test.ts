// packages/core/src/pokemon/application/use-cases/getPokemonList.test.ts
import { describe, expect, it } from "vitest";
import type { PokemonDetails, PokemonPreview, PokemonType } from "../../domain/Pokemon";
import type { PaginatedResult, PokemonRepository } from "../ports/PokemonRepository";
import { GetPokemonListUseCase } from "./getPokemonList.use-case";

class FakePokemonRepository implements PokemonRepository {
    private pokemonTotal = [
        {
            id: 1,
            name: "bulbasaur",
            imageUrl:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
            types: ["grass", "poison"] as PokemonType[],
        },
        {
            id: 2,
            name: "ivysaur",
            imageUrl:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
            types: ["grass", "poison"] as PokemonType[],
        },
        {
            id: 3,
            name: "venusaur",
            imageUrl:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
            types: ["grass", "poison"] as PokemonType[],
        },
        {
            id: 4,
            name: "charmander",
            imageUrl:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
            types: ["fire"] as PokemonType[],
        },
        {
            id: 5,
            name: "charmeleon",
            imageUrl:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png",
            types: ["fire"] as PokemonType[],
        },
        {
            id: 6,
            name: "charizard",
            imageUrl:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
            types: ["fire", "flying"] as PokemonType[],
        },
        {
            id: 7,
            name: "squirtle",
            imageUrl:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
            types: ["water"] as PokemonType[],
        },
        {
            id: 8,
            name: "wartortle",
            imageUrl:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png",
            types: ["water"] as PokemonType[],
        },
        {
            id: 9,
            name: "blastoise",
            imageUrl:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
            types: ["water"] as PokemonType[],
        },
        {
            id: 25,
            name: "pikachu",
            imageUrl:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
            types: ["electric"] as PokemonType[],
        },
    ];
    async findAllPreview(limit: number, offset: number): Promise<PaginatedResult<PokemonPreview>> {
        return {
            items: this.pokemonTotal.slice(offset, offset + limit),
            hasMore: offset + limit < this.pokemonTotal.length,
            total: this.pokemonTotal.length,
        };
    }
    async findAllNames(): Promise<{ id: number; name: string }[]> {
        return this.pokemonTotal.map((poke: PokemonPreview) => {
            return {
                name: poke.name,
                id: poke.id,
            };
        });
    }

    async findById(id: string): Promise<PokemonDetails | null> {
        const pokemonFind = this.pokemonTotal.find((poke: PokemonPreview) => {
            if (poke && poke.id === Number(id)) return poke;
            else return null;
        });
        if (!pokemonFind) return null;
        else
            return {
                ...pokemonFind,
                height: 1,
                weight: 1,
                abilities: ["None"],
                moves: [],
                stats: {
                    hp: 1,
                    attack: 1,
                    defense: 1,
                    specialAttack: 1,
                    specialDefense: 1,
                    speed: 1,
                },
            };
    }

    async findByType(types: PokemonType[]): Promise<PokemonPreview[]> {
        return this.pokemonTotal.filter((pokemon) =>
            pokemon.types.some((type) => types.includes(type)),
        );
    }
}
describe("GetPokemonListUseCase", () => {
    it("No Filters", async () => {
        const useCase = new GetPokemonListUseCase(new FakePokemonRepository());

        const result = await useCase.execute({ limit: 3, offset: 0 });

        expect(result.items).toHaveLength(3);
        expect(result.total).toBe(10);
    });

    it("Filter only by types", async () => {
        const useCase = new GetPokemonListUseCase(new FakePokemonRepository());
        const result = await useCase.execute({ filters: { types: ["fire"] } });
        expect(result.items).toHaveLength(3);
        result.items.forEach((item) => {
            expect(item.types.includes("fire")).toBe(true);
        });
    });

    it("Search Prefix Name", async () => {
        const useCase = new GetPokemonListUseCase(new FakePokemonRepository());
        const result = await useCase.execute({ filters: { search: "char" } });
        expect(result.items).toHaveLength(3);
        result.items.forEach((item) => {
            expect(item.name.toLocaleLowerCase()).toContain("char");
        });
    });

    it("Combine Search by Type and Search", async () => {
        const useCase = new GetPokemonListUseCase(new FakePokemonRepository());
        const result = await useCase.execute({ filters: { search: "char", types: ["flying"] } });
        expect(result.items).toHaveLength(1);
        result.items.forEach((item) => {
            expect(item.name.toLocaleLowerCase()).toBe("charizard");
        });
    });
});
