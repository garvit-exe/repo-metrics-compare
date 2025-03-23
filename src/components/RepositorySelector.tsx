
import React, { useState } from 'react';
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

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stars: number;
  forks: number;
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

  const handleSelect = (repo: Repository) => {
    if (selectedRepos.some(r => r.id === repo.id)) {
      onDeselect(repo);
    } else {
      onSelect(repo);
      setOpen(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
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
                {repositories.map((repo) => (
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
                    {repo.name}
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
