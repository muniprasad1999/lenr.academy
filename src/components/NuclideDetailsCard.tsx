import { X } from 'lucide-react'
import type { Nuclide } from '../types'

interface NuclideDetailsCardProps {
  nuclide: Nuclide | null
  onClose?: () => void
}

export default function NuclideDetailsCard({ nuclide, onClose }: NuclideDetailsCardProps) {
  if (!nuclide) return null

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {nuclide.E}-{nuclide.A}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Atomic Number: {nuclide.Z} • Mass Number: {nuclide.A}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Close nuclide details"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
            Nuclear Properties
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Element:</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">{nuclide.E}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Protons (Z):</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">{nuclide.Z}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Mass Number (A):</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">{nuclide.A}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Neutrons (N):</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">{nuclide.A - nuclide.Z}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
            Quantum Properties
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <dt className="text-gray-600 dark:text-gray-400">Nuclear Type:</dt>
              <dd>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  nuclide.nBorF === 'b' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                }`}>
                  {nuclide.nBorF === 'b' ? 'Boson' : 'Fermion'}
                </span>
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-gray-600 dark:text-gray-400">Atomic Type:</dt>
              <dd>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  nuclide.aBorF === 'b' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                }`}>
                  {nuclide.aBorF === 'b' ? 'Boson' : 'Fermion'}
                </span>
              </dd>
            </div>
            <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
              Nuclear: {nuclide.nBorF === 'b' ? 'Even A' : 'Odd A'}<br />
              Atomic: {nuclide.aBorF === 'b' ? 'Even N' : 'Odd N'}
            </div>
          </dl>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
            Energy & Mass
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Binding Energy:</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">
                {nuclide.BE.toFixed(3)} MeV
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">BE per Nucleon:</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">
                {(nuclide.BE / nuclide.A).toFixed(3)} MeV
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600 dark:text-gray-400">Atomic Mass:</dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100">
                {nuclide.AMU.toFixed(6)} amu
              </dd>
            </div>
          </dl>
        </div>

        {typeof nuclide.LHL === 'number' && !isNaN(nuclide.LHL) && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
              Stability
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Log₁₀ Half-life:</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {nuclide.LHL.toFixed(2)} years
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Half-life:</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {Math.pow(10, nuclide.LHL).toExponential(2)} years
                </dd>
              </div>
              <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs text-amber-700 dark:text-amber-300">
                {nuclide.LHL > 9 ? 'Stable or very long-lived' :
                 nuclide.LHL > 0 ? 'Radioactive' :
                 'Short-lived radioactive'}
              </div>
            </dl>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 text-sm">
          About Boson/Fermion Classification
        </h3>
        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
          <strong>Nuclear:</strong> Determined by mass number (A). Even A = Boson, Odd A = Fermion.<br />
          <strong>Atomic:</strong> Determined by neutron count (N = A - Z). Even N = Boson, Odd N = Fermion.<br />
          This classification affects quantum statistical behavior and reaction probabilities.
        </p>
      </div>
    </div>
  )
}
