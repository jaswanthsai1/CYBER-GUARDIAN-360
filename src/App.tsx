import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TerminalPage from "./pages/TerminalPage";
import HistoryPage from "./pages/HistoryPage";
import FilesPage from "./pages/FilesPage";
import DocumentationPage from "./pages/DocumentationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner 
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(220 25% 8%)',
            border: '1px solid hsl(160 100% 25%)',
            color: 'hsl(160 100% 70%)',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/terminal" element={<TerminalPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
