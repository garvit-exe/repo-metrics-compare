
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import AuthForm from '@/components/AuthForm';
import RepositorySelector, { Repository } from '@/components/RepositorySelector';
import RepositoryMetrics, { RepositoryStats } from '@/components/RepositoryMetrics';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAuthenticatedUser, getRepositories, getRepositoryMetrics } from '@/services/github';
import { loadFromLocalStorage, saveToLocalStorage } from '@/lib/utils';
import { Search } from 'lucide-react';

const LOCAL_STORAGE_TOKEN_KEY = 'github-metrics-token';
const LOCAL_STORAGE_USERNAME_KEY = 'github-metrics-username';

const Index = () => {
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepositories, setSelectedRepositories] = useState<Repository[]>([]);
  const [repositoryStats, setRepositoryStats] = useState<RepositoryStats[]>([]);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(false);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  
  const { toast } = useToast();

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = loadFromLocalStorage<string>(LOCAL_STORAGE_TOKEN_KEY);
    const savedUsername = loadFromLocalStorage<string>(LOCAL_STORAGE_USERNAME_KEY);
    
    if (savedToken) {
      setToken(savedToken);
      
      if (savedUsername) {
        setUsername(savedUsername);
        setUsernameInput(savedUsername);
        setAuthenticated(true);
        fetchRepositories(savedUsername, savedToken);
      } else {
        validateToken(savedToken);
      }
    }
  }, []);

  // Authenticate with GitHub using token
  const handleAuth = async (newToken: string) => {
    try {
      setAuthenticating(true);
      await validateToken(newToken);
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: "Please check your GitHub token and try again",
        variant: "destructive"
      });
      setAuthenticating(false);
    }
  };

  // Validate GitHub token and get user info
  const validateToken = async (newToken: string) => {
    try {
      setAuthenticating(true);
      const user = await getAuthenticatedUser(newToken);
      
      // Save valid token and username
      setToken(newToken);
      setUsername(user.login);
      setUsernameInput(user.login);
      saveToLocalStorage(LOCAL_STORAGE_TOKEN_KEY, newToken);
      saveToLocalStorage(LOCAL_STORAGE_USERNAME_KEY, user.login);
      
      setAuthenticated(true);
      setAuthenticating(false);
      
      toast({
        title: "Authentication Successful",
        description: `Welcome, ${user.name || user.login}!`,
      });
      
      // Fetch repositories for the authenticated user
      fetchRepositories(user.login, newToken);
    } catch (error) {
      console.error('Token validation error:', error);
      toast({
        title: "Authentication Failed",
        description: "Please check your GitHub token and try again",
        variant: "destructive"
      });
      setAuthenticating(false);
      throw error;
    }
  };

  // Fetch repositories for a user/organization
  const fetchRepositories = async (user: string, authToken: string) => {
    try {
      setLoadingRepos(true);
      const repos = await getRepositories(user, authToken);
      setRepositories(repos);
      setLoadingRepos(false);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast({
        title: "Error Fetching Repositories",
        description: `Could not load repositories for ${user}`,
        variant: "destructive"
      });
      setLoadingRepos(false);
    }
  };

  // Handle username search
  const handleUsernameSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      setUsername(usernameInput.trim());
      saveToLocalStorage(LOCAL_STORAGE_USERNAME_KEY, usernameInput.trim());
      fetchRepositories(usernameInput.trim(), token);
    }
  };

  // Handle selecting a repository
  const handleSelectRepository = (repo: Repository) => {
    if (selectedRepositories.length >= 5) {
      toast({
        title: "Selection Limit",
        description: "You can compare up to 5 repositories at once",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedRepositories((prev) => [...prev, repo]);
  };

  // Handle deselecting a repository
  const handleDeselectRepository = (repo: Repository) => {
    setSelectedRepositories((prev) => 
      prev.filter((r) => r.id !== repo.id)
    );
    
    setRepositoryStats((prev) => 
      prev.filter((stat) => stat.repository.id !== repo.id)
    );
  };

  // Fetch metrics for selected repositories
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!selectedRepositories.length || !token) return;
      
      setLoadingStats(true);
      
      try {
        const newStats = [];
        
        // Find repositories that we don't already have stats for
        const reposToFetch = selectedRepositories.filter(
          repo => !repositoryStats.some(stat => stat.repository.id === repo.id)
        );
        
        if (reposToFetch.length === 0) {
          setLoadingStats(false);
          return;
        }
        
        // Fetch stats for each new repository
        for (const repo of reposToFetch) {
          const stats = await getRepositoryMetrics(repo, token);
          newStats.push(stats);
        }
        
        setRepositoryStats((prev) => [...prev, ...newStats]);
      } catch (error) {
        console.error('Error fetching repository metrics:', error);
        toast({
          title: "Error Fetching Metrics",
          description: "Failed to fetch repository statistics",
          variant: "destructive"
        });
      } finally {
        setLoadingStats(false);
      }
    };
    
    fetchMetrics();
  }, [selectedRepositories, token]);

  // Handle logout
  const handleLogout = () => {
    setToken('');
    setUsername('');
    setUsernameInput('');
    setAuthenticated(false);
    setRepositories([]);
    setSelectedRepositories([]);
    setRepositoryStats([]);
    
    // Clear localStorage
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header className="glass-card border-b border-border/30 sticky top-0 z-10" />
      
      <main className="flex-1 container max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        {!authenticated ? (
          <div className="max-w-md mx-auto mt-12">
            <AuthForm onSubmit={handleAuth} loading={authenticating} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-semibold tracking-tight mb-2">
                  Repository Metrics
                </h1>
                <p className="text-muted-foreground">
                  Compare statistics across GitHub repositories
                </p>
              </div>
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-secondary/50"
              >
                Logout
              </Button>
            </div>
            
            <div className="glass-card p-6">
              <form 
                onSubmit={handleUsernameSearch} 
                className="flex gap-2 items-center mb-4"
              >
                <div className="flex-1">
                  <Input
                    placeholder="GitHub username or organization"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="glass-input"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loadingRepos}
                  className="transition-all duration-300 hover:shadow-md"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </form>
              
              <p className="text-sm text-muted-foreground mb-4">
                Showing repositories for <span className="font-medium">{username}</span>
                {loadingRepos && ' (Loading...)'}
              </p>
              
              <RepositorySelector
                repositories={repositories}
                selectedRepos={selectedRepositories}
                onSelect={handleSelectRepository}
                onDeselect={handleDeselectRepository}
                loading={loadingRepos}
              />
              
              {repositories.length === 0 && !loadingRepos && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No repositories found for this user</p>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <Tabs defaultValue="metrics">
                <TabsList className="glass-card">
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>
                <TabsContent value="metrics" className="mt-6">
                  <RepositoryMetrics 
                    repositoryStats={repositoryStats} 
                    loading={loadingStats}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-6 md:py-0 md:px-8 w-full border-t border-t-border/30">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            GitHub Repository Metrics Comparison Tool
          </p>
          <p className="text-sm text-muted-foreground">
            Built with React, Tailwind, and Recharts
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
