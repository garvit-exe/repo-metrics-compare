
import React from 'react';
import { ArrowUpRight, Users, Eye, GitFork, Star, Clipboard } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Repository } from './RepositorySelector';
import MetricsCard from './MetricsCard';
import { Separator } from '@/components/ui/separator';
import { formatNumber } from '@/lib/utils';

export interface RepositoryStats {
  repository: Repository;
  views: {
    count: number;
    uniques: number;
    timestamp: string;
  }[];
  clones: {
    count: number;
    uniques: number;
    timestamp: string;
  }[];
  referrers: {
    referrer: string;
    count: number;
    uniques: number;
  }[];
}

interface RepositoryMetricsProps {
  repositoryStats: RepositoryStats[];
  loading: boolean;
}

// Custom color palette for chart lines, with each color being visually distinct
const colors = [
  '#3B82F6', // primary blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
  '#6366F1', // indigo
];

const RepositoryMetrics: React.FC<RepositoryMetricsProps> = ({ 
  repositoryStats,
  loading 
}) => {
  if (loading) {
    return (
      <div className="animate-pulse flex flex-col gap-6 w-full">
        <div className="h-64 bg-secondary rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-secondary rounded-xl"></div>
          <div className="h-64 bg-secondary rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (repositoryStats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Clipboard className="w-8 h-8 text-accent-foreground" />
        </div>
        <h3 className="text-xl font-display font-medium mb-2">No repositories selected</h3>
        <p className="text-muted-foreground max-w-md">
          Select repositories above to view and compare metrics
        </p>
      </div>
    );
  }

  // Prepare data for charts
  const prepareViewsData = () => {
    const allTimestamps = new Set<string>();
    
    // Collect all timestamps
    repositoryStats.forEach(stat => {
      stat.views.forEach(view => {
        allTimestamps.add(view.timestamp.split('T')[0]);
      });
    });
    
    // Sort timestamps
    const sortedTimestamps = Array.from(allTimestamps).sort();
    
    // Create data points for each timestamp
    return sortedTimestamps.map(timestamp => {
      const dataPoint: any = { date: timestamp };
      
      repositoryStats.forEach(stat => {
        const view = stat.views.find(v => v.timestamp.split('T')[0] === timestamp);
        dataPoint[`${stat.repository.name}_views`] = view ? view.count : 0;
        dataPoint[`${stat.repository.name}_uniques`] = view ? view.uniques : 0;
      });
      
      return dataPoint;
    });
  };

  const prepareClonesData = () => {
    const allTimestamps = new Set<string>();
    
    repositoryStats.forEach(stat => {
      stat.clones.forEach(clone => {
        allTimestamps.add(clone.timestamp.split('T')[0]);
      });
    });
    
    const sortedTimestamps = Array.from(allTimestamps).sort();
    
    return sortedTimestamps.map(timestamp => {
      const dataPoint: any = { date: timestamp };
      
      repositoryStats.forEach(stat => {
        const clone = stat.clones.find(c => c.timestamp.split('T')[0] === timestamp);
        dataPoint[`${stat.repository.name}_clones`] = clone ? clone.count : 0;
        dataPoint[`${stat.repository.name}_uniques`] = clone ? clone.uniques : 0;
      });
      
      return dataPoint;
    });
  };

  const prepareStarsForks = () => {
    return repositoryStats.map(stat => ({
      name: stat.repository.name,
      stars: stat.repository.stars,
      forks: stat.repository.forks,
    }));
  };

  const prepareReferrersData = () => {
    // Get top 5 referrers across all repositories
    const allReferrers = new Set<string>();
    repositoryStats.forEach(stat => {
      stat.referrers.slice(0, 5).forEach(ref => {
        allReferrers.add(ref.referrer);
      });
    });
    
    const referrersArray = Array.from(allReferrers);
    
    return referrersArray.map(referrer => {
      const dataPoint: any = { name: referrer };
      
      repositoryStats.forEach(stat => {
        const refData = stat.referrers.find(r => r.referrer === referrer);
        dataPoint[stat.repository.name] = refData ? refData.count : 0;
      });
      
      return dataPoint;
    });
  };

  const viewsData = prepareViewsData();
  const clonesData = prepareClonesData();
  const starsForksData = prepareStarsForks();
  const referrersData = prepareReferrersData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 text-sm shadow-lg">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name.split('_')[0]}: </span>
              <span className="font-medium">{formatNumber(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <MetricsCard title="Views Over Time" description="Daily page views for each repository">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={viewsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {repositoryStats.map((stat, index) => (
                  <linearGradient key={stat.repository.id} id={`color-${stat.repository.name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="date" tickMargin={5} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} width={30} />
              <Tooltip content={<CustomTooltip />} />
              {repositoryStats.map((stat, index) => (
                <Area
                  key={stat.repository.id}
                  type="monotone"
                  dataKey={`${stat.repository.name}_views`}
                  name={`${stat.repository.name}_views`}
                  stroke={colors[index % colors.length]}
                  fillOpacity={1}
                  fill={`url(#color-${stat.repository.name})`}
                  activeDot={{ r: 6 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </MetricsCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricsCard title="Stars & Forks" description="Total stars and forks per repository">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={starsForksData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                barGap={4}
                barCategoryGap="20%"
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="stars" 
                  name="Stars" 
                  fill={colors[0]} 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="forks" 
                  name="Forks" 
                  fill={colors[1]} 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetricsCard>

        <MetricsCard title="Top Referrers" description="Sources sending traffic to your repositories">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={referrersData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
                barGap={4}
                barCategoryGap="20%"
              >
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={100} 
                />
                <Tooltip content={<CustomTooltip />} />
                {repositoryStats.map((stat, index) => (
                  <Bar
                    key={stat.repository.id}
                    dataKey={stat.repository.name}
                    name={stat.repository.name}
                    fill={colors[index % colors.length]}
                    radius={[0, 4, 4, 0]} 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetricsCard>
      </div>

      <MetricsCard title="Clones" description="Repository clones over time">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={clonesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" tickMargin={5} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} width={30} />
              <Tooltip content={<CustomTooltip />} />
              {repositoryStats.map((stat, index) => (
                <Line
                  key={stat.repository.id}
                  type="monotone"
                  dataKey={`${stat.repository.name}_clones`}
                  name={`${stat.repository.name}_clones`}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </MetricsCard>

      <div className="space-y-4 mt-8">
        <h3 className="section-title">Comparison Summary</h3>
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Repository</th>
                <th className="text-right py-3 px-4">
                  <div className="flex items-center justify-end space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Stars</span>
                  </div>
                </th>
                <th className="text-right py-3 px-4">
                  <div className="flex items-center justify-end space-x-1">
                    <GitFork className="w-4 h-4" />
                    <span>Forks</span>
                  </div>
                </th>
                <th className="text-right py-3 px-4">
                  <div className="flex items-center justify-end space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>Views (14d)</span>
                  </div>
                </th>
                <th className="text-right py-3 px-4">
                  <div className="flex items-center justify-end space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Unique Visitors</span>
                  </div>
                </th>
                <th className="text-right py-3 px-4">
                  <div className="flex items-center justify-end space-x-1">
                    <Clipboard className="w-4 h-4" />
                    <span>Clones</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {repositoryStats.map((stat, index) => {
                // Calculate totals
                const totalViews = stat.views.reduce((sum, item) => sum + item.count, 0);
                const totalUniqueVisitors = stat.views.reduce((sum, item) => sum + item.uniques, 0);
                const totalClones = stat.clones.reduce((sum, item) => sum + item.count, 0);
                
                return (
                  <tr key={stat.repository.id} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: colors[index % colors.length] }} 
                        />
                        <span className="font-medium">{stat.repository.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      {formatNumber(stat.repository.stars)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      {formatNumber(stat.repository.forks)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      {formatNumber(totalViews)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      {formatNumber(totalUniqueVisitors)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      {formatNumber(totalClones)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RepositoryMetrics;
