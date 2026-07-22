import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
    it("Shows title with first letter capitalized", () => {
        render(
            <Card
                title="pikachu"
                img={{ src: "pikachu.jpg", alt: "Pikachu" }}
                id="1"
                badges={[{ color: "#EE8130", label: "Fire" }]}
                buttons={[{ label: "Click me", onClick: () => {} }]}
            />,
        );
        expect(screen.getByText(/Pikachu/)).toBeInTheDocument();
    });

    it("Render badges for each type", () => {
        render(
            <Card
                title="pikachu"
                img={{ src: "pikachu.jpg", alt: "Pikachu" }}
                id="1"
                badges={[
                    { color: "#EE8130", label: "Fire" },
                    { color: "#A8A77A", label: "Normal" },
                ]}
                buttons={[{ label: "Click me", onClick: () => {} }]}
            />,
        );
        const allButtons = screen.getAllByRole("button");
        const badgeButtons = allButtons.filter((btn) => btn.hasAttribute("aria-pressed"));

        expect(badgeButtons).toHaveLength(2);
    });

    it("Render image with correct alt text", () => {
        render(
            <Card
                title="pikachu"
                img={{ src: "pikachu.jpg", alt: "Pikachu" }}
                id="1"
                badges={[
                    { color: "#EE8130", label: "Fire" },
                    { color: "#A8A77A", label: "Normal" },
                ]}
                buttons={[{ label: "Click me", onClick: () => {} }]}
            />,
        );
        const image = screen.getByRole("img", { name: "Pikachu" });
        expect(image).toHaveAttribute("alt", "Pikachu");
    });
});
