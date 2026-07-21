// apps/pokemon-app/app/layout.tsx
import type { Metadata } from "next";
import "./globals.scss";
import "@repo/ui/dist/index.css";
import { Layout } from "@repo/ui";
import { QueryProvider } from "../src/providers/QueryProvider";

export const metadata: Metadata = {
    title: "Pokédex — Prueba Técnica",
    description: "Prueba técnica Frontend Developer — Ediversa",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body>
                <QueryProvider>
                    <Layout
                        header={<span>Pokédex</span>}
                        footer={<span>Prueba técnica — Ediversa</span>}
                    >
                        {children}
                    </Layout>
                </QueryProvider>
            </body>
        </html>
    );
}
