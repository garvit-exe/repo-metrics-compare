
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="glass-card p-8 max-w-md w-full mx-auto animate-fade-up text-center">
        <h1 className="text-6xl font-display font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Page not found</p>
        <Button asChild className="transition-all duration-300 hover:shadow-md">
          <a href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
