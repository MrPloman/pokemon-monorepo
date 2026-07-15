import styles from "./Skeleton.module.scss";

interface SkeletonProps {
    variant?: "rect" | "circle" | "text";
    width?: string | number;
    height?: string | number;
}

export function Skeleton({ variant = "rect", width, height }: SkeletonProps) {
    return (
        <span
            className={`${styles.skeleton} ${styles[variant]}`}
            style={{ width, height }}
            aria-busy="true"
            aria-hidden="true"
        />
    );
}
