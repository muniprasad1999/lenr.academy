import { useState } from 'react'
import { Search, Download, Info } from 'lucide-react'
import type { FusionReaction, QueryFilter } from '../types'
import { mockFusionReactions, mockElements } from '../services/mockData'

export default function FusionQuery() {
  const [filter, setFilter] = useState<QueryFilter>({
    elements: [],
    minMeV: undefined,
    maxMeV: undefined,
    neutrinoTypes: ['none', 'left', 'right'],
    limit: 100,
    orderBy: 'MeV',
    orderDirection: 'desc'
  })

  const [results, setResults] = useState<FusionReaction[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedElement, setSelectedElement] = useState('')

  const handleQuery = () => {
    // Mock query - will be replaced with actual SQL query
    let filtered = [...mockFusionReactions]

    if (filter.minMeV !== undefined) {
      filtered = filtered.filter(r => r.MeV >= filter.minMeV!)
    }

    if (filter.maxMeV !== undefined) {
      filtered = filtered.filter(r => r.MeV <= filter.maxMeV!)
    }

    if (filter.orderDirection === 'desc') {
      filtered.sort((a, b) => b.MeV - a.MeV)
    } else {
      filtered.sort((a, b) => a.MeV - b.MeV)
    }

    setResults(filtered.slice(0, filter.limit || 100))
    setShowResults(true)
  }

  const exportToCSV = () => {
    if (results.length === 0) return

    const headers = ['E1', 'Z1', 'A1', 'E', 'Z', 'A', 'MeV', 'neutrino', 'nBorF1', 'aBorF1', 'nBorF', 'aBorF']
    const csvContent = [
      headers.join(','),
      ...results.map(r => [
        r.E1, r.Z1, r.A1, r.E, r.Z, r.A, r.MeV, r.neutrino, r.nBorF1, r.aBorF1, r.nBorF, r.aBorF
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fusion_reactions.csv'
    a.click()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fusion Reactions</h1>
        <p className="text-gray-600">Query exothermic fusion reactions where two nuclei combine to form a heavier nucleus</p>
      </div>

      {/* Query Builder */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Query Parameters</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Element Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Element (E1)
            </label>
            <select
              className="input"
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
            >
              <option value="">All Elements</option>
              {mockElements.map(el => (
                <option key={el.Z} value={el.E}>{el.E} - {el.EName}</option>
              ))}
            </select>
          </div>

          {/* MeV Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energy Range (MeV)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="input flex-1"
                value={filter.minMeV || ''}
                onChange={(e) => setFilter({...filter, minMeV: e.target.value ? parseFloat(e.target.value) : undefined})}
              />
              <input
                type="number"
                placeholder="Max"
                className="input flex-1"
                value={filter.maxMeV || ''}
                onChange={(e) => setFilter({...filter, maxMeV: e.target.value ? parseFloat(e.target.value) : undefined})}
              />
            </div>
          </div>

          {/* Neutrino Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Neutrino Involvement
            </label>
            <div className="space-y-2">
              {['none', 'left', 'right'].map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filter.neutrinoTypes?.includes(type as any)}
                    onChange={(e) => {
                      const types = filter.neutrinoTypes || []
                      if (e.target.checked) {
                        setFilter({...filter, neutrinoTypes: [...types, type as any]})
                      } else {
                        setFilter({...filter, neutrinoTypes: types.filter(t => t !== type)})
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Result Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Result Limit
            </label>
            <input
              type="number"
              className="input"
              value={filter.limit || 100}
              onChange={(e) => setFilter({...filter, limit: parseInt(e.target.value) || 100})}
              max={1000}
            />
            <p className="text-xs text-gray-500 mt-1">Maximum 1000 rows</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleQuery}
            className="btn btn-primary px-6 py-2"
          >
            <Search className="w-4 h-4 mr-2 inline" />
            Execute Query
          </button>
          <button
            onClick={() => setFilter({
              elements: [],
              minMeV: undefined,
              maxMeV: undefined,
              neutrinoTypes: ['none', 'left', 'right'],
              limit: 100,
              orderBy: 'MeV',
              orderDirection: 'desc'
            })}
            className="btn btn-secondary px-6 py-2"
          >
            Reset
          </button>
        </div>

        {/* SQL Preview */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">SQL Preview:</span>
          </div>
          <code className="text-xs text-gray-600 block font-mono">
            SELECT * FROM FusionAll WHERE {filter.minMeV ? `MeV >= ${filter.minMeV}` : '1=1'}
            {filter.maxMeV ? ` AND MeV <= ${filter.maxMeV}` : ''}
            {` ORDER BY MeV ${filter.orderDirection?.toUpperCase()} LIMIT ${filter.limit || 100}`}
          </code>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-6">
          {/* Results Table */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Results: {results.length} reactions found
              </h2>
              <button
                onClick={exportToCSV}
                className="btn btn-secondary px-4 py-2 text-sm"
                disabled={results.length === 0}
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Export CSV
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Input</th>
                    <th>Z1</th>
                    <th>A1</th>
                    <th>Output</th>
                    <th>Z</th>
                    <th>A</th>
                    <th>Energy (MeV)</th>
                    <th>Neutrino</th>
                    <th>nBorF1</th>
                    <th>aBorF1</th>
                    <th>nBorF</th>
                    <th>aBorF</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((reaction, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold">{reaction.E1}</td>
                      <td>{reaction.Z1}</td>
                      <td>{reaction.A1}</td>
                      <td className="font-semibold">{reaction.E}</td>
                      <td>{reaction.Z}</td>
                      <td>{reaction.A}</td>
                      <td className="text-green-600 font-semibold">{reaction.MeV.toFixed(2)}</td>
                      <td>{reaction.neutrino}</td>
                      <td>{reaction.nBorF1}</td>
                      <td>{reaction.aBorF1}</td>
                      <td>{reaction.nBorF}</td>
                      <td>{reaction.aBorF}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nuclides Summary */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuclides Appearing in Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Array.from(new Set(results.flatMap(r => [r.E1, r.E]))).sort().map(el => (
                <div key={el} className="px-3 py-2 bg-gray-50 rounded text-sm font-medium text-gray-700">
                  {el}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
