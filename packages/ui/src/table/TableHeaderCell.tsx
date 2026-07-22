import type { ThHTMLAttributes } from "react";
import { SortIcon } from "./SortIcon";
import styles from "./TableHeaderCell.module.scss";

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
    sortable?: boolean;
    sortDirection?: "ascending" | "descending" | "none";
    onSortToggle?: () => void;
}

export function TableHeaderCell({
    sortable = false,
    sortDirection = "none",
    onSortToggle,
    children,
    ...props
}: TableHeaderCellProps) {
    return (
        <th scope="col" aria-sort={sortable ? sortDirection : undefined} {...props}>
            {sortable ? (
                <button type="button" onClick={onSortToggle} className={styles.sortButton}>
                    {children}
                    <SortIcon direction={sortDirection} />
                </button>
            ) : (
                children
            )}
        </th>
    );
}
