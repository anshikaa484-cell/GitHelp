import { render, screen, fireEvent } from "@testing-library/react";
import Playground from "../pages/Playground";

const type = (cmd) => {
  const input = screen.getByTestId("terminal-input");
  fireEvent.change(input, { target: { value: cmd } });
  fireEvent.submit(input.closest("form"));
};

describe("Playground page", () => {
  test("runs init, add, commit and shows output", () => {
    render(<Playground />);
    type("git init"); type("git add ."); type('git commit -m"First"');
    const term = screen.getByTestId("terminal");
    expect(term.textContent).toMatch(/Initialized empty/);
    expect(term.textContent).toMatch(/root-commit.*First/);
  });
  test("clear and reset work", () => {
    render(<Playground />);
    type("git init");
    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByTestId("terminal").textContent).not.toMatch(/Initialized/);
    type("git init"); fireEvent.click(screen.getByTestId("reset-sim")); type("git status");
    expect(screen.getByTestId("terminal").textContent).toMatch(/not a git repository/);
  });
});
