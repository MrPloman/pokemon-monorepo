import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchPokemonList } from "../../src/actions/pokemonActions";
import { pokemonKeys } from "@/src/queries/pokemonQueriesKeys";
import { PokemonListClient } from "@/src/presentation/pokemon/PokemonListClient";

export default async function PokemonListPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: pokemonKeys.list(),
        queryFn: () => fetchPokemonList({ limit: 10, offset: 0 }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PokemonListClient />
        </HydrationBoundary>
    );
}
