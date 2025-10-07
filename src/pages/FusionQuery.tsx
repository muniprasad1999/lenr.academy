import { useState, useEffect } from 'react'
import { Search, Download, Info, Loader2, AlertCircle } from 'lucide-react'
import type { FusionReaction, QueryFilter, Nuclide, Element } from '../types'
import { useDatabase } from '../contexts/DatabaseContext'
import { queryFusion, getAllElements } from '../services/queryService'
import PeriodicTableSelector from '../components/PeriodicTableSelector'

export default function FusionQuery() {
  const { db, isLoading: dbLoading, error: dbError } = useDatabase()
  const [elements, setElements] = useState<Element[]>([])

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
  const [nuclides, setNuclides] = useState<Nuclide[]>([])
  const [resultElements, setResultElements] = useState<Element[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedElement1, setSelectedElement1] = useState<string[]>([])
  const [selectedElement2, setSelectedElement2] = useState<string[]>([])
  const [selectedOutputElement, setSelectedOutputElement] = useState<string[]>([])
  const [isQuerying, setIsQuerying] = useState(false)
  const [executionTime, setExecutionTime] = useState(0)

  // Load elements when database is ready
  useEffect(() => {
    if (db) {
      const allElements = getAllElements(db)
      setElements(allElements)
    }
  }, [db])

  // Auto-execute query when filters change
  useEffect(() => {
    if (db) {
      handleQuery()
    }
  }, [db, selectedElement1, selectedElement2, selectedOutputElement, filter.minMeV, filter.maxMeV, filter.neutrinoTypes, filter.limit])

  const handleQuery = () => {
    if (!db) return

    setIsQuerying(true)

    try {
      // Build filter with selected elements
      const queryFilter: QueryFilter = {
        ...filter,
        element1List: selectedElement1.length > 0 ? selectedElement1 : undefined,
        element2List: selectedElement2.length > 0 ? selectedElement2 : undefined,
        outputElementList: selectedOutputElement.length > 0 ? selectedOutputElement : undefined
      }

      const result = queryFusion(db, queryFilter)

      setResults(result.reactions)
      setNuclides(result.nuclides)
      setResultElements(result.elements)
      setExecutionTime(result.executionTime)
      setShowResults(true)
    } catch (error) {
      console.error('Query failed:', error)
      alert(`Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsQuerying(false)
    }
  }

  const exportToCSV = () => {
    if (results.length === 0) return

    const headers = ['E1', 'Z1', 'A1', 'E2', 'Z2', 'A2', 'E', 'Z', 'A', 'MeV', 'neutrino', 'nBorF1', 'aBorF1', 'nBorF2', 'aBorF2', 'nBorF', 'aBorF']
    const csvContent = [
      headers.join(','),
      ...results.map(r => [
        r.E1, r.Z1, r.A1, r.E2, r.Z2, r.A2, r.E, r.Z, r.A, r.MeV, r.neutrino, r.nBorF1, r.aBorF1, r.nBorF2, r.aBorF2, r.nBorF, r.aBorF
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fusion_reactions_${Date.now()}.csv`
    a.click()
  }

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading database...</p>
        </div>
      </div>
    )
  }

  if (dbError) {
    return (
      <div className="card p-6 bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-1">Database Error</h3>
            <p className="text-red-700">{dbError.message}</p>
          </div>
        </div>
      </div>
    )
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

        <div className="grid md:grid-cols-3 gap-6">
          {/* Input Element 1 Selection (E1) */}
          <PeriodicTableSelector
            label="Input Element 1 (E1)"
            availableElements={elements}
            selectedElements={selectedElement1}
            onSelectionChange={setSelectedElement1}
          />

          {/* Input Element 2 Selection (E2) */}
          <PeriodicTableSelector
            label="Input Element 2 (E2)"
            availableElements={elements}
            selectedElements={selectedElement2}
            onSelectionChange={setSelectedElement2}
          />

          {/* Output Element Selection (E) */}
          <PeriodicTableSelector
            label="Output Element (E)"
            availableElements={elements}
            selectedElements={selectedOutputElement}
            onSelectionChange={setSelectedOutputElement}
          />

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
            onClick={() => {
              setFilter({
                elements: [],
                minMeV: undefined,
                maxMeV: undefined,
                neutrinoTypes: ['none', 'left', 'right'],
                limit: 100,
                orderBy: 'MeV',
                orderDirection: 'desc'
              })
              setSelectedElement1([])
              setSelectedElement2([])
              setSelectedOutputElement([])
            }}
            className="btn btn-secondary px-6 py-2"
          >
            Reset Filters
          </button>
          {isQuerying && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Querying...</span>
            </div>
          )}
        </div>

        {/* SQL Preview */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">SQL Preview:</span>
          </div>
          <code className="text-xs text-gray-600 block font-mono whitespace-pre-wrap">
            SELECT * FROM FusionAll
            {(selectedElement1.length > 0 || selectedElement2.length > 0 || selectedOutputElement.length > 0 || filter.minMeV !== undefined || filter.maxMeV !== undefined) && ' WHERE '}
            {selectedElement1.length > 0 && `E1 IN (${selectedElement1.map(e => `'${e}'`).join(', ')})`}
            {selectedElement1.length > 0 && (selectedElement2.length > 0 || selectedOutputElement.length > 0) && ' AND '}
            {selectedElement2.length > 0 && `E2 IN (${selectedElement2.map(e => `'${e}'`).join(', ')})`}
            {selectedElement2.length > 0 && selectedOutputElement.length > 0 && ' AND '}
            {selectedOutputElement.length > 0 && `E IN (${selectedOutputElement.map(e => `'${e}'`).join(', ')})`}
            {(selectedElement1.length > 0 || selectedElement2.length > 0 || selectedOutputElement.length > 0) && filter.minMeV !== undefined && ' AND '}
            {filter.minMeV !== undefined && `MeV >= ${filter.minMeV}`}
            {filter.maxMeV !== undefined && ` AND MeV <= ${filter.maxMeV}`}
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
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Results: {results.length} reactions found
                </h2>
                <p className="text-sm text-gray-500">Query executed in {executionTime.toFixed(2)}ms</p>
              </div>
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
                    <th colSpan={6} className="bg-blue-50">Inputs</th>
                    <th colSpan={3} className="bg-green-50">Output</th>
                    <th rowSpan={2}>Energy (MeV)</th>
                    <th rowSpan={2}>Neutrino</th>
                    <th colSpan={4} className="bg-gray-50">Boson/Fermion</th>
                  </tr>
                  <tr>
                    <th>E1</th>
                    <th>Z1</th>
                    <th>A1</th>
                    <th>E2</th>
                    <th>Z2</th>
                    <th>A2</th>
                    <th>E</th>
                    <th>Z</th>
                    <th>A</th>
                    <th>nBorF1</th>
                    <th>aBorF1</th>
                    <th>nBorF</th>
                    <th>aBorF</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((reaction, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold bg-blue-50">{reaction.E1}</td>
                      <td className="bg-blue-50">{reaction.Z1}</td>
                      <td className="bg-blue-50">{reaction.A1}</td>
                      <td className="font-semibold bg-blue-50">{reaction.E2}</td>
                      <td className="bg-blue-50">{reaction.Z2}</td>
                      <td className="bg-blue-50">{reaction.A2}</td>
                      <td className="font-semibold bg-green-50">{reaction.E}</td>
                      <td className="bg-green-50">{reaction.Z}</td>
                      <td className="bg-green-50">{reaction.A}</td>
                      <td className="text-green-600 font-semibold">{reaction.MeV.toFixed(2)}</td>
                      <td><span className="px-2 py-1 bg-gray-100 rounded text-xs">{reaction.neutrino}</span></td>
                      <td className="bg-gray-50">{reaction.nBorF1}</td>
                      <td className="bg-gray-50">{reaction.aBorF1}</td>
                      <td className="bg-gray-50">{reaction.nBorF}</td>
                      <td className="bg-gray-50">{reaction.aBorF}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nuclides Summary */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nuclides Appearing in Results ({nuclides.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {nuclides.map(nuc => (
                <div key={nuc.id} className="px-3 py-2 bg-gray-50 rounded border border-gray-200">
                  <div className="font-semibold text-sm text-gray-900">{nuc.E}-{nuc.A}</div>
                  <div className="text-xs text-gray-500">Z={nuc.Z}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Elements Summary */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Elements Appearing in Results ({resultElements.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {resultElements.map(el => (
                <div key={el.Z} className="px-3 py-2 bg-blue-50 rounded border border-blue-200">
                  <div className="font-bold text-lg text-blue-900">{el.E}</div>
                  <div className="text-xs text-blue-700">{el.EName}</div>
                  <div className="text-xs text-blue-600">Z={el.Z}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
