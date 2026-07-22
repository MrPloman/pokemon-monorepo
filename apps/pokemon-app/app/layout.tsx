// apps/pokemon-app/app/layout.tsx
import type { Metadata } from "next";
import "./globals.scss";
import "@repo/ui/dist/index.css";
import { Layout } from "@repo/ui";
import { QueryProvider } from "../src/providers/QueryProvider";
import Head from "next/head";

export const metadata: Metadata = {
    title: "Pokedex — Technical Test",
    description: "Technical Test Frontend Developer — Ediversa",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <Head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </Head>
            <body>
                <QueryProvider>
                    <Layout
                        header={<span>Pokedex</span>}
                        footer={<span>{metadata.description}</span>}
                    >
                        {children}
                    </Layout>
                </QueryProvider>
            </body>
        </html>
    );
}
