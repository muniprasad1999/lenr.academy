import { useState } from 'react'
import { mockElements } from '../services/mockData'

export default function ShowElementData() {
  const [selectedElement, setSelectedElement] = useState<string>('')
  const element = mockElements.find(el => el.E === selectedElement)

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
          {mockElements.map(el => (
            <option key={el.Z} value={el.E}>
              {el.Z} - {el.E} ({el.EName})
            </option>
          ))}
        </select>
      </div>

      {element && (
        <div className="card p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{element.EName} ({element.E})</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Basic Properties</h3>
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
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Physical Properties</h3>
              <dl className="space-y-2 text-sm">
                {element.Melting && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Melting Point:</dt>
                    <dd className="font-medium">{element.Melting} K</dd>
                  </div>
                )}
                {element.Boiling && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Boiling Point:</dt>
                    <dd className="font-medium">{element.Boiling} K</dd>
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
