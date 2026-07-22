# Pokédex — Prueba Técnica Frontend (Ediversa)

Esto es una Pokédex (bastante básica) hecha con Next.js que consume la [PokeAPI](https://pokeapi.co). La hice como prueba técnica, pero también la usé como motivo para aprender Next.js en serio (venía de Angular/React/Vue, no tenia experiencia explícita en Next.js aún) y montar un monorepo desde cero.

Repo: <URL_DEL_REPOSITORIO>

## Con qué está hecho?

- **Next.js 15** (App Router) + TypeScript
- **Turborepo + pnpm workspaces** para el monorepo
- **CSS Modules con Sass** para los estilos.
- **TanStack Query** para el listado infinito y la hidratación servidor→cliente
- **TanStack Table** para la vista de tabla
- **Storybook** para documentar los componentes (con el addon de accesibilidad activado)
- **Vitest + React Testing Library** para los tests
- **Biome** para lint y formato (todo en uno, sin ESLint, aunque sé que con React es mas efectivo eslint.)
- **GitHub Actions** para el CI

## La Arquitectura: Cómo está organizado?

Lo he hecho con arquitectura hexagonal: DDD.

pokemon-monorepo/
├── apps/
│ └── pokemon-app/ # la app de Next.js en sí
│ ├── app/ # todas las rutas: solo 2, lista y detalle
│ └── src/
│ ├── actions/ # server actions
│ ├── composition/ # aquí se "conectan" el repositorio con los casos de uso
│ ├── infrastructure/ # el adaptador que habla con la PokeAPI
│ ├── presentation/ # componentes de cliente, colores por tipo
│ └── queries/ # config de TanStack Query
├── packages/
│ ├── core/ # dominio y lógica de negocio, sin nada de React ni Next
│ └── ui/ # la librería de componentes (Button, Card, Badge, Table...)

## Por qué está montado así?

### Lo de separar `core` de la app

La idea principal es que `packages/core` no sabe que existe Next, ni React, ni la PokeAPI. Es (como acostumbra a decirse) "agnóstico". TypeScript puro con las entidades (`Pokemon`, `PokemonType`), los casos de uso y una interfaz (`PokemonRepository`) que dice "esto es lo que necesito", sin saber de dónde sale.

Quien sí sabe que existe la PokeAPI es `PokeApiPokemonRepository`, que vive dentro de la app y es quien implementa esa interfaz de verdad. La gracia de esto es que si mañana cambio de fuente de datos, solo tengo que tocar ese fichero — el dominio y los casos de uso ni se enteran.

No es que la prueba lo pidiera explícitamente así, pero encaja con el criterio de "buenas prácticas" que se menciona en el enunciado, y de paso es algo que quería practicar. He estado metido en temas de arquitectura y a pesar que no soy un experto me gusta aplicarlo a mis proyectos.

### Cómo funciona lo de que la lista se vea sin JavaScript

Esto me costó bastante entenderlo bien al principio. La idea es: la página del listado (`/pokemon`) es un Server Component que pide la primera tanda de Pokémon y la deja ya lista dentro del HTML, sin depender de que el navegador ejecute nada. Luego, en el cliente, TanStack Query "recoge" esos mismos datos (con la misma queryKey) en vez de volver a pedirlos — así no hay una petición duplicada al cargar.

A partir de ahí, todo lo interactivo (el buscador, los filtros por tipo, el scroll infinito para cargar más) sí necesita JavaScript, como es lógico. Pero si lo desactivas, sigues viendo los primeros 10 Pokémon perfectamente.
