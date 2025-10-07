# Nanosoft Suite - Implementation Guide

## What's Been Built (Phase 1-2)

### ✅ Completed Features

1. **Project Infrastructure**
   - Vite + React 18 + TypeScript setup
   - TailwindCSS styling system
   - React Router for navigation
   - Responsive mobile-first layout

2. **Core Data Models**
   - TypeScript interfaces for all table types (Fusion, Fission, TwoToTwo, Nuclides, Elements)
   - Query filter types
   - Cascade parameter types

3. **User Interface**
   - Responsive sidebar navigation
   - Home page with feature overview
   - Mobile-friendly hamburger menu

4. **"Big Three" Query Tools** (with mock data)
   - **Fusion Query Tool** (`src/pages/FusionQuery.tsx`)
     - Element selection
     - MeV energy range filters
     - Neutrino type selection
     - Results table with export to CSV
     - SQL preview

   - **Fission Query Tool** (`src/pages/FissionQuery.tsx`)
     - Similar UI to Fusion
     - Fission-specific table structure

   - **TwoToTwo Query Tool** (`src/pages/TwoToTwoQuery.tsx`)
     - 2-input, 2-output reaction interface
     - Enhanced table display

5. **Supporting Pages**
   - Show Element Data - Element property viewer
   - Tables in Detail - Schema documentation
   - All Tables - SQL query editor
   - Cascades - Cascade simulation interface

## Next Steps (Phase 3-6)

### Priority 1: Real Data Integration

**Replace mock data with actual Parkhomov tables using sql.js**

1. **Install sql.js**
   ```bash
   npm install sql.js
   ```

2. **Create database initialization service** (`src/services/database.ts`)
   ```typescript
   import initSqlJs from 'sql.js';

   export async function initDatabase() {
     const SQL = await initSqlJs({
       locateFile: file => `https://sql.js.org/dist/${file}`
     });

     // Create database
     const db = new SQL.Database();

     // Load schema and data
     // ... execute CREATE TABLE statements
     // ... execute INSERT statements

     return db;
   }
   ```

3. **Data Requirements**
   - FusionAll table (~1,389 rows)
   - FissionAll table (~817 rows)
   - TwoToTwoAll table (~516,789 rows)
   - NuclidesPlus table (~324 rows)
   - ElementsPlus table (~118 rows)

4. **Create data loading utilities**
   - CSV parser for Parkhomov spreadsheets
   - SQL generator from CSV data
   - Database export/import functions

### Priority 2: Query Execution Engine

**Implement actual SQL query execution**

1. **Create query service** (`src/services/queryService.ts`)
   ```typescript
   export function executeFusionQuery(db: Database, filter: QueryFilter) {
     const sql = buildFusionSQL(filter);
     const results = db.exec(sql);
     return parseResults(results);
   }
   ```

2. **Update query pages to use real database**
   - Replace mock data calls with query service
   - Add error handling for SQL errors
   - Implement result caching

3. **Add advanced filters**
   - Boson/Fermion filters (nBorF, aBorF)
   - Multiple element selection
   - Complex WHERE clauses

### Priority 3: Cascade Simulation Logic

**Implement the recursive cascade algorithm**

1. **Create cascade engine** (`src/services/cascadeEngine.ts`)
   ```typescript
   export async function runCascadeSimulation(
     db: Database,
     params: CascadeParameters
   ): Promise<CascadeResults> {
     // 1. Parse fuel nuclides
     // 2. Find initial reactions (Fusion + TwoToTwo)
     // 3. Apply feedback rules (Boson/Fermion, temperature)
     // 4. Recursive loop until max loops or no new nuclides
     // 5. Return reaction tree and product distribution
   }
   ```

2. **Add progress tracking**
   - Web Worker for background processing
   - Progress bar UI
   - Cancellation support

3. **Implement feedback rules**
   - Temperature threshold checks
   - Melting/boiling point filters
   - Dimer formation logic
   - Boson/Fermion classification

### Priority 4: Data Visualization

**Add charts and graphs for better insight**

1. **Install visualization library**
   ```bash
   npm install recharts
   ```

2. **Create visualization components**
   - Energy distribution histogram
   - Periodic table heatmap (nuclides in results)
   - Reaction network graph (D3.js or Cytoscape.js)
   - Cascade tree visualization

3. **Add to query results**
   - Toggle between table and chart views
   - Export charts as images

### Priority 5: Enhanced Features

1. **Query History & Saved Queries**
   - LocalStorage persistence
   - Query naming and organization
   - Share query via URL

2. **Result Export Options**
   - CSV (already implemented)
   - JSON export
   - PDF reports with charts
   - Share results via URL

3. **Advanced SQL Builder**
   - Visual query builder (no SQL knowledge required)
   - Query validation
   - Autocomplete for table/field names
   - Query explanation

4. **Help System**
   - Inline tooltips
   - Example queries library
   - Tutorial walkthrough
   - Field glossary

### Priority 6: Performance & Polish

1. **Optimization**
   - Web Workers for heavy queries
   - Virtual scrolling for large tables
   - Query result pagination
   - Database indexing

2. **Testing**
   - Unit tests for query builder
   - Integration tests for cascade logic
   - E2E tests with Playwright

3. **Build & Deploy**
   - Optimize bundle size
   - PWA support (offline mode)
   - Deploy to Netlify/Vercel
   - Custom domain setup

## Data Acquisition

### Option 1: Convert Original Spreadsheets
1. Download from nanosoft.co.nz or MFMP sources
2. Convert Excel/CSV to SQL INSERT statements
3. Bundle with app or load on-demand

### Option 2: API Integration
1. Create backend API to serve data
2. Use React Query for data fetching
3. Server-side query optimization

### Option 3: Static JSON Files
1. Pre-process tables to JSON
2. Load incrementally
3. Client-side filtering/sorting

## Recommended Implementation Order

**Week 1-2**: Data integration
- Set up sql.js
- Convert and load Parkhomov tables
- Update query pages to use real data

**Week 3**: Polish query tools
- Advanced filters
- Better result displays
- Export improvements

**Week 4**: Cascade logic
- Implement cascade algorithm
- Add progress tracking
- Test with known examples

**Week 5-6**: Visualization & UX
- Add charts and graphs
- Query history
- Help system

**Week 7+**: Optimization & deployment
- Performance tuning
- Testing
- Production deployment

## Development Tips

1. **Start with small datasets** - Test with 100-row subsets before loading full tables
2. **Use Web Workers** - Keep UI responsive during heavy processing
3. **Cache aggressively** - Query results, parsed nuclides, etc.
4. **Progressive enhancement** - Basic functionality first, fancy features later
5. **Mobile-first** - Ensure usability on tablets/phones

## Resources

- sql.js documentation: https://sql.js.org/
- Recharts: https://recharts.org/
- React Query: https://tanstack.com/query/latest
- Vite: https://vitejs.dev/

## Questions to Answer

1. **Data source**: Where will the Parkhomov tables come from?
2. **Hosting**: Static site or with backend API?
3. **Scale**: Support 1000+ users or personal use?
4. **Offline**: Should it work offline (PWA)?
5. **Collaboration**: Multiple users sharing queries?

---

**Current Status**: Foundation complete, ready for data integration phase.
**Est. Time to MVP**: 4-6 weeks with focused development
**Est. Time to Full Feature Set**: 8-12 weeks
