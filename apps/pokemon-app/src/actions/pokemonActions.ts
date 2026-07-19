"use server";

import type { GetPokemonListParams, PaginatedResult, PokemonPreview } from "@repo/core";
import { getPokemonListUseCase } from "../composition/pokemonContainer";

export async function fetchPokemonList(
    params: GetPokemonListParams,
): Promise<PaginatedResult<PokemonPreview>> {
    return getPokemonListUseCase.execute(params);
}
