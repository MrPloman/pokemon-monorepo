"use client";
import {
    ALL_POKEMON_TYPES,
    type PokemonFilters,
    type PokemonPreview,
    type PokemonType,
} from "@repo/core";
import {
    Badge,
    Button,
    Card,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@repo/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchPokemonList } from "@/src/actions/pokemonActions";
import { pokemonKeys } from "@/src/queries/pokemonQueriesKeys";
import { getNextPageParam } from "./getNextPageParam";
import styles from "./PokemonListClient.module.scss";
import { getTypeColor } from "./pokemonColors";

// Function Component for the client-side rendering of the component. Pokemon page.tsx child. It renders the UI.
export function PokemonListClient() {
    // Setting Router
    const router = useRouter();

    // Setting the useState hook to manage the filters for the query.
    const [filters, updateFilters] = useState<PokemonFilters>({
        search: "",
        types: [],
    });

    // This is a state hook to store the current view mode (cards or table).
    const [view, setView] = useState<"cards" | "table">("cards");

    // This is a state hook to store the sorting state for the table view.
    const [sorting, setSorting] = useState<SortingState>([]);

    // This is a reference to detect when the user reach the end of the page and trigger the next page fetch.
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Importing all types of Pokemon from the core package. This is used to render the filter badges for each type.
    const ALL_TYPES = ALL_POKEMON_TYPES;

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
        if (types.length >= 2) return types; // ya hay 2, ignora la selección de un tercero
        return [...types, type];
    };

    // The component core. When the filters change, the query is re-fetched with the new filters.
    // The useInfiniteQuery hook is used to fetch the data for an infinite query, which is useful for paginated data fetching.
    const query = useInfiniteQuery({
        queryKey: pokemonKeys.list(filters),
        queryFn: ({ pageParam }) => fetchPokemonList({ limit: 10, offset: pageParam, filters }),
        initialPageParam: 0,
        getNextPageParam,
    });

    // This is a state hook to store all the items fetched from the  query. It is used to render the list of Pokemon.
    const allItems = useMemo(
        () => query.data?.pages.flatMap((page) => page.items) ?? [],
        [query.data],
    );
    const columnHelper = useMemo(() => createColumnHelper<PokemonPreview>(), []);

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "actions",
                header: "",
                cell: (info) => (
                    <Button
                        variant="secondary"
                        label="Ver"
                        onClick={() => router.push(`/pokemon/${info.row.original.id}`)}
                    />
                ),
            }),
            columnHelper.accessor("id", {
                header: "Número",
                cell: (info) => info.getValue(),
                enableSorting: true,
            }),
            columnHelper.accessor("name", {
                header: "Nombre",
                cell: (info) => info.getValue()[0].toUpperCase() + info.getValue().slice(1),
                enableSorting: true,
            }),
            columnHelper.accessor("types", {
                cell: (info) => (
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        {info.getValue().map((type: string) => (
                            <span
                                key={type}
                                style={{
                                    backgroundColor: getTypeColor(type),
                                    color: "#fff",
                                    padding: "0.15rem 0.6rem",
                                    borderRadius: "999px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    textTransform: "capitalize",
                                }}
                            >
                                {type}
                            </span>
                        ))}
                    </div>
                ),
                enableSorting: false,
            }),
        ],
        [columnHelper, router.push],
    );

    const table = useReactTable({
        data: allItems,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

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
        <div className={styles.pageContainer}>
            <div className={styles.controls}>
                <div className={styles.searchRow}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        value={filters.search}
                        onChange={(e) => searchChanged(e.target.value)}
                        placeholder="Search Pokemon..."
                        aria-label="Search Pokemon by name..."
                    />
                    <button
                        type="button"
                        className={styles.viewToggle}
                        onClick={() => setView((v) => (v === "cards" ? "table" : "cards"))}
                        aria-pressed={view === "table"}
                    >
                        View as {view === "cards" ? "table" : "cards"}
                    </button>
                </div>

                <div className={styles.typeFilters}>
                    {ALL_TYPES.map((type) => {
                        const isSelected = filters.types?.includes(type) ?? false;
                        const limitReached = (filters.types?.length ?? 0) >= 2;
                        return (
                            <Badge
                                key={type}
                                label={type}
                                color={getTypeColor(type)}
                                selected={isSelected}
                                disabled={!isSelected && limitReached}
                                onClick={() => filtersChanged(type)}
                            />
                        );
                    })}
                </div>
            </div>

            {query.isLoading ? (
                <div className={styles.cardsGrid}>
                    {Array.from({ length: 6 }).map((_, i: number) => (
                        /* biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list, never reorders */
                        <Skeleton key={`skeleton${i}`} variant="rect" height={320} />
                    ))}
                </div>
            ) : view === "cards" ? (
                <div className={styles.cardsGrid}>
                    {allItems.map((pokemon) => (
                        <Card
                            key={pokemon.id}
                            id={String(pokemon.id)}
                            title={pokemon.name}
                            img={{ src: pokemon.imageUrl, alt: pokemon.name }}
                            buttons={[
                                {
                                    variant: "primary",
                                    label: "View Detail",
                                    onClick: () => router.push(`/pokemon/${pokemon.id}`),
                                },
                            ]}
                            badges={pokemon.types.map((type) => ({
                                label: type,
                                color: getTypeColor(type),
                                selected: false,
                            }))}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <Table>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHeaderCell
                                            key={header.id}
                                            sortable={header.column.getCanSort()}
                                            sortDirection={
                                                header.column.getIsSorted() === "asc"
                                                    ? "ascending"
                                                    : header.column.getIsSorted() === "desc"
                                                      ? "descending"
                                                      : "none"
                                            }
                                            onSortToggle={() => header.column.toggleSorting()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </TableHeaderCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {query.hasNextPage && (
                <>
                    <div ref={sentinelRef} style={{ height: "1px" }} />
                    {query.isFetchingNextPage && <p className={styles.loadingMore}>Loading...</p>}
                </>
            )}
        </div>
    );
}
