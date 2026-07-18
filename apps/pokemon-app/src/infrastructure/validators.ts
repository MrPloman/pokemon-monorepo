export function isPokemonDetailsObject(data: unknown) {
    if (typeof data !== "object" || data === null) {
        return false;
    }

    const obj = data as Record<string, unknown>;

    return (
        "id" in obj &&
        typeof obj.id === "number" &&
        "name" in obj &&
        typeof obj.name === "string" &&
        "sprites" in obj &&
        typeof obj.sprites === "object" &&
        !!obj.sprites &&
        "front_default" in obj.sprites &&
        typeof obj.sprites.front_default === "string" &&
        "types" in obj &&
        Array.isArray(obj.types) &&
        "height" in obj &&
        typeof obj.height === "number" &&
        "weight" in obj &&
        typeof obj.weight === "number" &&
        "abilities" in obj &&
        Array.isArray(obj.abilities) &&
        "stats" in obj &&
        Array.isArray(obj.stats)
    );
}
