// app/pokemon/page.tsx
import { getPokemonListUseCase } from "@/src/composition/pokemonContainer";
import { Card, Badge } from "@repo/ui";
import { getTypeColor } from "@/src/presentation/pokemon/pokemonColors";
import { PokeApiPokemonRepository } from "@/src/infrastructure/PokeApiPokemonRepository";

export default async function PokemonListPage() {
    const pokemonList = await getPokemonListUseCase.execute();
    const repo = new PokeApiPokemonRepository();
    const result = await repo.findByType(["fire", "water"]);

    return (
        <div>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            {pokemonList.items.map((pokemon: any) => (
                <Card
                    key={pokemon.id}
                    id={String(pokemon.id)}
                    title={pokemon.name}
                    badges={pokemon.types.map((type: string) => ({
                        label: type,
                        color: getTypeColor(type),
                        selected: false,
                    }))}
                    img={{ src: pokemon.imageUrl, alt: pokemon.name }}
                    buttons={[{ variant: "primary", label: "Ver detalle" }]}
                />
            ))}
        </div>
    );
}
