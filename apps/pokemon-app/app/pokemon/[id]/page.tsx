import { Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@repo/ui";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPokemonDetailUseCase } from "@/src/composition/pokemonContainer";
import { getTypeColor } from "@/src/presentation/pokemon/pokemonColors";
import styles from "./PokemonDetailPage.module.scss";

const STAT_LABELS: Record<string, string> = {
    hp: "HP",
    attack: "Atack",
    defense: "Defense",
    specialAttack: "Sp. Attack",
    specialDefense: "Sp. Defense",
    speed: "Speed",
};

const MAX_STAT = 255;

export default async function PokemonDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const pokemon = await getPokemonDetailUseCase.execute(id);

    if (!pokemon) {
        redirect("/pokemon");
    }

    const accentColor = getTypeColor(pokemon.types[0]);
    const capitalizedName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);

    return (
        <article className={styles.page}>
            <Link href="/pokemon" className={styles.backLink}>
                ← Back to List
            </Link>

            <header className={styles.hero} style={{ backgroundColor: accentColor }}>
                <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    width={220}
                    height={220}
                    className={styles.heroImage}
                />
                <div className={styles.heroInfo}>
                    <span className={styles.heroNumber}>
                        #{String(pokemon.id).padStart(3, "0")}
                    </span>
                    <h1 className={styles.heroName}>{capitalizedName}</h1>
                    <div className={styles.heroBadges}>
                        {pokemon.types.map((type) => (
                            <Badge
                                key={type}
                                label={type}
                                color={getTypeColor(type)}
                                selected={false}
                            />
                        ))}
                    </div>
                </div>
            </header>

            <section className={styles.infoGrid} aria-label="Datos físicos">
                <div className={styles.infoCard}>
                    <span className={styles.infoLabel}>Height</span>
                    <span className={styles.infoValue}>{(pokemon.height / 10).toFixed(1)} m</span>
                </div>
                <div className={styles.infoCard}>
                    <span className={styles.infoLabel}>Weight</span>
                    <span className={styles.infoValue}>{(pokemon.weight / 10).toFixed(1)} kg</span>
                </div>
                <div className={styles.infoCard}>
                    <span className={styles.infoLabel}>Skills</span>
                    <span className={styles.infoValue}>
                        {pokemon.abilities.map((a) => a.replace("-", " ")).join(", ")}
                    </span>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Base Stats</h2>
                <div className={styles.statsList}>
                    {Object.entries(pokemon.stats).map(([key, value]) => (
                        <div key={key} className={styles.statRow}>
                            <span className={styles.statLabel}>{STAT_LABELS[key] ?? key}</span>
                            <div
                                className={styles.statBarTrack}
                                role="progressbar"
                                aria-valuenow={value}
                                aria-valuemin={0}
                                aria-valuemax={MAX_STAT}
                                aria-label={`${STAT_LABELS[key] ?? key}: ${value} de ${MAX_STAT}`}
                            >
                                <div
                                    className={styles.statBarFill}
                                    style={{
                                        width: `${Math.min((value / MAX_STAT) * 100, 100)}%`,
                                        backgroundColor: accentColor,
                                    }}
                                />
                            </div>
                            <span className={styles.statValue}>{value}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Moves ({pokemon.moves.length})</h2>
                <div className={styles.movesTableWrapper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>Name</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pokemon.moves.map((move) => (
                                <TableRow key={move}>
                                    <TableCell>{move.replace(/-/g, " ")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>
        </article>
    );
}
