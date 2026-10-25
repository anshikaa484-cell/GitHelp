import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import CommandExplorer from "@/pages/CommandExplorer";
import Playground from "@/pages/Playground";
import Troubleshooter from "@/pages/Troubleshooter";
import Quiz from "@/pages/Quiz";
import Bookmarks from "@/pages/Bookmarks";
import Profile from "@/pages/Profile";
import Feedback from "@/pages/Feedback";
import ErrorFinder from "@/pages/ErrorFinder";
import Chatbot from "@/pages/Chatbot";
import CheatSheet from "@/pages/CheatSheet";
import NotFound from "@/pages/NotFound";

function App() {
  const { theme } = useTheme();
  return (
    <div className="App">
      {/* reducedMotion="user": animations switch off if the OS asks for less motion */}
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="commands" element={<CommandExplorer />} />
              <Route path="playground" element={<Playground />} />
              <Route path="troubleshooter" element={<Troubleshooter />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="profile" element={<Profile />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="errors" element={<ErrorFinder />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="cheatsheet" element={<CheatSheet />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster position="bottom-right" theme={theme} richColors closeButton />
        </BrowserRouter>
      </MotionConfig>
    </div>
  );
}

export default App;
