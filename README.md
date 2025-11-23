# WatcherAI Frontend

A minimal Next.js application that provides a clean interface for AI explainability. Users paste a prompt and model output, click "Explain," and receive an intuitive breakdown of how the AI arrived at its response.

## Features

- **Token Influence Visualization** - See which parts of your prompt most influenced the output
- **Safety Assessment** - Instant safety check with confidence scores
- **Deep Insights** - Understand the reasoning patterns behind AI decisions
- **Analysis History** - Browse past analyses

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/isahan78/watcherai-frontend.git
cd watcherai-frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### Configuration

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
watcherai-frontend/
├── app/
│   ├── layout.tsx              # Root layout with Navbar
│   ├── page.tsx                # Home page (/)
│   ├── globals.css             # Global styles
│   ├── analyze/
│   │   └── page.tsx            # Analysis input page (/analyze)
│   ├── results/
│   │   └── [id]/
│   │       └── page.tsx        # Results page (/results/[id])
│   └── history/
│       └── page.tsx            # History page (/history)
├── components/
│   ├── Navbar.tsx              # Navigation bar
│   ├── InputForm.tsx           # Prompt/output input form
│   ├── Explanation.tsx         # Main explanation display
│   ├── InfluenceBars.tsx       # Token influence visualization
│   ├── SafetyBadge.tsx         # Safety/confidence indicator
│   ├── LoadingSpinner.tsx      # Loading state
│   └── HistoryCard.tsx         # History list item
├── lib/
│   ├── api.ts                  # API client functions
│   └── types.ts                # TypeScript interfaces
└── public/
    └── logo.svg                # WatcherAI logo
```

## API Endpoints

The frontend expects the following backend endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/analyze` | POST | Submit analysis, returns `{ id }` |
| `/analysis/{id}` | GET | Get analysis result |
| `/history` | GET | List past analyses |

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Or connect via [Vercel Dashboard](https://vercel.com):
1. Import from GitHub
2. Add environment variable: `NEXT_PUBLIC_API_URL`
3. Deploy

## License

MIT
