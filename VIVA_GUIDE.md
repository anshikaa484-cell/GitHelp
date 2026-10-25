# GIThelp: Viva Preparation Guide (FEE-II Evaluation-II)

## 1. Which tool holds which state? (the question examiners ask most)
| Kind of state | Tool | Where | Why |
|---|---|---|---|
| Terminal lines, search text, form values, open mobile menu | **local `useState`** | `Playground.jsx`, `CommandExplorer.jsx`, `Feedback.jsx`, `Navbar.jsx` | Only one component needs it |
| Theme (light/dark), display name | **Context API** | `context/ThemeContext.jsx`, `context/PreferencesContext.jsx` | Settings read by many components, rarely changes |
| Bookmarks, quiz, lesson progress | **Redux Toolkit** | `features/*/…Slice.js`, `app/store.js` | App data shared across pages, with actions and reducers |

## 2. React Router (criterion A)
- Routes: `src/App.jsx`. One parent `<Route element={<Layout />}>` holds all pages, so navbar and footer are written once (**nested routes**). `<Outlet />` in `components/Layout.jsx` is where the page appears.
- `NavLink` in `components/Navbar.jsx` gives the `active` class. Mobile menu = `useState` open/close.
- `path="*"` shows `NotFound.jsx`. Links use `<Link>`, so the page does not reload.
- Say: "Layout is the parent route, pages are children, `Outlet` renders the matching child."

## 3. Context API (criterion B)
- `createContext` + `Provider` + `useContext` (wrapped in a `useTheme()` hook) in `ThemeContext.jsx`.
- Providers wrap `<App />` in `main.jsx`. The theme sets `data-theme` on `<html>`; CSS variables in `App.css` change under `[data-theme="dark"]`.
- Saved in `localStorage`; an invalid or missing value falls back to the OS preference (`getInitialTheme`).
- Why not Redux for theme? It is a simple UI setting; Context is lighter.

## 4. Redux Toolkit (criterion C)
- `configureStore` in `app/store.js`; `<Provider store>` in `main.jsx`.
- `createSlice` = state + reducers + actions in one place. Reducers may "mutate" because RTK uses Immer to produce immutable updates.
- `useDispatch` sends actions from clicks (`CommandCard`, `Quiz`, `Dashboard`); `useSelector` reads state (`Bookmarks`, `Dashboard`).
- Flow: click -> `dispatch(addBookmark(...))` -> reducer updates state -> `useSelector` re-renders every component that reads it.
- Duplicates prevented in `addBookmark`. Score is computed from `answers` (`selectScore`), not stored twice.
- Persistence: `store.subscribe` saves to `localStorage`; `preload()` restores it, checking the shape first.

## 5. Forms (criterion D): `pages/Feedback.jsx`
- Controlled inputs: each field's `value` comes from `useState`, `onChange` updates it.
- `validate()` returns an errors object (required fields, email regex, message length). Invalid submit: errors show, values stay.
- `aria-invalid`, `aria-describedby`, `<label htmlFor>`, `role="alert"` for accessibility.
- Valid submit: button disabled for 600 ms, success message, form reset. **No server exists, and the page says so.**

## 6. Other features
- **Command library:** data in `data/gitData.js`, one reusable `CommandCard`, search + category filter + Clear filters.
- **Playground:** `utils/gitSimulator.js` is a pure function `runCommand(repo, input) -> { repo, output }`. It edits a JS object only; it never runs real Git or shell.
- **Troubleshooter:** data in `data/troubleshootingGuides.js`; destructive steps carry `danger: true` and show a warning.
- **Quiz:** questions in `data/quizQuestions.js`; progress, answers and results in `quizSlice`.

## 7. Limitations (say these honestly)
- Frontend only: no backend, no accounts, data lives in one browser's `localStorage`.
- Simulator supports a few commands and a simplified repository model.
- Feedback form is validated locally and not sent anywhere.
- Quiz has 4 questions per level, so scores are coarse.
- "Recently viewed commands" and "when to use it" per command are not implemented.

## 8. Commands to run
`cd frontend && npm install --legacy-peer-deps && npm run dev` / `npm test` / `npm run build`
