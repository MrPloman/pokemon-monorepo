import type { PokemonDetails, PokemonPreview } from "../../domain/Pokemon";

export interface PokemonRepository {
    findAll(): Promise<PokemonPreview[]>;
    findById(id: string): Promise<PokemonDetails | null>;
}
