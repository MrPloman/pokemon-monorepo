import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchPokemonList } from "../../src/actions/pokemonActions";
import { pokemonKeys } from "@/src/queries/pokemonQueriesKeys";
import { PokemonListClient } from "@/src/presentation/pokemon/PokemonListClient";
import { PokemonFilters } from "@repo/core";
import { getNextPageParam } from "@/src/presentation/pokemon/getNextPageParam";

// Server Component Parent. This whole system is designed to prefetch the first call without using client-side rendering. No javascript needed.
export default async function PokemonListPage() {
    // Initialize a new QueryClient instance for server-side rendering. Completely diferent from the client-side QueryProvider instance.
    const queryClient = new QueryClient();

    // Define the initial filters for the query. This is important to ensure that the query is pre-fetched with the correct parameters.
    const initialFilters: PokemonFilters = { search: "", types: [] };

    // Fetching the initial data for the pokemon list with the initial filters. This will populate the cache with the data needed for the client-side rendering.
    // The prefetchInfiniteQuery method is used to prefetch the data for an infinite query, which is useful for paginated data fetching.
    await queryClient.prefetchInfiniteQuery({
        // This key has to match the key used in the client-side query to ensure that the cached data is correctly associated with the query.
        queryKey: pokemonKeys.list(initialFilters),
        // Function that fetches the data for the query. It uses the initial filters and starts from the first page (offset 0).
        queryFn: () => fetchPokemonList({ limit: 10, offset: 0, filters: initialFilters }),
        // The initial page parameter is set to 0, indicating that the first page of data should be fetched.
        initialPageParam: 0,
        // Function that determines the next page parameter based on the last page of data fetched. This is used for infinite scrolling or pagination.
        getNextPageParam,
    });

    return (
        // The HydrationBoundary component is used to wrap the client-side component, allowing it to access the pre-fetched data from the server-side query.
        // The dehydrate function is used to serialize the queryClient's state, which is then passed to the client-side component for hydration.
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PokemonListClient />
        </HydrationBoundary>
    );
}
