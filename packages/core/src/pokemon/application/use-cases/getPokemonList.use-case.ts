import { isPokemonType, PokemonDetails, PokemonPreview, PokemonType } from "../../domain/Pokemon";
import { PokemonFilters } from "../interfaces/PokemonFilters";
import { PaginatedResult, PokemonRepository } from "../ports/PokemonRepository";
export interface GetPokemonListParams {
    limit?: number;
    offset?: number;
    filters?: PokemonFilters;
}
export class GetPokemonListUseCase {
    constructor(private readonly pokemonRepository: PokemonRepository) {}

    private paginateInMemory(
        items: PokemonPreview[],
        limit: number,
        offset: number,
    ): PaginatedResult<PokemonPreview> {
        return {
            items: items.slice(offset, offset + limit),
            total: items.length,
            hasMore: offset + limit < items.length,
        };
    }

    async execute(params: GetPokemonListParams = {}): Promise<PaginatedResult<PokemonPreview>> {
        const { limit = 10, offset = 0, filters } = params;

        const hasSearch = !!filters?.search;

        const validTypes: PokemonType[] = filters?.types?.filter((t) => isPokemonType(t)) ?? [];
        const hasTypes = validTypes.length > 0;

        if (!hasSearch && !hasTypes) {
            return this.pokemonRepository.findAllPreview(limit, offset);
        }

        if (hasTypes && !hasSearch) {
            const items = await this.pokemonRepository.findByType(validTypes);
            return this.paginateInMemory(items, limit, offset);
        }

        const allNames = await this.pokemonRepository.findAllNames();
        const search = filters!.search!.toLowerCase();
        let matches = allNames.filter((p) => p.name.toLowerCase().startsWith(search));

        if (hasTypes) {
            const typeMatches = await this.pokemonRepository.findByType(validTypes);
            const typeMatchIds = new Set(typeMatches.map((p) => p.id));
            matches = matches.filter((p) => typeMatchIds.has(p.id));
        }

        const total = matches.length;
        const page = matches.slice(offset, offset + limit);

        const details = await Promise.all(
            page.map((p) => this.pokemonRepository.findById(String(p.id))),
        );

        return {
            items: details.filter((p): p is PokemonDetails => p !== null),
            total,
            hasMore: offset + limit < total,
        };
    }
}
