
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';

interface AuthFormProps {
  onSubmit: (token: string) => void;
  loading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, loading }) => {
  const [token, setToken] = useState<string>('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      toast({
        title: "Token required",
        description: "Please enter your GitHub personal access token",
        variant: "destructive"
      });
      return;
    }
    onSubmit(token);
  };

  return (
    <div className="animate-fade-up glass-card p-8 max-w-md w-full mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Key className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-semibold tracking-tight mb-2">
          Connect to GitHub
        </h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Enter your GitHub personal access token to fetch repository metrics
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">Personal Access Token</Label>
          <Input
            id="token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="glass-input"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your token needs <span className="font-medium">repo</span> scope permissions
          </p>
        </div>
        <Button 
          type="submit" 
          className="w-full transition-all duration-300 hover:shadow-md"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect"}
        </Button>
      </form>
      
      <div className="mt-6 text-xs text-center text-muted-foreground">
        <p>
          Tokens are stored locally in your browser and never sent to our servers.
        </p>
        <a 
          href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline mt-1 inline-block"
        >
          How to create a token →
        </a>
      </div>
    </div>
  );
};

export default AuthForm;
