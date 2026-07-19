// apps/pokemon-app/src/queries/pokemonQueryKeys.ts
import type { PokemonFilters } from "@repo/core";

export const pokemonKeys = {
    list: (filters?: PokemonFilters) => ["pokemon", "list", filters ?? {}] as const,
};
