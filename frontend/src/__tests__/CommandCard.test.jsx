import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import CommandCard from "../components/CommandCard";

// CommandCard reads Redux (bookmarks), so tests render it inside a Provider.
const renderCard = () => render(<Provider store={store}><CommandCard cmd={CMD} /></Provider>);

const CMD = {
  id: "cmd-1",
  command: "git clone <url>",
  title: "Copy a repository",
  category: "Create & Clone",
  description: "Downloads a full copy of a remote repository to your machine.",
  example: "git clone https://github.com/facebook/react.git",
  common_mistake: "Cloning into a folder that already exists.",
  tags: ["clone", "copy"],
};

describe("CommandCard", () => {
  test("renders the command title, category and code", () => {
    renderCard();
    expect(screen.getByText("Copy a repository")).toBeInTheDocument();
    expect(screen.getByText("Create & Clone")).toBeInTheDocument();
    expect(screen.getByText("git clone <url>")).toBeInTheDocument();
  });

  test("renders the plain-English description", () => {
    renderCard();
    expect(
      screen.getByText(/Downloads a full copy of a remote repository/i)
    ).toBeInTheDocument();
  });

  test("shows the common-mistake callout", () => {
    renderCard();
    expect(screen.getByText(/Common mistake:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Cloning into a folder that already exists/i)
    ).toBeInTheDocument();
  });

  test("renders a copy button with the correct test id", () => {
    renderCard();
    expect(screen.getByTestId("copy-btn-cmd-1")).toBeInTheDocument();
  });
});
