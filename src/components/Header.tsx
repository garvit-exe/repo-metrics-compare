
import React from 'react';
import { Github } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-4 px-6 flex items-center justify-between", className)}>
      <div className="flex items-center space-x-2">
        <Github className="w-6 h-6" />
        <h1 className="text-xl font-display font-semibold tracking-tight">
          GitMetrics
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <a 
          href="https://github.com/settings/tokens" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          GitHub Tokens
        </a>
      </div>
    </header>
  );
};

export default Header;
