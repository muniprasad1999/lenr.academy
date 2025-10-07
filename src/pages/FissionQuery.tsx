import { useState, useEffect } from 'react'
import { Search, Download, Info, Loader } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import type { FissionReaction, QueryFilter, Element, Nuclide } from '../types'
import { useDatabase } from '../contexts/DatabaseContext'
import { queryFission, getAllElements } from '../services/queryService'
import PeriodicTableSelector from '../components/PeriodicTableSelector'

// Default values
const DEFAULT_ELEMENT: string[] = ['Zr']
const DEFAULT_NEUTRINO_TYPES = ['none', 'left', 'right']
const DEFAULT_LIMIT = 100

export default function FissionQuery() {
  const { db, isLoading: dbLoading, error: dbError } = useDatabase()
  const [searchParams, setSearchParams] = useSearchParams()
  const [availableElements, setAvailableElements] = useState<Element[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Parse URL parameters or use defaults
  const getInitialElement = () => {
    const param = searchParams.get('e')
    return param ? param.split(',') : DEFAULT_ELEMENT
  }

  const getInitialMinMeV = () => {
    const param = searchParams.get('minMeV')
    return param ? parseFloat(param) : undefined
  }

  const getInitialMaxMeV = () => {
    const param = searchParams.get('maxMeV')
    return param ? parseFloat(param) : undefined
  }

  const getInitialNeutrinoTypes = () => {
    const param = searchParams.get('neutrino')
    return param ? param.split(',') : DEFAULT_NEUTRINO_TYPES
  }

  const getInitialLimit = () => {
    const param = searchParams.get('limit')
    return param ? parseInt(param) : DEFAULT_LIMIT
  }

  const [filter, setFilter] = useState<QueryFilter>({
    elements: [],
    minMeV: getInitialMinMeV(),
    maxMeV: getInitialMaxMeV(),
    neutrinoTypes: getInitialNeutrinoTypes() as any[],
    limit: getInitialLimit(),
    orderBy: 'MeV',
    orderDirection: 'desc'
  })

  const [results, setResults] = useState<FissionReaction[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedElement, setSelectedElement] = useState<string[]>(getInitialElement())
  const [elements, setElements] = useState<Element[]>([])
  const [nuclides, setNuclides] = useState<Nuclide[]>([])
  const [queryTime, setQueryTime] = useState<number>(0)
  const [totalCount, setTotalCount] = useState(0)
  const [isQuerying, setIsQuerying] = useState(false)

  // Load elements when database is ready
  useEffect(() => {
    if (db) {
      const allElements = getAllElements(db)
      setAvailableElements(allElements)
      setIsInitialized(true)
    }
  }, [db])

  // Update URL when filters change
  useEffect(() => {
    if (!isInitialized) return

    const params = new URLSearchParams()

    if (selectedElement.length > 0) {
      params.set('e', selectedElement.join(','))
    }

    if (filter.minMeV !== undefined) {
      params.set('minMeV', filter.minMeV.toString())
    }

    if (filter.maxMeV !== undefined) {
      params.set('maxMeV', filter.maxMeV.toString())
    }

    if (JSON.stringify(filter.neutrinoTypes) !== JSON.stringify(DEFAULT_NEUTRINO_TYPES)) {
      params.set('neutrino', filter.neutrinoTypes?.join(',') || '')
    }

    if (filter.limit !== DEFAULT_LIMIT) {
      params.set('limit', filter.limit?.toString() || DEFAULT_LIMIT.toString())
    }

    setSearchParams(params, { replace: true })
  }, [selectedElement, filter.minMeV, filter.maxMeV, filter.neutrinoTypes, filter.limit, isInitialized])

  // Auto-execute query when filters change
  useEffect(() => {
    if (db) {
      handleQuery()
    }
  }, [db, selectedElement, filter.minMeV, filter.maxMeV, filter.neutrinoTypes, filter.limit])

  const handleQuery = () => {
    if (!db) return

    setIsQuerying(true)
    try {
      // Build filter with selected elements
      const queryFilter: QueryFilter = {
        ...filter,
        elements: selectedElement.length > 0 ? selectedElement : undefined
      }

      const result = queryFission(db, queryFilter)

      setResults(result.reactions)
      setElements(result.elements)
      setNuclides(result.nuclides)
      setQueryTime(result.executionTime)
      setTotalCount(result.totalCount)
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

    const headers = ['E', 'Z', 'A', 'E1', 'Z1', 'A1', 'E2', 'Z2', 'A2', 'MeV', 'neutrino']
    const csvContent = [
      headers.join(','),
      ...results.map(r => [
        r.E, r.Z, r.A, r.E1, r.Z1, r.A1, r.E2, r.Z2, r.A2, r.MeV, r.neutrino
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fission_reactions_${new Date().toISOString().split('T')[0]}.csv`
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fission Reactions</h1>
        <p className="text-gray-600 dark:text-gray-400">Query exothermic fission reactions where heavy nuclei split into lighter products</p>
      </div>

      {/* Query Builder */}
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Query Parameters</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Element Selection (E) */}
          <PeriodicTableSelector
            label="Input Element (E)"
            availableElements={availableElements}
            selectedElements={selectedElement}
            onSelectionChange={setSelectedElement}
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
                neutrinoTypes: DEFAULT_NEUTRINO_TYPES as any[],
                limit: DEFAULT_LIMIT,
                orderBy: 'MeV',
                orderDirection: 'desc'
              })
              setSelectedElement(DEFAULT_ELEMENT)
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
            SELECT * FROM FissionAll
            {(selectedElement.length > 0 || filter.minMeV !== undefined || filter.maxMeV !== undefined) && ' WHERE '}
            {selectedElement.length > 0 && `E IN (${selectedElement.map(e => `'${e}'`).join(', ')})`}
            {selectedElement.length > 0 && filter.minMeV !== undefined && ' AND '}
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
                  {results.length === totalCount
                    ? `Showing all ${totalCount.toLocaleString()} matching reactions`
                    : `Showing ${results.length.toLocaleString()} of ${totalCount.toLocaleString()} matching reactions`
                  }
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Query executed in {queryTime.toFixed(2)}ms
                  {results.length < totalCount && (
                    <span className="ml-2">• Increase limit to see more results</span>
                  )}
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
                    <th colSpan={3} className="bg-blue-50 dark:bg-blue-900/30">Input</th>
                    <th colSpan={6} className="bg-green-50 dark:bg-green-900/30">Outputs</th>
                    <th rowSpan={2}>Energy<br/>(MeV)</th>
                    <th rowSpan={2}>Neutrino</th>
                  </tr>
                  <tr>
                    <th>Element</th>
                    <th>Z</th>
                    <th>A</th>
                    <th>Element</th>
                    <th>Z</th>
                    <th>A</th>
                    <th>Element</th>
                    <th>Z</th>
                    <th>A</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((reaction, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold bg-blue-50 dark:bg-blue-900/30">{reaction.E}</td>
                      <td className="bg-blue-50 dark:bg-blue-900/30">{reaction.Z}</td>
                      <td className="bg-blue-50 dark:bg-blue-900/30">{reaction.A}</td>
                      <td className="font-semibold bg-green-50 dark:bg-green-900/30">{reaction.E1}</td>
                      <td className="bg-green-50 dark:bg-green-900/30">{reaction.Z1}</td>
                      <td className="bg-green-50 dark:bg-green-900/30">{reaction.A1}</td>
                      <td className="font-semibold bg-green-50 dark:bg-green-900/30">{reaction.E2}</td>
                      <td className="bg-green-50 dark:bg-green-900/30">{reaction.Z2}</td>
                      <td className="bg-green-50 dark:bg-green-900/30">{reaction.A2}</td>
                      <td className="text-green-600 font-semibold">{reaction.MeV.toFixed(2)}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reaction.neutrino === 'none' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                          reaction.neutrino === 'left' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                          'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        }`}>
                          {reaction.neutrino === 'none' ? 'None' :
                           reaction.neutrino === 'left' ? 'Left' : 'Right'}
                        </span>
                      </td>
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
