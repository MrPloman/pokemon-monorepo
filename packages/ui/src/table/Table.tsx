import type { TableHTMLAttributes } from "react";
import styles from "./Table.module.scss";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {}

export function Table({ children, className, ...props }: TableProps) {
    return (
        <table className={`${styles.table} ${className ?? ""}`} {...props}>
            {children}
        </table>
    );
}
