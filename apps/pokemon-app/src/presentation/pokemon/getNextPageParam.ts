import type { PaginatedResult } from "@repo/core";

export function getNextPageParam<T>(
    lastPage: PaginatedResult<T>,
    allPages: PaginatedResult<T>[],
): number | undefined {
    if (!lastPage.hasMore) return undefined;
    return allPages.reduce((previousPage, currentPage) => {
        return previousPage + currentPage.items.length;
    }, 0);
}
