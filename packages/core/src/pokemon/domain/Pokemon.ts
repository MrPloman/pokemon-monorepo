export type PokemonType =
    | "normal"
    | "fire"
    | "water"
    | "electric"
    | "grass"
    | "ice"
    | "fighting"
    | "poison"
    | "ground"
    | "flying"
    | "psychic"
    | "bug"
    | "rock"
    | "ghost"
    | "dragon"
    | "dark"
    | "steel"
    | "fairy";

export const ALL_POKEMON_TYPES: PokemonType[] = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
];

export function isPokemonType(value: unknown): value is PokemonType {
    return typeof value === "string" && ALL_POKEMON_TYPES.includes(value as PokemonType);
}

export interface PokemonPreview {
    id: number;
    name: string;
    imageUrl: string;
    types: PokemonType[];
}

export interface PokemonDetails extends PokemonPreview {
    height: number;
    weight: number;
    abilities: string[];
    moves: string[];
    stats: {
        hp: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
        speed: number;
    };
}
