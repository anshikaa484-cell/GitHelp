import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { ThemeProvider } from "../context/ThemeContext";
import { PreferencesProvider } from "../context/PreferencesContext";
import App from "../App";

const renderAt = (path) => {
  window.history.pushState({}, "", path);
  return render(<Provider store={store}><ThemeProvider><PreferencesProvider><App /></PreferencesProvider></ThemeProvider></Provider>);
};

describe("routes render", () => {
  test.each([["/", "navbar"], ["/dashboard", "dashboard-page"], ["/commands", "command-explorer-page"], ["/playground", "playground-page"],
    ["/troubleshooter", "troubleshooter-page"], ["/quiz", "quiz-page"], ["/bookmarks", "bookmarks-page"], ["/profile", "profile-page"], ["/feedback", "feedback-page"]])(
    "%s", async (path, id) => { renderAt(path); expect(await screen.findByTestId(id)).toBeInTheDocument(); });
  test("unknown route shows 404 inside layout", async () => { renderAt("/nope"); expect(await screen.findByTestId("navbar")).toBeInTheDocument(); });
});

describe("interactions", () => {
  test("theme toggle updates <html>", async () => {
    renderAt("/");
    const before = document.documentElement.dataset.theme;
    fireEvent.click(await screen.findByTestId("theme-toggle"));
    expect(document.documentElement.dataset.theme).not.toBe(before);
  });
  test("bookmark from commands shows on bookmarks page", async () => {
    renderAt("/commands");
    fireEvent.click((await screen.findAllByText("Save"))[0]);
    expect(store.getState().bookmarks.items).toHaveLength(1);
  });
  test("feedback validates then succeeds", async () => {
    renderAt("/feedback");
    fireEvent.click(await screen.findByTestId("submit"));
    expect(await screen.findByText("Enter your name.")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "A" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "bad" } });
    fireEvent.click(screen.getByTestId("submit"));
    expect(await screen.findByText(/valid email/)).toBeInTheDocument();
    expect(screen.getByLabelText("Name").value).toBe("A"); // values preserved
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.co" } });
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "Bug" } });
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "This is long enough." } });
    fireEvent.click(screen.getByTestId("submit"));
    await waitFor(() => expect(screen.getByTestId("success")).toBeInTheDocument());
  });
  test("quiz: answer, finish, score in Redux", async () => {
    renderAt("/quiz");
    fireEvent.click(await screen.findByTestId("start-beginner"));
    for (let i = 0; i < 4; i++) {
      fireEvent.click(await screen.findByTestId("option-1"));
      fireEvent.click(screen.getByTestId(i < 3 ? "next" : "finish"));
    }
    expect(await screen.findByTestId("quiz-results")).toBeInTheDocument();
    expect(store.getState().quiz.results.beginner.total).toBe(4);
  });
});
