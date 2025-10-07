export default function TablesInDetail() {
  const tables = [
    {
      name: 'FusionAll',
      description: 'All exothermic fusion reactions including neutrino variants',
      fields: ['id', 'E1', 'Z1', 'A1', 'E', 'Z', 'A', 'MeV', 'neutrino', 'nBorF1', 'aBorF1', 'nBorF', 'aBorF', 'BEin']
    },
    {
      name: 'FissionAll',
      description: 'All exothermic fission reactions including neutrino variants',
      fields: ['id', 'E', 'Z', 'A', 'E1', 'Z1', 'A1', 'E2', 'Z2', 'A2', 'MeV', 'neutrino', 'nBorF', 'aBorF', 'BEin']
    },
    {
      name: 'TwoToTwoAll',
      description: 'All exothermic 2-2 transmutation reactions',
      fields: ['id', 'E1', 'Z1', 'A1', 'E2', 'Z2', 'A2', 'E3', 'Z3', 'A3', 'E4', 'Z4', 'A4', 'MeV', 'neutrino', 'BEin']
    },
    {
      name: 'NuclidesPlus',
      description: 'Extended table of 324 stable and long-lived nuclides',
      fields: ['id', 'Z', 'A', 'E', 'BE', 'AMU', 'nBorF', 'aBorF', 'LHL']
    },
    {
      name: 'ElementsPlus',
      description: 'Comprehensive element properties from periodic table',
      fields: ['Z', 'E', 'EName', 'Period', 'Group', 'AWeight', 'Melting', 'Boiling', 'STPDensity', 'ThermConduct']
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tables in Detail</h1>
        <p className="text-gray-600">Database schema and field descriptions for all Nanosoft tables</p>
      </div>

      <div className="space-y-4">
        {tables.map(table => (
          <div key={table.name} className="card p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{table.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{table.description}</p>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Fields:</h4>
              <div className="flex flex-wrap gap-2">
                {table.fields.map(field => (
                  <code key={field} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-800">
                    {field}
                  </code>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 mt-6 bg-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Field Definitions</h3>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-medium">Z</dt>
            <dd className="text-gray-600">Atomic number (number of protons)</dd>
          </div>
          <div>
            <dt className="font-medium">A</dt>
            <dd className="text-gray-600">Mass number (protons + neutrons)</dd>
          </div>
          <div>
            <dt className="font-medium">E</dt>
            <dd className="text-gray-600">Element symbol</dd>
          </div>
          <div>
            <dt className="font-medium">MeV</dt>
            <dd className="text-gray-600">Energy released in reaction (Mega electron Volts)</dd>
          </div>
          <div>
            <dt className="font-medium">BE</dt>
            <dd className="text-gray-600">Binding Energy in MeV</dd>
          </div>
          <div>
            <dt className="font-medium">nBorF / aBorF</dt>
            <dd className="text-gray-600">Nuclear/Atomic Boson (b) or Fermion (f) classification</dd>
          </div>
          <div>
            <dt className="font-medium">neutrino</dt>
            <dd className="text-gray-600">Neutrino involvement: none, left, or right</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
