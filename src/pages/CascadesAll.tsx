import { useState } from 'react'
import { Play, Settings, AlertCircle } from 'lucide-react'

export default function CascadesAll() {
  const [params, setParams] = useState({
    temperature: 2400,
    minFusionMeV: 1.0,
    minTwoToTwoMeV: 1.0,
    maxNuclides: 50,
    maxLoops: 2,
    feedbackBosons: true,
    feedbackFermions: true,
    allowDimers: true,
    excludeMelted: false,
    excludeBoiledOff: false,
  })

  const [fuelNuclides, setFuelNuclides] = useState('H1, Li7, Al27, N14, Ni58, Ni60, Ni62, B10, B11')

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Cascade Simulations</h1>
        <p className="text-gray-600 dark:text-gray-400">Model cascading chain reactions from initial fuel nuclides</p>
      </div>

      <div className="card p-6 mb-6 bg-orange-50 dark:bg-orange-900/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Note:</strong> Cascade simulations are computationally intensive.
            Start with conservative settings (max 50 nuclides, 2-3 loops) to prevent timeouts.
            Processing time typically ranges from 30 seconds to 15 minutes depending on parameters.
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Fuel Nuclides</h2>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Enter fuel nuclides (comma-separated)
        </label>
        <textarea
          className="input"
          rows={3}
          value={fuelNuclides}
          onChange={(e) => setFuelNuclides(e.target.value)}
          placeholder="e.g., H1, D2, Li7, Ni58"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Format: ElementSymbol + MassNumber (e.g., H1 for protium, D2 for deuterium)
        </p>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cascade Parameters</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Temperature (K)
            </label>
            <input
              type="number"
              className="input"
              value={params.temperature}
              onChange={(e) => setParams({...params, temperature: parseInt(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Fusion Energy (MeV)
            </label>
            <input
              type="number"
              step="0.1"
              className="input"
              value={params.minFusionMeV}
              onChange={(e) => setParams({...params, minFusionMeV: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum 2-2 Energy (MeV)
            </label>
            <input
              type="number"
              step="0.1"
              className="input"
              value={params.minTwoToTwoMeV}
              onChange={(e) => setParams({...params, minTwoToTwoMeV: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Nuclides to Pair
            </label>
            <input
              type="number"
              className="input"
              value={params.maxNuclides}
              onChange={(e) => setParams({...params, maxNuclides: parseInt(e.target.value)})}
              max={100}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended: 50-100</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Cascade Loops
            </label>
            <input
              type="number"
              className="input"
              value={params.maxLoops}
              onChange={(e) => setParams({...params, maxLoops: parseInt(e.target.value)})}
              max={5}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended: 2-3</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Feedback Options</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={params.feedbackBosons}
                onChange={(e) => setParams({...params, feedbackBosons: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm">Feedback Bosons</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={params.feedbackFermions}
                onChange={(e) => setParams({...params, feedbackFermions: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm">Feedback Fermions</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={params.allowDimers}
                onChange={(e) => setParams({...params, allowDimers: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm">Allow Dimer Formation (H, N, O, F, Cl, Br, I)</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={params.excludeMelted}
                onChange={(e) => setParams({...params, excludeMelted: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm">Exclude elements below melting point</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={params.excludeBoiledOff}
                onChange={(e) => setParams({...params, excludeBoiledOff: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm">Exclude elements that boiled off</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="btn btn-primary px-8 py-3">
          <Play className="w-5 h-5 mr-2 inline" />
          Run Cascade Simulation
        </button>
        <button className="btn btn-secondary px-8 py-3">
          Reset Parameters
        </button>
      </div>

      <div className="card p-6 mt-6 bg-blue-50 dark:bg-blue-900/30">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How Cascades Work</h3>
        <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside">
          <li>Start with your specified fuel nuclides</li>
          <li>Find all possible Fusion and 2-2 reactions between these nuclides</li>
          <li>Products meeting energy/temperature criteria are "fed back" as new reactants</li>
          <li>Process repeats recursively up to the max loop count</li>
          <li>Results show the full cascade of reactions and final product distribution</li>
        </ol>
      </div>
    </div>
  )
}
