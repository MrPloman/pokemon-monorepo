import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableCell } from "./TableCell";

const meta: Meta<typeof TableCell> = {
    title: "Components/Table/TableCell",
    component: TableCell,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <table>
                <tbody>
                    <tr>
                        <Story />
                    </tr>
                </tbody>
            </table>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof TableCell>;

export const Default: Story = {
    args: { children: "Pikachu" },
};
