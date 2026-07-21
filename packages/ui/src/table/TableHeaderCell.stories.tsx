import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableHeaderCell } from "./TableHeaderCell";

const meta: Meta<typeof TableHeaderCell> = {
    title: "Components/Table/TableHeaderCell",
    component: TableHeaderCell,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TableHeaderCell>;

export const NotSortable: Story = {
    args: {
        children: "Nombre",
        sortable: false,
    },
};

export const SortableNone: Story = {
    args: {
        children: "Nombre",
        sortable: true,
        sortDirection: "none",
    },
};

export const SortableAscending: Story = {
    args: {
        children: "Nombre",
        sortable: true,
        sortDirection: "ascending",
    },
};

export const SortableDescending: Story = {
    args: {
        children: "Nombre",
        sortable: true,
        sortDirection: "descending",
    },
};
