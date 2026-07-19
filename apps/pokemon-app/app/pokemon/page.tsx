import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchPokemonList } from "../../src/actions/pokemonActions";
import { pokemonKeys } from "@/src/queries/pokemonQueriesKeys";
import { PokemonListClient } from "@/src/presentation/pokemon/PokemonListClient";
import { PokemonFilters } from "@repo/core";
import { getNextPageParam } from "@/src/presentation/pokemon/getNextPageParam";

export default async function PokemonListPage() {
    const queryClient = new QueryClient();
    const initialFilters: PokemonFilters = { search: "", types: [] };

    await queryClient.prefetchInfiniteQuery({
        queryKey: pokemonKeys.list(initialFilters),
        queryFn: () => fetchPokemonList({ limit: 10, offset: 0, filters: initialFilters }),
        initialPageParam: 0,
        getNextPageParam,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PokemonListClient />
        </HydrationBoundary>
    );
}
