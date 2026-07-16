import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
    title: "Components/Button",
    component: Button,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: "Ver Pokémon",
        variant: "primary",
    },
};

export const Secondary: Story = {
    args: {
        children: "Cancelar",
        variant: "secondary",
    },
};

export const Disabled: Story = {
    args: {
        children: "Deshabilitado",
        disabled: true,
    },
};
