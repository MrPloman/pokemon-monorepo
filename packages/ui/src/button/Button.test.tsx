import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
    it("Disabled button doesn't fire onClick", async () => {
        const mockOnClick = vi.fn();
        render(<Button label="Click me" disabled onClick={mockOnClick} />);
        const button = screen.getByRole("button");
        await userEvent.click(button);
        expect(mockOnClick).not.toHaveBeenCalledOnce();
    });
    it("Clicking button fires onClick", async () => {
        const mockOnClick = vi.fn();
        render(<Button label="Click me" onClick={mockOnClick} />);
        const button = screen.getByRole("button");
        await userEvent.click(button);
        expect(mockOnClick).toHaveBeenCalledOnce();
    });
    it("Show label as visible text", () => {
        render(<Button label="Click me" />);
        expect(screen.getByText("Click me")).toBeInTheDocument();
    });
});
