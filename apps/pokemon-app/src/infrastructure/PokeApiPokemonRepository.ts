import type { PokemonDetails, PokemonPreview, PokemonType } from "@repo/core";
import { PaginatedResult, PokemonRepository } from "@repo/core";
import { isPokemonDetailsObject } from "./validators";

function mapToPokemonDetails(raw: unknown): PokemonDetails | null {
    let pokemonDetails: any = raw;
    if (!isPokemonDetailsObject(pokemonDetails)) return null;
    else
        return {
            id: pokemonDetails.id,
            name: pokemonDetails.name,
            imageUrl: pokemonDetails.sprites.front_default,
            moves: [
                ...pokemonDetails.moves.map(
                    (move: { move: { name: string } }) =>
                        move.move.name[0].toLocaleUpperCase() + move.move.name.slice(1),
                ),
            ],
            types: [
                ...pokemonDetails.types.map(
                    (typeDetected: { type: { name: string }; slot: number }) =>
                        typeDetected.type.name,
                ),
            ],
            height: pokemonDetails.height,
            weight: pokemonDetails.weight,
            abilities: [
                ...pokemonDetails.abilities.map(
                    (ability: { ability: { name: string } }) => ability.ability.name,
                ),
            ],
            stats: {
                hp: pokemonDetails.stats.find((s: any) => s.stat.name === "hp")?.base_stat ?? 0,
                attack:
                    pokemonDetails.stats.find((s: any) => s.stat.name === "attack")?.base_stat ?? 0,
                defense:
                    pokemonDetails.stats.find((s: any) => s.stat.name === "defense")?.base_stat ??
                    0,
                specialAttack:
                    pokemonDetails.stats.find((s: any) => s.stat.name === "special-attack")
                        ?.base_stat ?? 0,
                specialDefense:
                    pokemonDetails.stats.find((s: any) => s.stat.name === "special-defense")
                        ?.base_stat ?? 0,
                speed:
                    pokemonDetails.stats.find((s: any) => s.stat.name === "speed")?.base_stat ?? 0,
            },
        };
}
async function findByUrl(url: string): Promise<PokemonDetails | null> {
    if (!url) return null;
    const response = await fetch(url);
    const pokemonDetails: unknown = await response.json();
    if (!pokemonDetails) return null;
    return mapToPokemonDetails(pokemonDetails);
}
export class PokeApiPokemonRepository implements PokemonRepository {
    private readonly baseUrl = process.env.POKEAPI_BASE_URL || "https://pokeapi.co/api/v2";

    async findAllPreview(limit = 10, offset = 0): Promise<PaginatedResult<PokemonPreview>> {
        const response = await fetch(`${this.baseUrl}/pokemon/?limit=${limit}&offset=${offset}`);
        const {
            count,
            next,
            results,
        }: {
            count: number;
            next: string;
            results: { name: string; url: string }[];
        } = await response.json();
        if (!results || results.length === 0)
            return {
                items: [],
                hasMore: false,
                total: 0,
            };
        const pokemonPromises = results.map(async (pokemon: { name: string; url: string }) => {
            const _pokemon = await findByUrl(pokemon.url);
            return _pokemon || null;
        });

        const resolvedList = await Promise.all(pokemonPromises);

        let pokemonList: PokemonDetails[] = resolvedList.filter(
            (pokemon): pokemon is PokemonDetails => pokemon !== null,
        );
        if (!pokemonList || pokemonList.length === 0 || !Array.isArray(pokemonList))
            return {
                items: [],
                hasMore: false,
                total: 0,
            };
        else
            return {
                items: pokemonList.map((value: PokemonDetails): PokemonPreview => {
                    return {
                        id: value.id,
                        name: value.name,
                        imageUrl: value.imageUrl,
                        types: value.types,
                    };
                }),
                hasMore: !!next,
                total: count,
            };
    }

    async findAllNames(): Promise<{ id: number; name: string }[]> {
        const response = await fetch(`${this.baseUrl}/pokemon/?limit=1351`);
        const {
            results,
        }: {
            count: number;
            next: string;
            results: { name: string; url: string }[];
        } = await response.json();
        return results.map(
            (pokemon: { name: string; url: string }): { name: string; id: number } => {
                const parts = pokemon.url.split("/").filter(Boolean);
                const id = parts[parts.length - 1];
                return { name: pokemon.name, id: Number(id) };
            },
        );
    }

    async findById(id: string): Promise<PokemonDetails | null> {
        if (!id) return null;
        const response = await fetch(`${this.baseUrl}/pokemon/${id}`);
        const pokemonDetails: unknown = await response.json();
        if (!pokemonDetails) return null;
        return mapToPokemonDetails(pokemonDetails);
    }

    async findByType(types: PokemonType[]): Promise<PokemonPreview[]> {
        if (types.length === 0) return [];

        const responses = await Promise.all(
            types.map((type) => fetch(`${this.baseUrl}/type/${type}`)),
        );
        const typeDataList = await Promise.all(responses.map((r) => r.json()));

        const listsByType: { name: string; url: string }[][] = typeDataList.map((data) =>
            data.pokemon.map((p: { pokemon: { name: string; url: string } }) => p.pokemon),
        );

        const [first, ...rest] = listsByType;
        const intersected = first.filter((p) =>
            rest.every((list) => list.some((q) => q.name === p.name)),
        );

        const responsesPokemonDetail = await Promise.allSettled(
            intersected.map((p) => fetch(p.url)),
        );
        const successfulResponses = responsesPokemonDetail
            .filter((r): r is PromiseFulfilledResult<Response> => r.status === "fulfilled")
            .map((r) => r.value);

        const pokemonStructuredInfo = await Promise.all(successfulResponses.map((r) => r.json()));

        return pokemonStructuredInfo
            .map((raw) => mapToPokemonDetails(raw))
            .filter((p): p is PokemonDetails => p !== null)
            .map((d) => ({ id: d.id, name: d.name, imageUrl: d.imageUrl, types: d.types }));
    }
}
