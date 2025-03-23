
import { Repository } from '@/components/RepositorySelector';
import { RepositoryStats } from '@/components/RepositoryMetrics';

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

/**
 * Makes an authenticated request to the GitHub API
 */
async function fetchGitHub(url: string, token: string) {
  const cacheKey = `${token}-${url}`;
  
  // Check if we have a valid cache entry
  const cachedResponse = apiCache.get(cacheKey);
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
    return cachedResponse.data;
  }
  
  try {
    const response = await fetch(`https://api.github.com${url}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    apiCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching from GitHub API:', error);
    throw error;
  }
}

/**
 * Get the authenticated user's information
 */
export async function getAuthenticatedUser(token: string) {
  return fetchGitHub('/user', token);
}

/**
 * Get repositories for a user or organization
 */
export async function getRepositories(username: string, token: string): Promise<Repository[]> {
  try {
    // First try user repositories
    const repos = await fetchGitHub(`/users/${username}/repos?per_page=100&sort=updated`, token);
    
    return repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count
    }));
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

/**
 * Get traffic views for a repository
 */
export async function getRepositoryViews(owner: string, repo: string, token: string) {
  return fetchGitHub(`/repos/${owner}/${repo}/traffic/views`, token);
}

/**
 * Get traffic clones for a repository
 */
export async function getRepositoryClones(owner: string, repo: string, token: string) {
  return fetchGitHub(`/repos/${owner}/${repo}/traffic/clones`, token);
}

/**
 * Get referring sites for a repository
 */
export async function getRepositoryReferrers(owner: string, repo: string, token: string) {
  return fetchGitHub(`/repos/${owner}/${repo}/traffic/popular/referrers`, token);
}

/**
 * Get all metrics for a repository
 */
export async function getRepositoryMetrics(repository: Repository, token: string): Promise<RepositoryStats> {
  const [owner, repoName] = repository.full_name.split('/');
  
  try {
    const [viewsData, clonesData, referrersData] = await Promise.all([
      getRepositoryViews(owner, repoName, token),
      getRepositoryClones(owner, repoName, token),
      getRepositoryReferrers(owner, repoName, token)
    ]);
    
    return {
      repository,
      views: viewsData.views || [],
      clones: clonesData.clones || [],
      referrers: referrersData || []
    };
  } catch (error) {
    console.error(`Error fetching metrics for ${repository.full_name}:`, error);
    // Return empty data on error
    return {
      repository,
      views: [],
      clones: [],
      referrers: []
    };
  }
}
