import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
    it("Show label as visible text", () => {
        render(<Badge label="Fire" color="#EE8130" selected={false} />);
        expect(screen.getByText("Fire")).toBeInTheDocument();
    });
    it("Show Selected in aria-pressed", () => {
        render(<Badge label="Fire" color="#EE8130" selected={true} />);
        expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });

    it("fires onClick when clicked", async () => {
        const mockOnClick = vi.fn();
        render(<Badge label="Fire" color="#EE8130" selected={false} onClick={mockOnClick} />);
        const button = screen.getByRole("button");
        await userEvent.click(button);
        expect(mockOnClick).toHaveBeenCalledOnce();
    });
});
