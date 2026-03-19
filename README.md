# Roulette

A browser-based European roulette game built with Vue 3 and GSAP.

**[Play live →](https://goldenspade.github.io/roulette/)**

## Features

- Animated SVG roulette wheel with GSAP (power3.out easing)
- Full European roulette betting table (37 numbers, 0–36)
- Straight-up bets (35:1), column / dozen bets (2:1), outside bets (1:1)
- Chip selector: $1 / $5 / $10 / $25 / $100
- Repeat last bets button
- Win/loss result toast with net amount
- Spin history (last 15 results, colour-coded)

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Vue 3](https://vuejs.org/) + Composition API | UI & reactivity |
| [Vite](https://vitejs.dev/) | Dev server & bundler |
| [GSAP](https://gsap.com/) | Wheel spin animation |
| SVG | Wheel rendering (no canvas, no 3-D) |

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── constants.js          # Wheel numbers, payouts, animation settings
├── stores/
│   └── gameStore.js      # Reactive game state & logic (singleton)
└── components/
    ├── RouletteWheel.vue  # SVG wheel + GSAP spin
    ├── BettingTable.vue   # Betting grid
    ├── ChipSelector.vue   # Chip picker & bet controls
    ├── ChipIndicator.vue  # Per-cell bet amount badge
    ├── NumberHistory.vue  # Recent results bar
    └── ResultToast.vue    # Win/loss notification
```

## Deployment (GitHub Pages)

```bash
npm run build
# then push the dist/ folder to the gh-pages branch, or use GitHub Actions
```

The `base` in `vite.config.js` is already set to `/roulette/`.

## Rules

| Bet | Covers | Payout |
|-----|--------|--------|
| Straight up | Single number | 35:1 |
| Column / Dozen | 12 numbers | 2:1 |
| Red / Black | 18 numbers | 1:1 |
| Even / Odd | 18 numbers | 1:1 |
| 1–18 / 19–36 | 18 numbers | 1:1 |

Zero (0) wins only straight-up bets on 0. All outside bets lose on zero.

## License

MIT
