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

export function PokemonListClient() {
    const ALL_TYPES = ALL_POKEMON_TYPES;
    const [filters, updateFilters] = useState<PokemonFilters>({
        search: "",
        types: [],
    });
    const sentinelRef = useRef<HTMLDivElement>(null);

    const searchChanged = (search: string) => {
        updateFilters((previousValue: PokemonFilters) => ({ ...previousValue, search }));
    };
    const filtersChanged = (type: PokemonType) => {
        updateFilters((previousValue: PokemonFilters) => ({
            ...previousValue,
            types: updateTypesArray(type, previousValue.types ?? []),
        }));
    };
    const updateTypesArray = (type: PokemonType, types: PokemonType[]): PokemonType[] => {
        if (types.includes(type)) return types.filter((currentType) => currentType !== type);
        else return [...types, type];
    };

    const query = useInfiniteQuery({
        queryKey: pokemonKeys.list(filters),
        queryFn: ({ pageParam }) => fetchPokemonList({ limit: 10, offset: pageParam, filters }),
        initialPageParam: 0,
        getNextPageParam,
    });

    const allItems = query.data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
                    query.fetchNextPage();
                }
            },
            { rootMargin: "200px" },
        );

        observer.observe(sentinel);
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
