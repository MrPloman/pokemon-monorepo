import type { PokemonDetails, PokemonPreview } from "../../domain/Pokemon";

export interface PokemonRepository {
    findAll(): Promise<{ results: PokemonPreview[] | []; next: string; count: number }>;
    findById(id: string): Promise<PokemonDetails | null>;
}
