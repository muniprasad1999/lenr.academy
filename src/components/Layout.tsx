import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Atom } from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Home', path: '/' },
  { name: 'Fusion Reactions', path: '/fusion' },
  { name: 'Fission Reactions', path: '/fission' },
  { name: 'Two-To-Two Reactions', path: '/twotwo' },
  { name: 'Show Element Data', path: '/element-data' },
  { name: 'Tables in Detail', path: '/tables' },
  { name: 'All Tables', path: '/all-tables' },
  { name: 'Cascades', path: '/cascades' },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Atom className="w-6 h-6 text-primary-600" />
              <span className="text-lg font-bold">Nanosoft</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium mb-1 ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white">
          <div className="flex items-center gap-2 p-6 border-b">
            <Atom className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Nanosoft Suite</h1>
              <p className="text-xs text-gray-500">LENR Academy</p>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-sm font-medium mb-1 ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t text-xs text-gray-500">
            <p>Based on work by Dr. Alexander Parkhomov</p>
            <p className="mt-1">Martin Fleischmann Memorial Project</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <Atom className="w-6 h-6 text-primary-600" />
            <span className="text-lg font-bold">Nanosoft Suite</span>
          </div>
        </div>

        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
