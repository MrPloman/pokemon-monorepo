import type { TdHTMLAttributes } from "react";

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ children, ...props }: TableCellProps) {
    return <td {...props}>{children}</td>;
}
