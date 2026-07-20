import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableCell } from "./TableCell";
import { TableRow } from "./TableRow";

const meta: Meta<typeof TableRow> = {
  title: "Components/Table/TableRow",
  component: TableRow,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <table>
        <tbody>
          <Story />
        </tbody>
      </table>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TableRow>;

export const Default: Story = {
  render: () => (
    <TableRow>
      <TableCell>Pikachu</TableCell>
      <TableCell>Electric</TableCell>
    </TableRow>
  ),
};