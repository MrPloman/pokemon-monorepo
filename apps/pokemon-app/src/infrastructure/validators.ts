import type { PokemonType } from "@repo/core";

interface RawPokemonType {
    slot: number;
    type: { name: PokemonType };
}

interface RawPokemonAbility {
    ability: { name: string };
}

interface RawPokemonMove {
    move: { name: string };
}

interface RawPokemonStat {
    base_stat: number;
    stat: { name: string };
}

interface RawPokemonDetails {
    id: number;
    name: string;
    sprites: { front_default: string };
    types: RawPokemonType[];
    moves: RawPokemonMove[];
    height: number;
    weight: number;
    abilities: RawPokemonAbility[];
    stats: RawPokemonStat[];
}

export function isPokemonDetailsObject(data: unknown): data is RawPokemonDetails {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;

    return (
        "id" in obj &&
        typeof obj.id === "number" &&
        "name" in obj &&
        typeof obj.name === "string" &&
        "sprites" in obj &&
        typeof obj.sprites === "object" &&
        !!obj.sprites &&
        "front_default" in (obj.sprites as object) &&
        typeof (obj.sprites as Record<string, unknown>).front_default === "string" &&
        "types" in obj &&
        Array.isArray(obj.types) &&
        "moves" in obj &&
        Array.isArray(obj.moves) &&
        "height" in obj &&
        typeof obj.height === "number" &&
        "weight" in obj &&
        typeof obj.weight === "number" &&
        "abilities" in obj &&
        Array.isArray(obj.abilities) &&
        "stats" in obj &&
        Array.isArray(obj.stats)
    );
}
