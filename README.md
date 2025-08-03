# Spotify UI Portfolio

A beautiful portfolio website built with Next.js and styled to look like Spotify's interface. Features include GitHub search integration and real-time Spotify playback controls.

## Features

- **Spotify-like UI**: Beautiful dark theme with Spotify's signature design
- **GitHub Search Integration**: Search across repositories, code, and issues
- **Real-time Spotify Controls**: Display and control your currently playing music
- **Responsive Design**: Works perfectly on desktop and mobile
- **Portfolio Sections**: Education, Work Experience, AI Projects, Web Projects, Blockchain Projects, Skills & Tools, Contact

## Setup

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Spotify Premium account (for playback controls)
- GitHub account (for search integration)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spotify-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```env
# GitHub API Configuration
# Get this from https://github.com/settings/tokens
NEXT_PUBLIC_GITHUB_TOKEN=your_github_personal_access_token_here
```

### Spotify Setup

The Spotify integration is already configured with your account credentials. The player will show your currently playing music without requiring any setup from visitors.

### GitHub Setup

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token with the following scopes:
   - `public_repo` (for public repository access)
   - `read:user` (for user information)
3. Copy the token to your `.env.local` file

### Running the Application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Search Functionality

- **Portfolio Search**: Search through your portfolio items (education, projects, etc.)
- **GitHub Search**: Search repositories, code, and issues across GitHub
- **Recent Searches**: Your recent searches are saved and displayed

### Spotify Integration

- **Real-time Playback**: See your currently playing track with album art and progress
- **Playback Controls**: Play/pause, skip tracks, adjust volume, shuffle, and repeat
- **Open Spotify**: Click the music icon to open Spotify in a new tab
- **Your Music**: The player shows your personal Spotify playback (hardcoded to your account)

## Project Structure

```
spotify-ui/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── auth/          # Spotify authentication
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── MainContent.tsx   # Main content area
│   ├── PlayerControls.tsx # Spotify player controls
│   ├── RightSidebar.tsx  # About section
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── TopBar.tsx        # Search bar and navigation
├── lib/                  # Utility libraries
│   ├── github.ts         # GitHub API integration
│   ├── github-search.ts  # GitHub search functionality
│   └── spotify.ts        # Spotify API integration
└── public/               # Static assets
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Spotify Web API** - Music playback
- **GitHub API** - Repository search
- **Fuse.js** - Fuzzy search
- **Lucide React** - Icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details. 