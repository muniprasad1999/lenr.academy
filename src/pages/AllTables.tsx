import { useState } from 'react'
import { Play, BookOpen } from 'lucide-react'

export default function AllTables() {
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM FusionAll WHERE MeV > 10 ORDER BY MeV DESC LIMIT 100')

  const exampleQueries = [
    'SELECT * FROM NuclidesPlus ORDER BY Z, A',
    'SELECT * FROM ElementsPlus WHERE Melting > 1000',
    'SELECT * FROM FusionAll WHERE E1 = "H" AND MeV > 20 LIMIT 50',
    'SELECT * FROM TwoToTwoAll WHERE E1 IN ("H","D") AND E2 = "Ni" ORDER BY MeV DESC',
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Tables Query Tool</h1>
        <p className="text-gray-600">Execute custom SQL queries across all reaction and property tables</p>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">SQL Query Editor</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter SQL Query
          </label>
          <textarea
            className="input font-mono text-sm"
            rows={6}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="SELECT * FROM TableName WHERE ..."
          />
        </div>

        <div className="flex gap-3">
          <button className="btn btn-primary px-6 py-2">
            <Play className="w-4 h-4 mr-2 inline" />
            Execute Query
          </button>
          <button
            onClick={() => setSqlQuery('')}
            className="btn btn-secondary px-6 py-2"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Example Queries</h3>
        </div>
        <div className="space-y-2">
          {exampleQueries.map((query, idx) => (
            <button
              key={idx}
              onClick={() => setSqlQuery(query)}
              className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded text-sm font-mono text-gray-700"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-6 bg-yellow-50">
        <h3 className="font-semibold text-gray-900 mb-2">SQL Tips</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Use <code className="bg-white px-1 rounded">IN</code> clause for OR conditions: <code className="bg-white px-1 rounded">E IN ('H','D','Li')</code></li>
          <li>Always include <code className="bg-white px-1 rounded">LIMIT</code> to prevent large result sets (max 1000)</li>
          <li>Available tables: FusionAll, FissionAll, TwoToTwoAll, NuclidesPlus, ElementsPlus</li>
          <li>Common fields: E (element), Z (atomic number), A (mass number), MeV (energy)</li>
        </ul>
      </div>
    </div>
  )
}
