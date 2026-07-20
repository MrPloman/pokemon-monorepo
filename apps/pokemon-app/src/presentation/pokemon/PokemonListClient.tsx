"use client";
import { fetchPokemonList } from "@/src/actions/pokemonActions";
import { pokemonKeys } from "@/src/queries/pokemonQueriesKeys";
import {
    PaginatedResult,
    PokemonFilters,
    PokemonPreview,
    PokemonType,
    ALL_POKEMON_TYPES,
} from "@repo/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getNextPageParam } from "./getNextPageParam";
import { Badge, Card } from "@repo/ui";
import { getTypeColor } from "./pokemonColors";

// Function Component for the client-side rendering of the component. Pokemon page.tsx child. It renders the UI.
export function PokemonListClient() {
    // Importing all types of Pokemon from the core package. This is used to render the filter badges for each type.
    const ALL_TYPES = ALL_POKEMON_TYPES;

    // Setting the useState hook to manage the filters for the query.
    const [filters, updateFilters] = useState<PokemonFilters>({
        search: "",
        types: [],
    });

    // This is a reference to detect when the user reach the end of the page and trigger the next page fetch.
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Hook to update the search filter when the user types in the search input.
    const searchChanged = (search: string) => {
        updateFilters((previousValue: PokemonFilters) => ({ ...previousValue, search }));
    };

    // Hook to update the filters when the user selects or deselects a type.
    const filtersChanged = (type: PokemonType) => {
        updateFilters((previousValue: PokemonFilters) => ({
            ...previousValue,
            types: updateTypesArray(type, previousValue.types ?? []),
        }));
    };

    // Functions what checks the array of types and adds or removes the type.
    const updateTypesArray = (type: PokemonType, types: PokemonType[]): PokemonType[] => {
        if (types.includes(type)) return types.filter((currentType) => currentType !== type);
        else return [...types, type];
    };

    // The component core. When the filters change, the query is re-fetched with the new filters.
    // The useInfiniteQuery hook is used to fetch the data for an infinite query, which is useful for paginated data fetching.
    const query = useInfiniteQuery({
        queryKey: pokemonKeys.list(filters),
        queryFn: ({ pageParam }) => fetchPokemonList({ limit: 10, offset: pageParam, filters }),
        initialPageParam: 0,
        getNextPageParam,
    });

    // Parsing of the data from the query to get all the items in a flat array. This is used to render the list of Pokemon.
    const allItems = query.data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        // When the component is mounted, we create an IntersectionObserver to detect when the user reaches the end of the page.
        // When the sentinel element is intersecting, we fetch the next page of data if there is a next page and we are not already fetching the next page.
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        // Observer which checks if the sentinel is intersecting with the viewport.
        // If it is, and there is a next page, and we are not already fetching the next page, we fetch the next page.
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
                    query.fetchNextPage();
                }
            },
            { rootMargin: "200px" },
        );

        // Sentinel watching activation
        observer.observe(sentinel);
        // Cleanup function to disconnect the observer when the component is unmounted or when the dependencies change.
        // This prevents memory leaks and ensures that the observer is not left running when it is no longer needed.
        return () => observer.disconnect();
    }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

    return (
        <div>
            <input
                type="text"
                value={filters.search}
                onChange={(e) => searchChanged(e.target.value)}
                placeholder="Buscar Pokémon..."
            />

            <div>
                {ALL_TYPES.map((type: PokemonType) => (
                    <Badge
                        key={type}
                        label={type}
                        color={getTypeColor(type)}
                        selected={filters.types?.includes(type) ?? false}
                        onClick={() => filtersChanged(type)}
                    />
                ))}
            </div>

            <div>
                {allItems.map((pokemon: PokemonPreview) => (
                    <Card
                        key={pokemon.id}
                        id={String(pokemon.id)}
                        title={pokemon.name}
                        img={{ src: pokemon.imageUrl, alt: pokemon.name }}
                        buttons={[{ variant: "primary", label: "Ver detalle" }]}
                        badges={pokemon.types.map((type) => ({
                            label: type,
                            color: getTypeColor(type),
                            selected: false,
                        }))}
                    />
                ))}
            </div>

            {query.hasNextPage && (
                <>
                    <div ref={sentinelRef} style={{ height: "1px" }} />
                    {query.isFetchingNextPage && <p>Cargando más...</p>}
                </>
            )}
        </div>
    );
}
