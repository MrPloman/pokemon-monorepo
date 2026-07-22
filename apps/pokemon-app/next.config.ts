const nextConfig = {
    transpilePackages: ["@repo/core", "@repo/ui"], // lo que ya tengas aquí
    async redirects() {
        return [
            {
                source: "/",
                destination: "/pokemon",
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
