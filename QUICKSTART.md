# Quick Start Guide

## Your App is Running! 🎉

The development server is live at: **http://localhost:5173/**

## What You Have Now

A fully functional React SPA with:

### ✅ Working Pages
1. **Home** (`/`) - Overview and navigation
2. **Fusion Query** (`/fusion`) - Query fusion reactions
3. **Fission Query** (`/fission`) - Query fission reactions
4. **Two-To-Two Query** (`/twotwo`) - Query 2-2 transmutation reactions
5. **Show Element Data** (`/element-data`) - Element property viewer
6. **Tables in Detail** (`/tables`) - Database schema browser
7. **All Tables** (`/all-tables`) - SQL query editor
8. **Cascades** (`/cascades`) - Cascade simulation interface

### ✅ Core Features
- Responsive sidebar navigation (mobile-friendly)
- Query builder interfaces with filters
- Mock data for testing UI/UX
- CSV export functionality
- SQL preview panels
- TypeScript type safety throughout

## Project Structure

```
lenr.academy/
├── src/
│   ├── components/      # UI components
│   │   └── Layout.tsx   # Main layout with sidebar
│   ├── pages/          # Route pages (one per tool)
│   ├── services/       # Data layer (currently mock data)
│   ├── types/          # TypeScript definitions
│   ├── App.tsx         # Router setup
│   └── main.tsx        # Entry point
├── docs/               # Original nanosoft.txt documentation
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server (already running!)

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npx tsc --noEmit       # Check TypeScript errors
npm run lint           # Run ESLint

# Stop dev server
# Press Ctrl+C in the terminal where it's running
```

## Making Changes

### Add a new page
1. Create file in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Add link in `src/components/Layout.tsx` navigation array

### Modify styles
- Global styles: `src/index.css`
- Tailwind utilities: Use className with Tailwind classes
- Component-specific: Add to the component file

### Update data models
- Edit `src/types/index.ts` for TypeScript interfaces
- Update `src/services/mockData.ts` for mock data

## Next Priority: Real Data Integration

The app currently uses mock data. To connect real Parkhomov tables:

### Option A: SQL.js (Recommended for SPA)
```bash
npm install sql.js

# Create src/services/database.ts
# Load .db file or create from CSV/Excel data
# Update query pages to use real SQL queries
```

### Option B: JSON Data Files
```bash
# Convert Parkhomov spreadsheets to JSON
# Place in public/data/
# Load with fetch() and filter client-side
```

### Option C: Backend API
```bash
# Set up separate API server
# Use React Query for data fetching
# Configure CORS
```

See `IMPLEMENTATION_GUIDE.md` for detailed steps.

## Tips for Development

1. **Hot Reload**: Changes auto-reload in browser
2. **TypeScript Errors**: Show in terminal and IDE
3. **Console**: Open browser DevTools (F12) for debugging
4. **Mobile Testing**: Use browser's responsive mode or resize window

## Customization Ideas

### Immediate Wins (30 min - 2 hours each)
- [ ] Change color scheme in `tailwind.config.js`
- [ ] Add more example queries to All Tables page
- [ ] Expand element data display with more fields
- [ ] Add tooltips explaining fields (using title attribute)
- [ ] Create a "Help" or "About" page

### Quick Features (2-4 hours each)
- [ ] Save queries to localStorage
- [ ] Dark mode toggle
- [ ] Result pagination
- [ ] Copy query URL to clipboard
- [ ] Print-friendly result views

### Medium Features (1-2 days each)
- [ ] Chart visualization with Recharts
- [ ] Advanced filter builder (no SQL needed)
- [ ] Query history sidebar
- [ ] Export to JSON/PDF
- [ ] Periodic table interactive selector

## Getting Real Data

You'll need the Parkhomov tables. Sources:

1. **Original Site**: nanosoft.co.nz (check Downloads section)
2. **MFMP**: Martin Fleischmann Memorial Project
3. **Excel/CSV**: Dr. Parkhomov's published spreadsheets
4. **Contact**: Reach out to Bob Greenyer or MFMP community

Data needed:
- FusionAll (~1,389 rows)
- FissionAll (~817 rows)
- TwoToTwoAll (~516,789 rows - this is large!)
- NuclidesPlus (~324 rows)
- ElementsPlus (~118 rows)

## Deployment Options

When ready to deploy:

### Netlify (Easiest)
```bash
npm run build
# Drag dist/ folder to netlify.com
```

### Vercel
```bash
npm i -g vercel
vercel
```

### GitHub Pages
```bash
# Set base in vite.config.ts
npm run build
# Deploy dist/ to gh-pages branch
```

## Resources

- **Vite Docs**: https://vitejs.dev/
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Lucide Icons**: https://lucide.dev/

## Questions?

Check these files:
- `README.md` - Project overview
- `IMPLEMENTATION_GUIDE.md` - Detailed next steps
- `docs/nanosoft.txt` - Original Nanosoft documentation

## Current Limitations

⚠️ **Using Mock Data** - Only 2-10 sample reactions per table
⚠️ **No Real Queries** - SQL preview doesn't execute
⚠️ **No Cascade Logic** - Cascade page is UI only
⚠️ **No Visualizations** - Text/tables only (no charts yet)

These are your next implementation priorities! See `IMPLEMENTATION_GUIDE.md` for the roadmap.

---

**Status**: Foundation complete, ready for data integration
**Dev Server**: Running at http://localhost:5173/
**Build**: TypeScript compiled successfully, no errors
