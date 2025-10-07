// Mock data service - will be replaced with sql.js later
import type { Element, Nuclide, FusionReaction, FissionReaction, TwoToTwoReaction } from '../types'

// Sample elements (first 20)
export const mockElements: Element[] = [
  { Z: 1, E: 'H', EName: 'Hydrogen', Period: 1, Group: 1, Melting: 14.01, Boiling: 20.28 },
  { Z: 2, E: 'He', EName: 'Helium', Period: 1, Group: 18, Melting: 0.95, Boiling: 4.22 },
  { Z: 3, E: 'Li', EName: 'Lithium', Period: 2, Group: 1, Melting: 453.69, Boiling: 1615 },
  { Z: 5, E: 'B', EName: 'Boron', Period: 2, Group: 13, Melting: 2349, Boiling: 4200 },
  { Z: 6, E: 'C', EName: 'Carbon', Period: 2, Group: 14, Melting: 3823, Boiling: 4098 },
  { Z: 7, E: 'N', EName: 'Nitrogen', Period: 2, Group: 15, Melting: 63.15, Boiling: 77.36 },
  { Z: 8, E: 'O', EName: 'Oxygen', Period: 2, Group: 16, Melting: 54.36, Boiling: 90.20 },
  { Z: 13, E: 'Al', EName: 'Aluminum', Period: 3, Group: 13, Melting: 933.47, Boiling: 2792 },
  { Z: 28, E: 'Ni', EName: 'Nickel', Period: 4, Group: 10, Melting: 1728, Boiling: 3186 },
  { Z: 82, E: 'Pb', EName: 'Lead', Period: 6, Group: 14, Melting: 600.61, Boiling: 2022 },
]

// Sample nuclides
export const mockNuclides: Nuclide[] = [
  { id: 1, Z: 1, A: 1, E: 'H', BE: 0, AMU: 1.00783, nBorF: 'f', aBorF: 'b' },
  { id: 2, Z: 1, A: 2, E: 'D', BE: 2.224, AMU: 2.01410, nBorF: 'b', aBorF: 'f' },
  { id: 3, Z: 2, A: 4, E: 'He', BE: 28.296, AMU: 4.00260, nBorF: 'b', aBorF: 'b' },
  { id: 4, Z: 3, A: 6, E: 'Li', BE: 31.995, AMU: 6.01512, nBorF: 'b', aBorF: 'f' },
  { id: 5, Z: 3, A: 7, E: 'Li', BE: 39.245, AMU: 7.01600, nBorF: 'f', aBorF: 'b' },
  { id: 6, Z: 7, A: 14, E: 'N', BE: 104.659, AMU: 14.00307, nBorF: 'b', aBorF: 'f' },
  { id: 7, Z: 28, A: 58, E: 'Ni', BE: 506.459, AMU: 57.93535, nBorF: 'b', aBorF: 'b' },
  { id: 8, Z: 28, A: 60, E: 'Ni', BE: 526.846, AMU: 59.93079, nBorF: 'b', aBorF: 'b' },
  { id: 9, Z: 28, A: 62, E: 'Ni', BE: 545.259, AMU: 61.92835, nBorF: 'b', aBorF: 'b' },
  { id: 10, Z: 82, A: 208, E: 'Pb', BE: 1636.447, AMU: 207.97665, nBorF: 'b', aBorF: 'b' },
]

// Sample fusion reactions
export const mockFusionReactions: FusionReaction[] = [
  {
    id: 1,
    E1: 'H', Z1: 1, A1: 1,
    E2: 'H', Z2: 1, A2: 1,
    E: 'He', Z: 2, A: 4,
    MeV: 24.69,
    neutrino: 'none',
    nBorF1: 'f', aBorF1: 'b',
    nBorF2: 'f', aBorF2: 'b',
    nBorF: 'b', aBorF: 'b'
  },
  {
    id: 2,
    E1: 'D', Z1: 1, A1: 2,
    E2: 'D', Z2: 1, A2: 2,
    E: 'He', Z: 2, A: 4,
    MeV: 23.85,
    neutrino: 'none',
    nBorF1: 'b', aBorF1: 'f',
    nBorF2: 'b', aBorF2: 'f',
    nBorF: 'b', aBorF: 'b'
  },
]

// Sample fission reactions
export const mockFissionReactions: FissionReaction[] = [
  {
    id: 1,
    E: 'Pb', Z: 82, A: 208,
    E1: 'Ni', Z1: 28, A1: 58,
    E2: 'Sn', Z2: 50, A2: 120,
    MeV: 15.32,
    neutrino: 'none',
    nBorF: 'b', aBorF: 'b',
    nBorF1: 'b', aBorF1: 'b',
    nBorF2: 'b', aBorF2: 'b'
  },
]

// Sample 2-2 reactions
export const mockTwoToTwoReactions: TwoToTwoReaction[] = [
  {
    id: 1,
    E1: 'H', Z1: 1, A1: 1,
    E2: 'Ni', Z2: 28, A2: 58,
    E3: 'Li', Z3: 3, A3: 7,
    E4: 'Cr', Z4: 24, A4: 52,
    MeV: 12.45,
    neutrino: 'none',
    nBorF1: 'f', aBorF1: 'b',
    nBorF2: 'b', aBorF2: 'b',
    nBorF3: 'f', aBorF3: 'b',
    nBorF4: 'b', aBorF4: 'b'
  },
]

// Helper function to filter by element
export function filterByElement(data: any[], element: string): any[] {
  return data.filter(item =>
    item.E === element || item.E1 === element || item.E2 === element ||
    item.E3 === element || item.E4 === element
  )
}

// Helper to get unique elements from reactions
export function getUniqueElements(reactions: any[]): string[] {
  const elements = new Set<string>()
  reactions.forEach(r => {
    if (r.E) elements.add(r.E)
    if (r.E1) elements.add(r.E1)
    if (r.E2) elements.add(r.E2)
    if (r.E3) elements.add(r.E3)
    if (r.E4) elements.add(r.E4)
  })
  return Array.from(elements).sort()
}
