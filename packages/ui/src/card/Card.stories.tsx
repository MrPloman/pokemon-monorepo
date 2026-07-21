import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
    title: "Components/Card",
    component: Card,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const CardFulfilled: Story = {
    args: {
        img: {
            src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
            alt: "Pokemon",
        },
        id: "1",
        title: "Bulbasaur",
        buttons: [
            { variant: "primary", label: "Ver detalles" },
            { variant: "secondary", label: "Compartir" },
        ],
        badges: [
            { label: "Grass", color: "green", selected: false },
            { label: "Poison", color: "purple", selected: false },
        ],
    },
};
