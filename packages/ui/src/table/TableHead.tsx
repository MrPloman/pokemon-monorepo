import type { HTMLAttributes } from "react";

export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {}

export function TableHead({ children, ...props }: TableHeadProps) {
    return <thead {...props}>{children}</thead>;
}
