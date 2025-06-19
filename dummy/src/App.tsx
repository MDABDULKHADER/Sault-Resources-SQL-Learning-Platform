
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TopicPage from "./pages/TopicPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProgressPage from "./pages/ProgressPage";
import SQLPracticePage from "./pages/SQLPracticePage";
import NotFound from "./pages/NotFound";

// For markdown rendering
import { marked } from "marked";
marked.setOptions({ 
  breaks: true,
  gfm: true
});

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/topic/:topicId" element={<TopicPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/sql-practice" element={<SQLPracticePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
