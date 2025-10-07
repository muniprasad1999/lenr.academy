import { useState } from 'react'
import { Loader } from 'lucide-react'
import { useDatabase } from '../contexts/DatabaseContext'
import type { Element } from '../types'

export default function ShowElementData() {
  const { db, isLoading: dbLoading, error: dbError } = useDatabase()
  const [selectedElement, setSelectedElement] = useState<string>('')

  // Get all elements from database
  const allElements: Element[] = db ? (() => {
    const result = db.exec('SELECT * FROM ElementPropertiesPlus ORDER BY Z')
    if (result.length === 0) return []

    // Column name mapping from database to TypeScript interface
    const columnMap: { [key: string]: string } = {
      'P': 'Period',
      'G': 'Group',
      'MolarVol': 'MolarVolume',
      'Val': 'Valence',
      'MxInum': 'MaxIonNum',
      'MxInize': 'MaxIonization',
      'ElectG': 'ElectConduct',
      'ThermG': 'ThermConduct'
    }

    const columns = result[0].columns
    return result[0].values.map(row => {
      const element: any = {}
      columns.forEach((col, idx) => {
        // Map database column names to TypeScript interface property names
        const propertyName = columnMap[col] || col
        element[propertyName] = row[idx]
      })
      return element as Element
    })
  })() : []

  const element = allElements.find(el => el.E === selectedElement)

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Show Element Data</h1>
        <p className="text-gray-600 dark:text-gray-400">View detailed chemical and physical properties for any element</p>
      </div>

      <div className="card p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Element
        </label>
        <select
          className="input max-w-md"
          value={selectedElement}
          onChange={(e) => setSelectedElement(e.target.value)}
        >
          <option value="">Choose an element...</option>
          {allElements.map(el => (
            <option key={el.Z} value={el.E}>
              {el.Z} - {el.E} ({el.EName})
            </option>
          ))}
        </select>
      </div>

      {element && (
        <div className="space-y-6 mt-6">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{element.EName} ({element.E})</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Atomic Number: {element.Z}</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Periodic Table</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Atomic Number (Z):</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{element.Z}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Period:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{element.Period}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Group:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{element.Group}</dd>
                  </div>
                  {element.AWeight !== null && element.AWeight !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Atomic Weight:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{element.AWeight.toFixed(3)}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Atomic Properties</h3>
                <dl className="space-y-2 text-sm">
                  {element.ARadius !== null && element.ARadius !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Atomic Radius:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{element.ARadius} pm</dd>
                    </div>
                  )}
                  {element.Valence !== null && element.Valence !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Valence:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{element.Valence}</dd>
                    </div>
                  )}
                  {element.Negativity !== null && element.Negativity !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Electronegativity:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{element.Negativity}</dd>
                    </div>
                  )}
                  {element.Affinity !== null && element.Affinity !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Electron Affinity:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{element.Affinity} kJ/mol</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Ionization</h3>
                <dl className="space-y-2 text-sm">
                  {element.MaxIonNum !== null && element.MaxIonNum !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Max Ion Number:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{element.MaxIonNum}</dd>
                    </div>
                  )}
                  {element.MaxIonization !== null && element.MaxIonization !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600 dark:text-gray-400">Max Ionization:</dt>
                      <dd className="font-medium text-gray-900 dark:text-gray-100">{element.MaxIonization.toFixed(1)} kJ/mol</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Thermal Properties</h3>
              <dl className="space-y-2 text-sm">
                {element.Melting !== null && element.Melting !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Melting Point:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{element.Melting.toFixed(2)} K</dd>
                  </div>
                )}
                {element.Boiling !== null && element.Boiling !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Boiling Point:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{element.Boiling.toFixed(2)} K</dd>
                  </div>
                )}
                {element.SpecHeat !== null && element.SpecHeat !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Specific Heat:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{element.SpecHeat.toFixed(2)} J/(g·K)</dd>
                  </div>
                )}
                {element.ThermConduct !== null && element.ThermConduct !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Thermal Conductivity:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{element.ThermConduct.toFixed(2)} W/(m·K)</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">Physical Properties</h3>
              <dl className="space-y-2 text-sm">
                {element.STPDensity !== null && element.STPDensity !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Density (STP):</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{element.STPDensity.toFixed(3)} g/cm³</dd>
                  </div>
                )}
                {element.MolarVolume !== null && element.MolarVolume !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Molar Volume:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{element.MolarVolume.toFixed(2)} cm³/mol</dd>
                  </div>
                )}
                {element.ElectConduct !== null && element.ElectConduct !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Electrical Conductivity:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{element.ElectConduct.toFixed(2)} MS/m</dd>
                  </div>
                )}
                {element.MagType && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">Magnetic Type:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{element.MagType}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
