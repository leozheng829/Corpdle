# Corpdle

**Corpdle** is a daily company guessing game inspired by Wordle. Test your knowledge of major corporations by guessing the company based on a series of hints. Built with React, Vite, TypeScript, Tailwind CSS, and Radix UI.

## Features

- 🎯 **Daily Company Guessing Game**: Guess the company in 6 tries, with a new hint revealed after each incorrect guess.
- 🏢 **Diverse Company Database**: Hundreds of major companies to discover, each with unique hints.
- 💡 **Progressive Hints**: Hints include annual revenue, headquarters, industry, CEO, brand colors, and slogan/motto.
- 📈 **Statistics Tracking**: Track your games played, win percentage, current streak, max streak, and guess distribution.
- 🔄 **Play Again**: Start a new game at any time with a different company.
- 🌙 **Dark Mode**: Modern, responsive UI with light and dark themes.
- 🎉 **Confetti Animation**: Celebrate your wins with confetti!

## How to Play

1. A company is randomly selected for you to guess.
2. You start with the "Annual Revenue" hint.
3. Type your guess and submit.
4. Each incorrect guess reveals a new hint in this order:
   - Annual Revenue
   - Headquarters
   - Industry
   - CEO
   - Brand Colors
   - Slogan/Motto
5. You have 6 guesses to identify the company.
6. Win by guessing correctly, or see the answer if you run out of guesses.
7. Use the "New Company" button to play again instantly.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```bash
git clone https://github.com/yourusername/corpdle.git
cd "Corpdle Website"
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)
- [Zod](https://zod.dev/) (validation)
- [Sonner](https://sonner.emilkowal.ski/) (toasts)

## Project Structure

```
Corpdle Website/
  ├── public/           # Static assets
  ├── src/
  │   ├── components/   # Reusable UI components
  │   ├── hooks/        # Custom React hooks
  │   ├── lib/          # Game logic and utilities
  │   ├── pages/        # Main app pages (Game, Stats, HowToPlay, etc.)
  │   └── App.tsx       # App entry point
  ├── index.html
  ├── package.json
  └── ...
```

## Credits

- Inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html)
- Company data and hints are for educational and entertainment purposes only.
