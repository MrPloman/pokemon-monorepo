import Image from "next/image";
import { Button } from "@repo/ui";

export default function Home() {
    return (
        <div>
            <main>
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
            </main>
        </div>
    );
}
