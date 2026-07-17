import { PokemonPreview } from "../../domain/Pokemon";
import { PokemonFilters } from "../interfaces/PokemonFilters";
import { PokemonRepository } from "../ports/PokemonRepository";
export class GetPokemonListUseCase {
    constructor(private readonly pokemonRepository: PokemonRepository) {}

    async execute(filters?: PokemonFilters): Promise<PokemonPreview[]> {
        const pokemonList = await this.pokemonRepository.findAll();
        let result = pokemonList;
        if (filters?.types) {
            result = result.filter((p) => p.types.some((t) => filters.types!.includes(t)));
        }
        if (filters?.search) {
            result = result.filter((p) =>
                p.name.toLowerCase().includes(filters.search!.toLowerCase()),
            );
        }
        return result;
    }
}
