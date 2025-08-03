// GitHub Search API integration
export interface GitHubSearchResult {
  type: 'repository' | 'code' | 'issue'
  title: string
  description: string
  url: string
  language?: string
  stars?: number
  forks?: number
  updated_at?: string
  owner?: string
  repository?: string
}

// GitHub API configuration
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''
const GITHUB_USERNAME = 'agnij-dutta'

// GitHub API headers
function getGitHubHeaders() {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'portfolio-app'
  }
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`
  }
  
  return headers
}

// Search GitHub repositories (only user's repos)
async function searchRepositories(query: string): Promise<GitHubSearchResult[]> {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+user:${GITHUB_USERNAME}&sort=stars&order=desc&per_page=5`,
      { headers: getGitHubHeaders() }
    )
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data.items.map((repo: any) => ({
      type: 'repository' as const,
      title: repo.name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated_at: repo.updated_at,
      owner: repo.owner.login,
      repository: repo.full_name
    }))
  } catch (error) {
    console.error('Error searching repositories:', error)
    return []
  }
}

// Search GitHub code (only user's repos)
async function searchCode(query: string): Promise<GitHubSearchResult[]> {
  try {
    const response = await fetch(
      `https://api.github.com/search/code?q=${encodeURIComponent(query)}+user:${GITHUB_USERNAME}&sort=indexed&order=desc&per_page=5`,
      { headers: getGitHubHeaders() }
    )
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data.items
      .filter((item: any) => item.repository && item.repository.owner && item.repository.full_name)
      .map((item: any) => ({
        type: 'code' as const,
        title: item.name,
        description: `Code in ${item.repository.full_name}`,
        url: item.html_url,
        language: item.language,
        updated_at: item.updated_at,
        owner: item.repository.owner.login,
        repository: item.repository.full_name
      }))
  } catch (error) {
    console.error('Error searching code:', error)
    return []
  }
}

// Search GitHub issues (only user's repos)
async function searchIssues(query: string): Promise<GitHubSearchResult[]> {
  try {
    const response = await fetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(query)}+user:${GITHUB_USERNAME}&sort=updated&order=desc&per_page=5`,
      { headers: getGitHubHeaders() }
    )
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data.items
      .filter((issue: any) => issue.repository && issue.repository.owner && issue.repository.full_name)
      .map((issue: any) => ({
        type: 'issue' as const,
        title: issue.title,
        description: issue.body?.substring(0, 100) + '...' || 'No description available',
        url: issue.html_url,
        updated_at: issue.updated_at,
        owner: issue.repository.owner.login,
        repository: issue.repository.full_name
      }))
  } catch (error) {
    console.error('Error searching issues:', error)
    return []
  }
}

// Main search function
export async function searchGitHub(query: string): Promise<{
  repositories: GitHubSearchResult[]
  code: GitHubSearchResult[]
  issues: GitHubSearchResult[]
}> {
  if (!query.trim()) {
    return { repositories: [], code: [], issues: [] }
  }
  
  try {
    const [repositories, code, issues] = await Promise.all([
      searchRepositories(query),
      searchCode(query),
      searchIssues(query)
    ])
    
    return { repositories, code, issues }
  } catch (error) {
    console.error('Error in GitHub search:', error)
    return { repositories: [], code: [], issues: [] }
  }
}

// Search user's own repositories
export async function searchUserRepositories(query: string): Promise<GitHubSearchResult[]> {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+user:${GITHUB_USERNAME}&sort=stars&order=desc&per_page=10`,
      { headers: getGitHubHeaders() }
    )
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data.items.map((repo: any) => ({
      type: 'repository' as const,
      title: repo.name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated_at: repo.updated_at,
      owner: repo.owner.login,
      repository: repo.full_name
    }))
  } catch (error) {
    console.error('Error searching user repositories:', error)
    return []
  }
}

// Get repository details
export async function getRepositoryDetails(owner: string, repo: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers: getGitHubHeaders() }
    )
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error getting repository details:', error)
    return null
  }
} 