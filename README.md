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

### El filtro por tipo hace intersección, no unión

Al principio lo tenía haciendo unión (si marcabas "fuego" y "agua", te salían todos los de fuego más todos los de agua). Pero pensándolo mejor, no tiene mucho sentido para un usuario real. Si seleccionas dos tipos, lo natural es pensar "quiero ver los que son de estos dos tipos a la vez" (como Charizard, que es fuego y volador), no una mezcla de dos listas separadas. Además, como un Pokémon nunca tiene más de 2 tipos en el juego real, limité la selección a máximo 2 tipos a la vez. No tendría sentido permitir marcar más.

Esto también ayudó con el rendimiento: al principio, si marcabas muchos tipos a la vez, se disparaban cientos de peticiones a la PokeAPI y a veces petaba por timeout. Con la intersección el conjunto de resultados es mucho más pequeño y ya no pasa. Fue un poco un dolor de cabeza la verdad, no me llevo mucho tiempo cambiarlo pero estuve haciendo algunos apaños y no terminavan de convencerme. Ya después con la implementacion nueva de los filtros mejoró.

### Por qué el buscador no hace una petición por cada letra que escribes

La PokeAPI no tiene un endpoint de búsqueda por texto. Lo que hago es pedir una sola vez la lista completa de nombres (son ligeros, solo nombre e id, sin imagen ni tipos) y filtrar en memoria mientras escribes. Solo cuando ya sé qué 10 Pokémon tocan mostrar en esa página concreta, ahí sí pido el detalle completo de esos 10. Así no tengo que traerme el detalle de los 1300 Pokémon que existen solo para poder buscar.

## Cómo lo levantas en local

Necesitas Node v22.13+ y pnpm (`npm install -g pnpm` si no lo tienes). Yo usé la versión: v24.12.0

```bash
git clone https://github.com/MrPloman/pokemon-monorepo.git
cd pokemon-monorepo
pnpm install
```

Crea el fichero de variables de entorno con el nombre .env.local:

```bash
cp apps/pokemon-app/.env.local

```

Y dentro del fichero pega:

POKEAPI_BASE_URL=https://pokeapi.co/api/v2

Por defecto tiene que apuntar a la PokeAPI pública.

Y para arrancarlo:

```bash
pnpm dev
```

Se levanta en `http://localhost:3000`.

### Build

```bash
pnpm build
```

### Tests

```bash
pnpm exec turbo test
```

Corre los tests de `packages/ui` (que incluyen, de propina, los que genera automáticamente Storybook a partir de cada story) y los de `packages/core` (sobre todo el caso de uso del listado, con un repositorio falso en memoria para no depender de la API real).

### Storybook

```bash
cd packages/ui
pnpm storybook
```

En `http://localhost:6006`.

### Lint

```bash
pnpm check       # con autofix, para cuando estás currando
pnpm ci:check    # sin autofix, el mismo que corre en el CI
```

## El CI

En GitHub Actions, cada push o PR a `main` corre lint, tests y build en ese orden. Si algo falla, se corta ahí y no sigue.

## Cosas que decidí simplificar, a propósito

- Usé CSS Modules con Sass en vez de PandaCSS. El enunciado permite ambas, y con el tiempo que tenía preferí ir a lo que ya dominaba.
- Turborepo en vez de Nx, porque quería entender bien el concepto de monorepo sin que una herramienta con más magia me lo escondiera.
- El repositorio de Pokémon devuelve la paginación tal cual la da la PokeAPI (`items`, `hasMore`, `total`) en vez de abstraerla del todo. Para el tamaño de esta prueba no me pareció que mereciera la pena meter una capa extra.
- Las imágenes son `<img>` normales, no `next/image`. Como vienen de fuera (los sprites de la PokeAPI), habría que configurar los dominios permitidos, y no lo vi prioritario para el alcance de la prueba.
- La paginación es en memoria, no contra la API con offset/limit reales en la URL. Para el volumen de datos que maneja esto, no creo que hiciera falta nada más.

## Lo que me dejé fuera

- A pesar que tengo bastante experiencia en cypress no he hecho e2e. El documento no menconava explicitamente tests end-to-end de la app completa (tengo unitarios de componentes y del caso de uso principal, más los que salen gratis de Storybook).
- No llegué a probar PandaCSS en ningún componente, aunque lo tuve instalado en algún momento por si acaso.
- Optimización de imágenes.
