import { Link } from 'react-router-dom'
import { Atom, Database, Beaker, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Atom className="w-16 h-16 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          The Nanosoft Package
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Interactive tools for exploring Low Energy Nuclear Reactions (LENR) and cold fusion transmutation pathways
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Based on the groundbreaking work of Dr. Alexander Parkhomov
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Beaker className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Query Nuclear Reactions</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Search through thousands of exothermic fusion, fission, and two-to-two nuclear transmutation reactions
              </p>
              <div className="space-y-2">
                <Link to="/fusion" className="block text-primary-600 hover:text-primary-700 text-sm font-medium">
                  → Fusion Reactions
                </Link>
                <Link to="/fission" className="block text-primary-600 hover:text-primary-700 text-sm font-medium">
                  → Fission Reactions
                </Link>
                <Link to="/twotwo" className="block text-primary-600 hover:text-primary-700 text-sm font-medium">
                  → Two-To-Two Reactions
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cascade Simulations</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Model chain reactions and predict reaction products from cascading LENR processes
              </p>
              <div className="space-y-2">
                <Link to="/cascades" className="block text-primary-600 hover:text-primary-700 text-sm font-medium">
                  → Run Cascade Simulations
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Element & Nuclide Data</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Browse comprehensive tables of nuclear and chemical properties
              </p>
              <div className="space-y-2">
                <Link to="/element-data" className="block text-primary-600 hover:text-primary-700 text-sm font-medium">
                  → Show Element Data
                </Link>
                <Link to="/tables" className="block text-primary-600 hover:text-primary-700 text-sm font-medium">
                  → Tables in Detail
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Database className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Advanced Queries</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Execute custom SQL queries across all reaction and property tables
              </p>
              <div className="space-y-2">
                <Link to="/all-tables" className="block text-primary-600 hover:text-primary-700 text-sm font-medium">
                  → All Tables Query Tool
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Parkhomov Tables</h2>
        <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
          <p className="mb-3">
            This package is based on the pioneering work of Russian physicist <strong>Dr. Alexander Parkhomov</strong>,
            who published comprehensive tables of possible cold nuclear transmutation reactions in 2018.
          </p>
          <p className="mb-3">
            Using computer analysis of 280 stable nuclides, Dr. Parkhomov identified:
          </p>
          <ul className="list-disc list-inside mb-3 space-y-1">
            <li><strong>1,389 fusion reactions</strong> - combining lighter elements</li>
            <li><strong>817 fission reactions</strong> - splitting heavier elements</li>
            <li><strong>516,789 two-to-two reactions</strong> - transforming pairs of nuclides</li>
          </ul>
          <p className="mb-3">
            All reactions in these tables are <strong>exothermic</strong> (energy-producing) and represent
            thermodynamically favorable pathways for nuclear transmutation at low energies.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Developed by R.W. Greenyer and P.W. Power for the Martin Fleischmann Memorial Project
          </p>
        </div>
      </div>

      <div className="card p-6 mt-6 border-2 border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Original Application</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          This is a modern reimplementation of the original Nanosoft Package, which was developed as a
          PHP web application to explore Dr. Parkhomov's nuclear transmutation tables.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The original application and comprehensive documentation can be found at:
        </p>
        <a
          href="https://nanosoft.co.nz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Visit nanosoft.co.nz
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          We are grateful to R. W. Greenyer and P. W. Power for their pioneering work in making this important research accessible.
        </p>
      </div>
    </div>
  )
}
