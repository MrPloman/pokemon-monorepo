import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./Table";
import { TableHead } from "./TableHead";
import { TableBody } from "./TableBody";
import { TableRow } from "./TableRow";
import { TableHeaderCell } from "./TableHeaderCell";
import { TableCell } from "./TableCell";

const meta: Meta<typeof Table> = {
    title: "Components/Table/Table",
    component: Table,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Full: Story = {
    render: () => (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell sortable sortDirection="ascending">
                        Nombre
                    </TableHeaderCell>
                    <TableHeaderCell sortable sortDirection="none">
                        Tipo
                    </TableHeaderCell>
                </TableRow>
            </TableHead>
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
        </Table>
    ),
};
