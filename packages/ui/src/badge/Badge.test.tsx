import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Badge } from "./Badge";

describe("Badge", () => {
    it("muestra el label como texto visible", () => {
        render(<Badge label="Fire" color="#EE8130" selected={false} />);
        expect(screen.getByText("Fire")).toBeInTheDocument();
    });

    it("refleja selected en aria-pressed", () => {
        // tu turno: renderiza con selected={true} y comprueba el atributo
    });

    it("dispara onClick al hacer click", async () => {
        // tu turno: usa userEvent.click y un mock con vi.fn()
    });
});
