import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableBody } from "./TableBody";
import { TableCell } from "./TableCell";
import { TableRow } from "./TableRow";

const meta: Meta<typeof TableBody> = {
    title: "Components/Table/TableRow",
    component: TableBody,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <table>
                <Story />
            </table>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof TableBody>;

export const Default: Story = {
    render: () => (
        <TableBody>
            <TableRow>
                <TableCell>Pikachu</TableCell>
                <TableCell>Electric</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Charizard</TableCell>
                <TableCell>Fire</TableCell>
            </TableRow>
        </TableBody>
    ),
};
