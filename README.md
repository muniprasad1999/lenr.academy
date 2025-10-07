# LENR Academy - Nanosoft Suite

A modern React SPA implementation of the Nanosoft Package for exploring Low Energy Nuclear Reactions (LENR) and cold fusion transmutation pathways.

## About

This application provides interactive tools for querying and analyzing nuclear reaction databases originally compiled by Dr. Alexander Parkhomov. The Parkhomov tables contain:

- **1,389 fusion reactions** - combining lighter nuclei
- **817 fission reactions** - splitting heavier nuclei
- **516,789 two-to-two reactions** - transforming pairs of nuclides

All reactions are exothermic (energy-producing) and represent thermodynamically favorable pathways for nuclear transmutation.

## Features

### Core Query Tools ("Big Three")
- **Fusion Reactions**: Query reactions where two nuclei combine to form a heavier nucleus
- **Fission Reactions**: Query reactions where heavy nuclei split into lighter products
- **Two-To-Two Reactions**: Query 2-2 transmutation reactions

### Supporting Tools
- **Show Element Data**: Interactive periodic table and element property viewer
- **Tables in Detail**: Database schema browser
- **All Tables**: Advanced SQL query builder for custom queries
- **Cascade Simulations**: Model chain reactions and predict reaction products

## Technology Stack

- **React 18** + **TypeScript** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first styling
- **React Router** - Client-side routing
- **sql.js** - Client-side SQLite database (WebAssembly)
- **Lucide React** - Icon library

## Getting Started

### Prerequisites
- Node.js 18+ or Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── Layout.tsx   # Main app layout with sidebar
├── pages/           # Route pages
│   ├── Home.tsx
│   ├── FusionQuery.tsx
│   ├── FissionQuery.tsx
│   ├── TwoToTwoQuery.tsx
│   ├── ShowElementData.tsx
│   ├── TablesInDetail.tsx
│   ├── AllTables.tsx
│   └── CascadesAll.tsx
├── services/        # Data layer
│   ├── database.ts     # sql.js database initialization
│   └── queryService.ts # SQL query execution engine
├── contexts/        # React contexts
│   └── DatabaseContext.tsx  # Global database state
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.tsx          # Main app component with routing
├── main.tsx         # Application entry point
└── index.css        # Global styles
```

## Current Status

**Phase 1-3 Complete**:
- ✅ Project setup with Vite + React + TypeScript + TailwindCSS
- ✅ Core TypeScript interfaces and data models
- ✅ Responsive layout with sidebar navigation
- ✅ "Big Three" query tools (Fusion, Fission, TwoToTwo)
- ✅ Supporting pages (Element Data, Tables, All Tables, Cascades)
- ✅ **sql.js integration** with client-side SQLite database
- ✅ **Real SQL query execution** across all query pages
- ✅ **PeriodicTableSelector component** with multi-select
- ✅ Advanced filtering (multi-element, energy ranges, neutrino types)
- ✅ Dynamic SQL preview and query execution timing
- ✅ CSV export functionality

**Next Steps**:
- [ ] Load complete Parkhomov reaction tables from HTML docs
- [ ] Add data visualization components (charts, graphs)
- [ ] Implement cascade simulation logic
- [ ] Add query history and saved queries
- [ ] Performance optimization with web workers
- [ ] PWA support for offline use

## Data Sources

Based on the groundbreaking work of:
- **Dr. Alexander Parkhomov** - Original Parkhomov tables
- Martin Fleischmann Memorial Project
- R.W. Greenyer and P.W. Power - Original Nanosoft package

## License

This is an open science project. Data tables are publicly available from the Martin Fleischmann Memorial Project.

## Contributing

Contributions welcome! This is an educational tool for exploring LENR theory and data.
