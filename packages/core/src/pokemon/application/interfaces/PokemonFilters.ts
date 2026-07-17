import { PokemonType } from "../../domain/Pokemon";

export interface PokemonFilters {
    search?: string;
    types?: PokemonType[];
}
