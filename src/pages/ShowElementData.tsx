import { useState } from 'react'
import { Loader } from 'lucide-react'
import { useDatabase } from '../contexts/DatabaseContext'
import type { Element } from '../types'

export default function ShowElementData() {
  const { db, isLoading: dbLoading, error: dbError } = useDatabase()
  const [selectedElement, setSelectedElement] = useState<string>('')

  // Get all elements from database
  const allElements: Element[] = db ? (() => {
    const result = db.exec('SELECT * FROM ElementsPlus ORDER BY Z')
    if (result.length === 0) return []
    const columns = result[0].columns
    return result[0].values.map(row => {
      const element: any = {}
      columns.forEach((col, idx) => {
        element[col] = row[idx]
      })
      return element as Element
    })
  })() : []

  const element = allElements.find(el => el.E === selectedElement)

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Loading database...</span>
      </div>
    )
  }

  if (dbError) {
    return (
      <div className="card p-6 border-red-200 bg-red-50">
        <h2 className="text-xl font-semibold text-red-900 mb-2">Database Error</h2>
        <p className="text-red-700">{dbError.message}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Show Element Data</h1>
        <p className="text-gray-600">View detailed chemical and physical properties for any element</p>
      </div>

      <div className="card p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{element.EName} ({element.E})</h2>
            <p className="text-sm text-gray-500 mb-4">Atomic Number: {element.Z}</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Periodic Table</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Atomic Number (Z):</dt>
                    <dd className="font-medium">{element.Z}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Period:</dt>
                    <dd className="font-medium">{element.Period}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Group:</dt>
                    <dd className="font-medium">{element.Group}</dd>
                  </div>
                  {element.AWeight && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Atomic Weight:</dt>
                      <dd className="font-medium">{element.AWeight.toFixed(3)}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Atomic Properties</h3>
                <dl className="space-y-2 text-sm">
                  {element.ARadius && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Atomic Radius:</dt>
                      <dd className="font-medium">{element.ARadius} pm</dd>
                    </div>
                  )}
                  {element.Valence !== null && element.Valence !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Valence:</dt>
                      <dd className="font-medium">{element.Valence}</dd>
                    </div>
                  )}
                  {element.Negativity && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Electronegativity:</dt>
                      <dd className="font-medium">{element.Negativity}</dd>
                    </div>
                  )}
                  {element.Affinity && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Electron Affinity:</dt>
                      <dd className="font-medium">{element.Affinity} kJ/mol</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Ionization</h3>
                <dl className="space-y-2 text-sm">
                  {element.MaxIonNum !== null && element.MaxIonNum !== undefined && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Max Ion Number:</dt>
                      <dd className="font-medium">{element.MaxIonNum}</dd>
                    </div>
                  )}
                  {element.MaxIonization && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Max Ionization:</dt>
                      <dd className="font-medium">{element.MaxIonization.toFixed(1)} kJ/mol</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Thermal Properties</h3>
              <dl className="space-y-2 text-sm">
                {element.Melting && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Melting Point:</dt>
                    <dd className="font-medium">{element.Melting.toFixed(2)} K</dd>
                  </div>
                )}
                {element.Boiling && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Boiling Point:</dt>
                    <dd className="font-medium">{element.Boiling.toFixed(2)} K</dd>
                  </div>
                )}
                {element.SpecHeat && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Specific Heat:</dt>
                    <dd className="font-medium">{element.SpecHeat.toFixed(2)} J/(g·K)</dd>
                  </div>
                )}
                {element.ThermConduct && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Thermal Conductivity:</dt>
                    <dd className="font-medium">{element.ThermConduct.toFixed(2)} W/(m·K)</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Physical Properties</h3>
              <dl className="space-y-2 text-sm">
                {element.STPDensity && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Density (STP):</dt>
                    <dd className="font-medium">{element.STPDensity.toFixed(3)} g/cm³</dd>
                  </div>
                )}
                {element.MolarVolume && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Molar Volume:</dt>
                    <dd className="font-medium">{element.MolarVolume.toFixed(2)} cm³/mol</dd>
                  </div>
                )}
                {element.ElectConduct && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Electrical Conductivity:</dt>
                    <dd className="font-medium">{element.ElectConduct.toFixed(2)} MS/m</dd>
                  </div>
                )}
                {element.MagType && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Magnetic Type:</dt>
                    <dd className="font-medium">{element.MagType}</dd>
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
