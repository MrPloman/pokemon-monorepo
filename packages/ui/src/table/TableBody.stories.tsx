import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableBody } from "./TableBody";
import { TableRow } from "./TableRow";
import { TableCell } from "./TableCell";

const meta: Meta<typeof TableBody> = {
    title: "Components/Table/TableBody",
    component: TableBody,
    tags: ["autodocs"],
    decorators: [(Story) => React.createElement("table", null, React.createElement(Story, null))],
};

export default meta;
type Story = StoryObj<typeof TableBody>;

export const Default: Story = {
    render: () =>
        React.createElement(
            TableBody,
            null,
            React.createElement(
                TableRow,
                null,
                React.createElement(TableCell, null, "Pikachu"),
                React.createElement(TableCell, null, "Electric"),
            ),
            React.createElement(
                TableRow,
                null,
                React.createElement(TableCell, null, "Charizard"),
                React.createElement(TableCell, null, "Fire"),
            ),
        ),
};
