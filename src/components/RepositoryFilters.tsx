
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ArrowDown, ArrowUp, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';

export type SortOption = 'stars' | 'forks' | 'name' | 'updated';
export type SortDirection = 'asc' | 'desc';

interface RepositoryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (sortBy: SortOption, direction: SortDirection) => void;
}

const RepositoryFilters: React.FC<RepositoryFiltersProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  sortDirection,
  onSortChange,
}) => {
  // Helper functions for text display
  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'stars': return 'Stars';
      case 'forks': return 'Forks';
      case 'name': return 'Name';
      case 'updated': return 'Last Updated';
      default: return 'Name';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter repositories..."
          className="w-full glass-input pr-10"
        />
        <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 glass-input">
            <span>Sort by: {getSortLabel(sortBy)}</span>
            {sortDirection === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => onSortChange('name', sortDirection)}>
            Name
            {sortBy === 'name' && (
              sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('stars', sortDirection)}>
            Stars
            {sortBy === 'stars' && (
              sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('forks', sortDirection)}>
            Forks
            {sortBy === 'forks' && (
              sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('updated', sortDirection)}>
            Last Updated
            {sortBy === 'updated' && (
              sortDirection === 'asc' ? <ArrowUp className="ml-auto h-4 w-4" /> : <ArrowDown className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')}>
            {sortDirection === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
            {sortDirection === 'asc' ? <SortDesc className="ml-auto h-4 w-4" /> : <SortAsc className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RepositoryFilters;
