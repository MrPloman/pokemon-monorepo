import Image from "next/image";
import { Button, Card, Badge } from "@repo/ui";

export default function Home() {
    return (
        <div>
            <main>
                <Badge label="Nuevo" color="green" selected={true} />
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={100}
                    height={20}
                    priority
                />
                <Button variant="secondary" label="Secundario" />
                <Button disabled label="Deshabilitado" />
                <Card
                    img={{
                        src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
                        alt: "Pokemon",
                    }}
                    id={"1"}
                    title="Bulbasaur"
                    buttons={[
                        { variant: "primary", label: "Ver detalles" },
                        { variant: "secondary", label: "Compartir" },
                    ]}
                />
            </main>
        </div>
    );
}
