import styles from "./Badge.module.scss";
import type { ButtonHTMLAttributes } from "react";

export interface BadgeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    color: string;
    selected: boolean;
}

export function Badge({ label, color, selected = false, className, ...props }: BadgeProps) {
    return (
        <button
            type="button"
            className={`${styles.badge} ${selected ? styles.selected : ""} ${className ?? ""}`}
            style={{ "--badge-color": color } as React.CSSProperties}
            aria-pressed={selected}
            {...props}
        >
            {label}
        </button>
    );
}
