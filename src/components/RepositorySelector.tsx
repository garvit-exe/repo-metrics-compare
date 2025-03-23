
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import RepositoryFilters, { SortOption, SortDirection } from './RepositoryFilters';

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stars: number;
  forks: number;
  updated_at?: string;
}

interface RepositorySelectorProps {
  repositories: Repository[];
  selectedRepos: Repository[];
  onSelect: (repo: Repository) => void;
  onDeselect: (repo: Repository) => void;
  loading: boolean;
  className?: string;
}

const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  repositories,
  selectedRepos,
  onSelect,
  onDeselect,
  loading,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('stars');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (newSortBy: SortOption, newDirection: SortDirection) => {
    setSortBy(newSortBy);
    setSortDirection(newDirection);
  };

  const handleSelect = (repo: Repository) => {
    if (selectedRepos.some(r => r.id === repo.id)) {
      onDeselect(repo);
    } else {
      onSelect(repo);
      setOpen(false);
    }
  };

  // Filter and sort repositories
  const filteredRepositories = useMemo(() => {
    // First filter by search query
    let filtered = repositories;
    
    if (filterQuery.trim()) {
      const query = filterQuery.toLowerCase().trim();
      filtered = repositories.filter(repo => 
        repo.name.toLowerCase().includes(query) || 
        (repo.description && repo.description.toLowerCase().includes(query))
      );
    }
    
    // Then sort based on selected criteria
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'stars':
          comparison = a.stars - b.stars;
          break;
        case 'forks':
          comparison = a.forks - b.forks;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'updated':
          if (a.updated_at && b.updated_at) {
            comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          }
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [repositories, filterQuery, sortBy, sortDirection]);

  return (
    <div className={cn("space-y-4", className)}>
      <RepositoryFilters 
        searchQuery={filterQuery}
        onSearchChange={setFilterQuery}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSort}
      />

      <div className="flex flex-wrap gap-2 items-center mb-2">
        {selectedRepos.map((repo) => (
          <div 
            key={repo.id}
            className="flex items-center space-x-1 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm"
          >
            <span>{repo.name}</span>
            <button 
              onClick={() => onDeselect(repo)} 
              className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between transition-all duration-300 glass-input"
            disabled={loading || repositories.length === 0}
          >
            <div className="flex items-center">
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              {value
                ? repositories.find((repo) => repo.name === value)?.name
                : "Select repositories to compare"}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 max-h-[300px] overflow-auto">
          <Command>
            <CommandInput placeholder="Search repositories..." />
            <CommandEmpty>No repositories found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {filteredRepositories.map((repo) => (
                  <CommandItem
                    key={repo.id}
                    value={repo.name}
                    onSelect={() => handleSelect(repo)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedRepos.some(r => r.id === repo.id) 
                          ? "opacity-100" 
                          : "opacity-0"
                      )}
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium">{repo.name}</div>
                      {repo.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {repo.description}
                        </div>
                      )}
                    </div>
                    <div className="ml-2 flex items-center text-xs text-muted-foreground">
                      <span className="mr-2">⭐ {repo.stars}</span>
                      <span>🍴 {repo.forks}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RepositorySelector;
