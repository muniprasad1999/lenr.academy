import { useState, useEffect } from 'react'
import { Search, Download, Info, Loader } from 'lucide-react'
import type { TwoToTwoReaction, QueryFilter, Element, Nuclide } from '../types'
import { useDatabase } from '../contexts/DatabaseContext'
import { queryTwoToTwo, getAllElements } from '../services/queryService'
import PeriodicTableSelector from '../components/PeriodicTableSelector'

export default function TwoToTwoQuery() {
  const { db, isLoading: dbLoading, error: dbError } = useDatabase()
  const [availableElements, setAvailableElements] = useState<Element[]>([])

  const [filter, setFilter] = useState<QueryFilter>({
    elements: [],
    minMeV: undefined,
    maxMeV: undefined,
    neutrinoTypes: ['none', 'left', 'right'],
    limit: 100,
    orderBy: 'MeV',
    orderDirection: 'desc'
  })

  const [results, setResults] = useState<TwoToTwoReaction[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedElement1, setSelectedElement1] = useState<string[]>([])
  const [selectedElement2, setSelectedElement2] = useState<string[]>([])
  const [elements, setElements] = useState<Element[]>([])
  const [nuclides, setNuclides] = useState<Nuclide[]>([])
  const [queryTime, setQueryTime] = useState<number>(0)
  const [isQuerying, setIsQuerying] = useState(false)

  // Load elements when database is ready
  useEffect(() => {
    if (db) {
      const allElements = getAllElements(db)
      setAvailableElements(allElements)
    }
  }, [db])

  // Auto-execute query when filters change
  useEffect(() => {
    if (db) {
      handleQuery()
    }
  }, [db, selectedElement1, selectedElement2, filter.minMeV, filter.maxMeV, filter.neutrinoTypes, filter.limit])

  const handleQuery = () => {
    if (!db) return

    setIsQuerying(true)
    try {
      // Build filter with selected elements
      const allSelectedElements = [...selectedElement1, ...selectedElement2]
      const queryFilter: QueryFilter = {
        ...filter,
        elements: allSelectedElements.length > 0 ? allSelectedElements : undefined,
        element1List: selectedElement1.length > 0 ? selectedElement1 : undefined,
        element2List: selectedElement2.length > 0 ? selectedElement2 : undefined
      }

      const result = queryTwoToTwo(db, queryFilter)

      setResults(result.reactions)
      setElements(result.elements)
      setNuclides(result.nuclides)
      setQueryTime(result.executionTime)
      setShowResults(true)
    } catch (error) {
      console.error('Query failed:', error)
      alert('Query failed: ' + (error as Error).message)
    } finally {
      setIsQuerying(false)
    }
  }

  const exportToCSV = () => {
    if (results.length === 0) return

    const headers = ['E1', 'Z1', 'A1', 'E2', 'Z2', 'A2', 'E3', 'Z3', 'A3', 'E4', 'Z4', 'A4', 'MeV', 'neutrino']
    const csvContent = [
      headers.join(','),
      ...results.map(r => [
        r.E1, r.Z1, r.A1, r.E2, r.Z2, r.A2, r.E3, r.Z3, r.A3, r.E4, r.Z4, r.A4, r.MeV, r.neutrino
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `twotwo_reactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading database...</span>
      </div>
    )
  }

  if (dbError) {
    return (
      <div className="card p-6 border-red-200 bg-red-50 dark:bg-red-900/20">
        <h2 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-2">Database Error</h2>
        <p className="text-red-700 dark:text-red-300">{dbError.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Two-To-Two Reactions</h1>
        <p className="text-gray-600 dark:text-gray-400">Query 2-2 transmutation reactions where two input nuclei transform into two different output nuclei</p>
      </div>

      {/* Query Builder */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Query Parameters</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Element 1 Selection (E1) */}
          <PeriodicTableSelector
            label="Input Element 1 (E1)"
            availableElements={availableElements}
            selectedElements={selectedElement1}
            onSelectionChange={setSelectedElement1}
          />

          {/* Input Element 2 Selection (E2) */}
          <PeriodicTableSelector
            label="Input Element 2 (E2)"
            availableElements={availableElements}
            selectedElements={selectedElement2}
            onSelectionChange={setSelectedElement2}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Result Limit
            </label>
            <input
              type="number"
              className="input"
              value={filter.limit || 100}
              onChange={(e) => setFilter({...filter, limit: parseInt(e.target.value) || 100})}
              max={1000}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum 1000 rows</p>
          </div>
        </div>

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
            }}
            className="btn btn-secondary px-6 py-2"
          >
            Reset Filters
          </button>
          {isQuerying && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Querying...</span>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SQL Preview:</span>
          </div>
          <code className="text-xs text-gray-600 dark:text-gray-400 block font-mono whitespace-pre-wrap">
            SELECT * FROM TwoToTwoAll
            {(selectedElement1.length > 0 || selectedElement2.length > 0 || filter.minMeV !== undefined || filter.maxMeV !== undefined) && ' WHERE '}
            {selectedElement1.length > 0 && `E1 IN (${selectedElement1.map(e => `'${e}'`).join(', ')})`}
            {selectedElement1.length > 0 && selectedElement2.length > 0 && ' AND '}
            {selectedElement2.length > 0 && `E2 IN (${selectedElement2.map(e => `'${e}'`).join(', ')})`}
            {(selectedElement1.length > 0 || selectedElement2.length > 0) && filter.minMeV !== undefined && ' AND '}
            {filter.minMeV !== undefined && `MeV >= ${filter.minMeV}`}
            {filter.maxMeV !== undefined && ` AND MeV <= ${filter.maxMeV}`}
            {` ORDER BY MeV ${filter.orderDirection?.toUpperCase()} LIMIT ${filter.limit || 100}`}
          </code>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Results: {results.length} reactions found
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Query executed in {queryTime.toFixed(2)}ms
                </p>
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
                    <th colSpan={6} className="bg-blue-50 dark:bg-blue-900/30">Inputs</th>
                    <th colSpan={6} className="bg-green-50 dark:bg-green-900/30">Outputs</th>
                    <th rowSpan={2}>Energy (MeV)</th>
                    <th rowSpan={2}>Neutrino</th>
                  </tr>
                  <tr>
                    <th>E1</th>
                    <th>Z1</th>
                    <th>A1</th>
                    <th>E2</th>
                    <th>Z2</th>
                    <th>A2</th>
                    <th>E3</th>
                    <th>Z3</th>
                    <th>A3</th>
                    <th>E4</th>
                    <th>Z4</th>
                    <th>A4</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((reaction, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold bg-blue-50 dark:bg-blue-900/30">{reaction.E1}</td>
                      <td className="bg-blue-50 dark:bg-blue-900/30">{reaction.Z1}</td>
                      <td className="bg-blue-50 dark:bg-blue-900/30">{reaction.A1}</td>
                      <td className="font-semibold bg-blue-50 dark:bg-blue-900/30">{reaction.E2}</td>
                      <td className="bg-blue-50 dark:bg-blue-900/30">{reaction.Z2}</td>
                      <td className="bg-blue-50 dark:bg-blue-900/30">{reaction.A2}</td>
                      <td className="font-semibold bg-green-50 dark:bg-green-900/30">{reaction.E3}</td>
                      <td className="bg-green-50 dark:bg-green-900/30">{reaction.Z3}</td>
                      <td className="bg-green-50 dark:bg-green-900/30">{reaction.A3}</td>
                      <td className="font-semibold bg-green-50 dark:bg-green-900/30">{reaction.E4}</td>
                      <td className="bg-green-50 dark:bg-green-900/30">{reaction.Z4}</td>
                      <td className="bg-green-50 dark:bg-green-900/30">{reaction.A4}</td>
                      <td className="text-green-600 font-semibold">{reaction.MeV.toFixed(2)}</td>
                      <td>{reaction.neutrino}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Nuclides in Results ({nuclides.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {nuclides.map((nuc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{nuc.E}<sup>{nuc.A}</sup></span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Z={nuc.Z}, A={nuc.A}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Elements in Results ({elements.length})
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {elements.map((el) => (
                  <div key={el.Z} className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{el.E}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{el.EName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
