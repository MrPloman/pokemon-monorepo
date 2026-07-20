import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableHead } from "./TableHead";
import { TableRow } from "./TableRow";
import { TableHeaderCell } from "./TableHeaderCell";

const meta: Meta<typeof TableHead> = {
    title: "Components/Table/TableHead",
    component: TableHead,
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
type Story = StoryObj<typeof TableHead>;

export const Default: Story = {
    render: () => (
        <TableHead>
            <TableRow>
                <TableHeaderCell sortable sortDirection="none">
                    Nombre
                </TableHeaderCell>
                <TableHeaderCell sortable sortDirection="none">
                    Tipo
                </TableHeaderCell>
            </TableRow>
        </TableHead>
    ),
};
