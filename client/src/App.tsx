import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ShareSpace from "@/pages/ShareSpace";
import { useAuthSession } from "@/hooks/use-auth";

function Router() {
  const { data: profile, isLoading } = useAuthSession();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;

    const onAuthPage = location === "/login" || location === "/signup";
    const onSharePage = location.startsWith("/share/");
    if (!profile && !onAuthPage) {
      if (onSharePage) return;
      setLocation("/login");
      return;
    }

    if (profile && onAuthPage) {
      setLocation("/");
    }
  }, [isLoading, location, profile, setLocation]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-cyan-100">
        Loading...
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/share/:userId" component={ShareSpace} />
      {!profile ? (
        <>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </>
      ) : (
        <Route path="/" component={Home} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
