import type { ButtonHTMLAttributes } from "react";
import { getAccessibleTextColor } from "../utils/getAccessibleTextColor";
import styles from "./Badge.module.scss";

export interface BadgeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    color: string;
    selected?: boolean;
}

export function Badge({ label, color, selected = false, className, ...props }: BadgeProps) {
    const textColor = getAccessibleTextColor(color);
    return (
        <button
            type="button"
            className={`${styles.badge} ${selected ? styles.selected : ""} ${className ?? ""}`}
            style={
                { "--badge-color": color, "--badge-text-color": textColor } as React.CSSProperties
            }
            aria-pressed={selected}
            {...props}
        >
            {label}
        </button>
    );
}
