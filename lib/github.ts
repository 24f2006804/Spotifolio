export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  stargazers_count: number
  forks_count: number
  archived: boolean
  fork: boolean
  private: boolean
}

export interface CategorizedProject {
  title: string
  type: string
  company: string
  duration: string
  icon: string
  url: string
  description: string
  stars: number
  forks: number
  language: string
}

// GitHub username - you can change this to your username
const GITHUB_USERNAME = 'agnij-dutta'
const FALLBACK_USERNAME = '24f2006804'

// GitHub Personal Access Token - you need to create one at https://github.com/settings/tokens
// Add this to your .env.local file: GITHUB_TOKEN=your_token_here
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''

// Cache for API responses
let projectsCache: {
  data: {
    'AI Projects': CategorizedProject[]
    'Web Projects': CategorizedProject[]
    'Blockchain Projects': CategorizedProject[]
  } | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000

// Helper function to create authenticated headers
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

// Optimized README fetching with timeout and selective fetching
async function fetchReadmeContent(username: string, repoName: string): Promise<string> {
  // Only fetch README for projects that might need it for classification
  const needsReadme = repoName.toLowerCase().includes('lucra') || 
                     repoName.toLowerCase().includes('prosparity') ||
                     repoName.toLowerCase().includes('ai') ||
                     repoName.toLowerCase().includes('ml') ||
                     repoName.toLowerCase().includes('chain') ||
                     repoName.toLowerCase().includes('blockchain') ||
                     repoName.toLowerCase().includes('web3')
  
  if (!needsReadme) {
    return ''
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
    
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`, { 
      headers: getGitHubHeaders(),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      // Decode base64 content
      return atob(data.content.replace(/\n/g, ''))
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log(`README fetch timeout for ${username}/${repoName}`)
    } else {
      console.log(`Could not fetch README for ${username}/${repoName}:`, error)
    }
  }
  return ''
}

// Technology mappings for categorization
const AI_TECH = ['python', 'tensorflow', 'pytorch', 'opencv', 'scikit-learn', 'numpy', 'pandas', 'matplotlib', 'seaborn', 'jupyter', 'r', 'machine-learning', 'ai', 'ml', 'data-science', 'computer-vision', 'nlp', 'deep-learning', 'neural-network', 'artificial-intelligence', 'chatbot', 'llm', 'gpt', 'openai', 'huggingface', 'transformers']
const WEB_TECH = ['javascript', 'typescript', 'react', 'nextjs', 'nodejs', 'express', 'html', 'css', 'tailwind', 'bootstrap', 'vue', 'angular', 'svelte', 'web', 'frontend', 'backend', 'fullstack', 'api', 'js', 'ts', 'jsx', 'tsx', 'webpack', 'vite', 'npm', 'yarn', 'pnpm', 'eslint', 'prettier', 'jest', 'cypress', 'storybook', 'gatsby', 'nuxt', 'remix', 'astro', 'sveltekit', 'solid', 'qwik', 'alpine', 'lit', 'stencil', 'preact', 'inferno', 'mithril', 'marko', 'aurelia', 'ember', 'backbone', 'jquery', 'lodash', 'moment', 'dayjs', 'date-fns', 'axios', 'fetch', 'xhr', 'websocket', 'socket.io', 'ws', 'fastify', 'koa', 'hapi', 'adonis', 'strapi', 'keystone', 'ghost', 'wordpress', 'drupal', 'joomla', 'magento', 'shopify', 'woocommerce', 'prestashop', 'opencart', 'oscommerce', 'zencart', 'cubecart', 'xcart', 'cscart', 'virtuemart', 'hikashop', 'j2store']
const BLOCKCHAIN_TECH = ['solidity', 'rust', 'move', 'web3', 'ethereum', 'blockchain', 'smart-contracts', 'defi', 'nft', 'cryptocurrency', 'web3.js', 'ethers.js', 'hardhat', 'foundry', 'truffle', 'ganache', 'metamask', 'walletconnect', 'ipfs', 'filecoin', 'polygon', 'bsc', 'binance', 'cardano', 'solana', 'avalanche', 'fantom', 'arbitrum', 'optimism', 'zksync', 'starknet', 'rollup', 'layer2', 'l2', 'l1', 'layer1', 'consensus', 'pow', 'pos', 'dpos', 'pbft', 'raft', 'paxos', 'byzantine', 'fault-tolerance', 'distributed', 'ledger', 'hash', 'sha256', 'keccak', 'ripemd', 'md5', 'merkle', 'tree', 'patricia', 'trie', 'radix', 'trie', 'bloom', 'filter', 'ring', 'signature', 'elliptic', 'curve', 'secp256k1', 'ed25519', 'x25519', 'chacha20', 'poly1305', 'aes', 'des', '3des', 'blowfish', 'twofish', 'serpent', 'camellia', 'seed', 'aria', 'sm4', 'gost', 'kuznyechik', 'magma', 'kalyna', 'simon', 'speck', 'lea', 'hight', 'clefia', 'piccolo', 'pride', 'midori', 'skinny', 'rectangle', 'present', 'led', 'prince', 'minalpher', 'ascon', 'gimli', 'xoodoo', 'keccak', 'sha3', 'shake', 'cshake', 'kmac', 'tuplehash', 'parallelhash', 'kangarootwelve', 'marsupial', 'elephant', 'dumbo', 'jumbo']

// Language to icon mapping
const LANGUAGE_ICONS: Record<string, string> = {
  'JavaScript': 'https://skillicons.dev/icons?i=javascript',
  'TypeScript': 'https://skillicons.dev/icons?i=typescript',
  'Python': 'https://skillicons.dev/icons?i=python',
  'R': 'https://skillicons.dev/icons?i=r',
  'Java': 'https://skillicons.dev/icons?i=java',
  'C++': 'https://skillicons.dev/icons?i=cpp',
  'C#': 'https://skillicons.dev/icons?i=cs',
  'Go': 'https://skillicons.dev/icons?i=go',
  'Rust': 'https://skillicons.dev/icons?i=rust',
  'Solidity': 'https://skillicons.dev/icons?i=solidity',
  'HTML': 'https://skillicons.dev/icons?i=html',
  'CSS': 'https://skillicons.dev/icons?i=css',
  'PHP': 'https://skillicons.dev/icons?i=php',
  'Ruby': 'https://skillicons.dev/icons?i=ruby',
  'Swift': 'https://skillicons.dev/icons?i=swift',
  'Kotlin': 'https://skillicons.dev/icons?i=kotlin',
  'Scala': 'https://skillicons.dev/icons?i=scala',
  'Dart': 'https://skillicons.dev/icons?i=dart',
  'Vue': 'https://skillicons.dev/icons?i=vue',
  'React': 'https://skillicons.dev/icons?i=react',
  'Next.js': 'https://skillicons.dev/icons?i=nextjs',
  'Node.js': 'https://skillicons.dev/icons?i=nodejs',
  'Express': 'https://skillicons.dev/icons?i=express',
  'Django': 'https://skillicons.dev/icons?i=django',
  'Flask': 'https://skillicons.dev/icons?i=flask',
  'Laravel': 'https://skillicons.dev/icons?i=laravel',
  'Spring': 'https://skillicons.dev/icons?i=spring',
  'Angular': 'https://skillicons.dev/icons?i=angular',
  'Svelte': 'https://skillicons.dev/icons?i=svelte',
  'Nuxt': 'https://skillicons.dev/icons?i=nuxt',
  'Gatsby': 'https://skillicons.dev/icons?i=gatsby',
  'Vite': 'https://skillicons.dev/icons?i=vite',
  'Webpack': 'https://skillicons.dev/icons?i=webpack',
  'Babel': 'https://skillicons.dev/icons?i=babel',
  'Jest': 'https://skillicons.dev/icons?i=jest',
  'Cypress': 'https://skillicons.dev/icons?i=cypress',
  'Docker': 'https://skillicons.dev/icons?i=docker',
  'Kubernetes': 'https://skillicons.dev/icons?i=kubernetes',
  'AWS': 'https://skillicons.dev/icons?i=aws',
  'Azure': 'https://skillicons.dev/icons?i=azure',
  'GCP': 'https://skillicons.dev/icons?i=gcp',
  'Firebase': 'https://skillicons.dev/icons?i=firebase',
  'Supabase': 'https://skillicons.dev/icons?i=supabase',
  'MongoDB': 'https://skillicons.dev/icons?i=mongodb',
  'PostgreSQL': 'https://skillicons.dev/icons?i=postgresql',
  'MySQL': 'https://skillicons.dev/icons?i=mysql',
  'Redis': 'https://skillicons.dev/icons?i=redis',
  'GraphQL': 'https://skillicons.dev/icons?i=graphql',
  'REST': 'https://skillicons.dev/icons?i=rest',
  'Git': 'https://skillicons.dev/icons?i=git',
  'GitHub': 'https://skillicons.dev/icons?i=github',
  'GitLab': 'https://skillicons.dev/icons?i=gitlab',
  'Bitbucket': 'https://skillicons.dev/icons?i=bitbucket',
  'VSCode': 'https://skillicons.dev/icons?i=vscode',
  'Vim': 'https://skillicons.dev/icons?i=vim',
  'Emacs': 'https://skillicons.dev/icons?i=emacs',
  'Linux': 'https://skillicons.dev/icons?i=linux',
  'Ubuntu': 'https://skillicons.dev/icons?i=ubuntu',
  'CentOS': 'https://skillicons.dev/icons?i=centos',
  'Debian': 'https://skillicons.dev/icons?i=debian',
  'Fedora': 'https://skillicons.dev/icons?i=fedora',
  'Arch': 'https://skillicons.dev/icons?i=arch',
  'Alpine': 'https://skillicons.dev/icons?i=alpine',
  'Windows': 'https://skillicons.dev/icons?i=windows',
  'macOS': 'https://skillicons.dev/icons?i=macos',
  'iOS': 'https://skillicons.dev/icons?i=ios',
  'Android': 'https://skillicons.dev/icons?i=android',
  'React Native': 'https://skillicons.dev/icons?i=react',
  'Flutter': 'https://skillicons.dev/icons?i=flutter',
  'Ionic': 'https://skillicons.dev/icons?i=ionic',
  'Cordova': 'https://skillicons.dev/icons?i=cordova',
  'Capacitor': 'https://skillicons.dev/icons?i=capacitor',
  'Electron': 'https://skillicons.dev/icons?i=electron',
  'Tauri': 'https://skillicons.dev/icons?i=tauri',
  'Wails': 'https://skillicons.dev/icons?i=wails',
  'Unity': 'https://skillicons.dev/icons?i=unity',
  'Unreal': 'https://skillicons.dev/icons?i=unreal',
  'Godot': 'https://skillicons.dev/icons?i=godot',
  'Blender': 'https://skillicons.dev/icons?i=blender',
  'Maya': 'https://skillicons.dev/icons?i=maya',
  '3ds Max': 'https://skillicons.dev/icons?i=3dsmax',
  'Cinema 4D': 'https://skillicons.dev/icons?i=cinema4d',
  'Houdini': 'https://skillicons.dev/icons?i=houdini',
  'ZBrush': 'https://skillicons.dev/icons?i=zbrush',
  'Substance': 'https://skillicons.dev/icons?i=substance',
  'Mari': 'https://skillicons.dev/icons?i=mari',
  'Nuke': 'https://skillicons.dev/icons?i=nuke',
  'Fusion': 'https://skillicons.dev/icons?i=fusion',
  'DaVinci': 'https://skillicons.dev/icons?i=davinci',
  'Premiere': 'https://skillicons.dev/icons?i=premiere',
  'After Effects': 'https://skillicons.dev/icons?i=aftereffects',
  'Photoshop': 'https://skillicons.dev/icons?i=photoshop',
  'Illustrator': 'https://skillicons.dev/icons?i=illustrator',
  'InDesign': 'https://skillicons.dev/icons?i=indesign',
  'XD': 'https://skillicons.dev/icons?i=xd',
  'Figma': 'https://skillicons.dev/icons?i=figma',
  'Sketch': 'https://skillicons.dev/icons?i=sketch',
  'InVision': 'https://skillicons.dev/icons?i=invision',
  'Zeplin': 'https://skillicons.dev/icons?i=zeplin',
  'Abstract': 'https://skillicons.dev/icons?i=abstract',
  'Principle': 'https://skillicons.dev/icons?i=principle',
  'Framer': 'https://skillicons.dev/icons?i=framer',
  'Webflow': 'https://skillicons.dev/icons?i=webflow',
  'WordPress': 'https://skillicons.dev/icons?i=wordpress',
  'Shopify': 'https://skillicons.dev/icons?i=shopify',
  'WooCommerce': 'https://skillicons.dev/icons?i=woocommerce',
  'Magento': 'https://skillicons.dev/icons?i=magento',
  'PrestaShop': 'https://skillicons.dev/icons?i=prestashop',
  'OpenCart': 'https://skillicons.dev/icons?i=opencart',
  'osCommerce': 'https://skillicons.dev/icons?i=oscommerce',
  'Zen Cart': 'https://skillicons.dev/icons?i=zencart',
  'CubeCart': 'https://skillicons.dev/icons?i=cubecart',
  'X-Cart': 'https://skillicons.dev/icons?i=xcart',
  'CS-Cart': 'https://skillicons.dev/icons?i=cscart',
  'VirtueMart': 'https://skillicons.dev/icons?i=virtuemart',
  'Hikashop': 'https://skillicons.dev/icons?i=hikashop',
  'J2Store': 'https://skillicons.dev/icons?i=j2store',
}

// Improved categorization function that allows multiple categories
function categorizeProject(repo: GitHubRepo, readmeContent: string = ''): ('AI Projects' | 'Web Projects' | 'Blockchain Projects')[] {
  const allText = [
    repo.name.toLowerCase(),
    repo.description?.toLowerCase() || '',
    repo.language?.toLowerCase() || '',
    ...repo.topics.map(t => t.toLowerCase()),
    readmeContent.toLowerCase()
  ].join(' ')

  const categories: ('AI Projects' | 'Web Projects' | 'Blockchain Projects')[] = []

  // Priority 1: Check for blockchain projects first (most specific)
  const hasBlockchainTech = BLOCKCHAIN_TECH.some(tech => allText.includes(tech))
  const hasSolidity = repo.language?.toLowerCase() === 'solidity'
  const hasMove = repo.language?.toLowerCase() === 'move'
  const hasRust = repo.language?.toLowerCase() === 'rust'
  const hasBlockchainName = repo.name.toLowerCase().includes('chain') || 
                           repo.name.toLowerCase().includes('blockchain') || 
                           repo.name.toLowerCase().includes('web3') ||
                           repo.name.toLowerCase().includes('defi') ||
                           repo.name.toLowerCase().includes('nft') ||
                           repo.name.toLowerCase().includes('cryptocurrency') ||
                           repo.name.toLowerCase().includes('crypto') ||
                           repo.name.toLowerCase().includes('movr') ||
                           repo.name.toLowerCase().includes('zeed') ||
                           repo.name.toLowerCase().includes('vibe') ||
                           repo.name.toLowerCase().includes('ethereum') ||
                           repo.name.toLowerCase().includes('polygon') ||
                           repo.name.toLowerCase().includes('solana') ||
                           repo.name.toLowerCase().includes('cardano') ||
                           repo.name.toLowerCase().includes('avalanche') ||
                           repo.name.toLowerCase().includes('fantom') ||
                           repo.name.toLowerCase().includes('arbitrum') ||
                           repo.name.toLowerCase().includes('optimism') ||
                           repo.name.toLowerCase().includes('zksync') ||
                           repo.name.toLowerCase().includes('starknet') ||
                           repo.name.toLowerCase().includes('smart-contract') ||
                           repo.name.toLowerCase().includes('dapp') ||
                           repo.name.toLowerCase().includes('wallet') ||
                           repo.name.toLowerCase().includes('metamask') ||
                           repo.name.toLowerCase().includes('ipfs') ||
                           repo.name.toLowerCase().includes('filecoin')
  
  // Strong blockchain indicators
  if (hasSolidity || hasMove || hasRust || hasBlockchainName || 
      (hasBlockchainTech && (repo.description?.toLowerCase().includes('blockchain') || 
                            repo.description?.toLowerCase().includes('web3') ||
                            repo.description?.toLowerCase().includes('decentralized') ||
                            repo.description?.toLowerCase().includes('smart contract')))) {
    categories.push('Blockchain Projects')
  }

  // Priority 2: Check for AI/ML projects (specific criteria)
  const hasAITech = AI_TECH.some(tech => allText.includes(tech))
  const hasPython = repo.language?.toLowerCase() === 'python'
  const hasAIName = repo.name.toLowerCase().includes('ai') || 
                   repo.name.toLowerCase().includes('ml') || 
                   repo.name.toLowerCase().includes('machine-learning') ||
                   repo.name.toLowerCase().includes('neural') ||
                   repo.name.toLowerCase().includes('deep-learning') ||
                   repo.name.toLowerCase().includes('lucra') ||
                   repo.name.toLowerCase().includes('prosparity') ||
                   repo.name.toLowerCase().includes('tensorflow') ||
                   repo.name.toLowerCase().includes('pytorch') ||
                   repo.name.toLowerCase().includes('opencv') ||
                   repo.name.toLowerCase().includes('scikit') ||
                   repo.name.toLowerCase().includes('chatbot') ||
                   repo.name.toLowerCase().includes('llm') ||
                   repo.name.toLowerCase().includes('gpt') ||
                   repo.name.toLowerCase().includes('huggingface') ||
                   repo.name.toLowerCase().includes('transformers') ||
                   repo.name.toLowerCase().includes('midas')
  
  // Strong AI indicators - only add if not already in blockchain
  if (!categories.includes('Blockchain Projects') && 
      (hasAIName || hasPython || 
       (hasAITech && (repo.description?.toLowerCase().includes('ai') || 
                     repo.description?.toLowerCase().includes('machine learning') ||
                     repo.description?.toLowerCase().includes('neural') ||
                     repo.description?.toLowerCase().includes('deep learning') ||
                     repo.description?.toLowerCase().includes('artificial intelligence') ||
                     repo.description?.toLowerCase().includes('ml') ||
                     repo.description?.toLowerCase().includes('data science') ||
                     repo.description?.toLowerCase().includes('predictive') ||
                     repo.description?.toLowerCase().includes('recommendation') ||
                     repo.description?.toLowerCase().includes('classification') ||
                     repo.description?.toLowerCase().includes('regression'))))) {
    categories.push('AI Projects')
  }

  // Priority 3: Check for web projects (default for JS/TS)
  const hasWebTech = WEB_TECH.some(tech => allText.includes(tech))
  const hasJS = repo.language?.toLowerCase() === 'javascript'
  const hasTS = repo.language?.toLowerCase() === 'typescript'
  const hasHTML = repo.language?.toLowerCase() === 'html'
  const hasCSS = repo.language?.toLowerCase() === 'css'
  const hasReact = repo.name.toLowerCase().includes('react') || allText.includes('react')
  const hasNext = repo.name.toLowerCase().includes('next') || allText.includes('next')
  const hasVue = repo.name.toLowerCase().includes('vue') || allText.includes('vue')
  const hasAngular = repo.name.toLowerCase().includes('angular') || allText.includes('angular')
  const hasSvelte = repo.name.toLowerCase().includes('svelte') || allText.includes('svelte')
  const hasNode = repo.name.toLowerCase().includes('node') || allText.includes('node')
  const hasExpress = repo.name.toLowerCase().includes('express') || allText.includes('express')
  
  // Web projects - only add if not already in blockchain or AI
  if (!categories.includes('Blockchain Projects') && !categories.includes('AI Projects') &&
      (hasJS || hasTS || hasHTML || hasCSS || hasWebTech || hasReact || hasNext || hasVue || hasAngular || hasSvelte || hasNode || hasExpress)) {
    categories.push('Web Projects')
  }

  // If no specific category found but has any programming language, default to Web Projects
  if (categories.length === 0 && repo.language) {
    categories.push('Web Projects')
  }

  return categories
}

function getProjectIcon(language: string | null, topics: string[]): string {
  if (language && LANGUAGE_ICONS[language]) {
    return LANGUAGE_ICONS[language]
  }

  // Try to find icon based on topics
  for (const topic of topics) {
    const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1)
    if (LANGUAGE_ICONS[capitalizedTopic]) {
      return LANGUAGE_ICONS[capitalizedTopic]
    }
  }

  // Default icon
  return 'https://skillicons.dev/icons?i=github'
}

function getTechStack(language: string | null, topics: string[]): string {
  const techs = []
  if (language) techs.push(language)
  techs.push(...topics.slice(0, 3)) // Top 3 topics
  return techs.join(', ')
}

function getProjectType(topics: string[]): string {
  if (topics.includes('hackathon')) return 'Hackathon Project'
  if (topics.includes('course')) return 'Course Project'
  if (topics.includes('research')) return 'Research Project'
  if (topics.includes('client')) return 'Client Project'
  if (topics.includes('open-source')) return 'Open Source'
  return 'Personal Project'
}

export async function fetchGitHubProjects(): Promise<{
  'AI Projects': CategorizedProject[]
  'Web Projects': CategorizedProject[]
  'Blockchain Projects': CategorizedProject[]
}> {
  // Check cache
  if (projectsCache.data && Date.now() - projectsCache.timestamp < CACHE_DURATION) {
    return projectsCache.data
  }

      try {
      // Try with primary username first
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      let response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { 
        headers: getGitHubHeaders(),
        signal: controller.signal
      })
      let username = GITHUB_USERNAME
      
      clearTimeout(timeoutId)
      
      // If primary username fails, try fallback username
      if (!response.ok) {
        const fallbackController = new AbortController()
        const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 10000)
        
        response = await fetch(`https://api.github.com/users/${FALLBACK_USERNAME}/repos?sort=updated&per_page=100`, { 
          headers: getGitHubHeaders(),
          signal: fallbackController.signal
        })
        username = FALLBACK_USERNAME
        
        clearTimeout(fallbackTimeoutId)
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }
      }

    const repos: GitHubRepo[] = await response.json()

    // Filter out private, archived repositories, and projects with 0 stars (include forks)
    const publicRepos = repos.filter(repo => 
      !repo.private && !repo.archived && repo.stargazers_count > 0
    )

    const categorized: {
      'AI Projects': CategorizedProject[]
      'Web Projects': CategorizedProject[]
      'Blockchain Projects': CategorizedProject[]
    } = {
      'AI Projects': [],
      'Web Projects': [],
      'Blockchain Projects': []
    }

    // Process each repository
    
    for (const repo of publicRepos) {
      // Fetch README content for better classification
      const readmeContent = await fetchReadmeContent(username, repo.name)
      
      // Get categories for this project (allows multiple categories)
      const categories = categorizeProject(repo, readmeContent)
      
      // Debug logging for important projects
      if (repo.name.toLowerCase().includes('lucra') || 
          repo.name.toLowerCase().includes('prosparity') ||
          repo.name.toLowerCase().includes('chain') || 
          repo.name.toLowerCase().includes('movr') || 
          repo.name.toLowerCase().includes('zeed') ||
          repo.name.toLowerCase().includes('vibe') ||
          repo.name.toLowerCase().includes('midas') ||
          repo.stargazers_count >= 5) {
        const allText = [
          repo.name.toLowerCase(),
          repo.description?.toLowerCase() || '',
          repo.language?.toLowerCase() || '',
          ...repo.topics.map(t => t.toLowerCase()),
          readmeContent.toLowerCase()
        ].join(' ')
      }
      
      const project: CategorizedProject = {
        title: repo.name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        type: getTechStack(repo.language, repo.topics),
        company: getProjectType(repo.topics),
        duration: new Date(repo.created_at).getFullYear().toString(),
        icon: getProjectIcon(repo.language, repo.topics),
        url: repo.html_url,
        description: repo.description || 'No description available',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown'
      }
      
      // Add project to all applicable categories
      categories.forEach(category => {
        categorized[category].push(project)
      })
    }
    
    // Sort by stars (no limit - show all projects)
    Object.keys(categorized).forEach(category => {
      categorized[category as keyof typeof categorized] = categorized[category as keyof typeof categorized]
        .sort((a, b) => b.stars - a.stars)
    })

    // Update cache
    projectsCache = {
      data: categorized,
      timestamp: Date.now()
    }

    return categorized
  } catch (error) {
    return {
      'AI Projects': [],
      'Web Projects': [],
      'Blockchain Projects': []
    }
  }
} 