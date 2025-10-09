import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DatabaseProvider } from './contexts/DatabaseContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import FusionQuery from './pages/FusionQuery'
import FissionQuery from './pages/FissionQuery'
import TwoToTwoQuery from './pages/TwoToTwoQuery'
import ShowElementData from './pages/ShowElementData'
import TablesInDetail from './pages/TablesInDetail'
import AllTables from './pages/AllTables'
import CascadesAll from './pages/CascadesAll'
import PrivacyPreferences from './pages/PrivacyPreferences'

function App() {
  return (
    <ThemeProvider>
      <DatabaseProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fusion" element={<FusionQuery />} />
              <Route path="/fission" element={<FissionQuery />} />
              <Route path="/twotwo" element={<TwoToTwoQuery />} />
              <Route path="/element-data" element={<ShowElementData />} />
              <Route path="/tables" element={<TablesInDetail />} />
              <Route path="/all-tables" element={<AllTables />} />
              <Route path="/cascades" element={<CascadesAll />} />
              <Route path="/privacy" element={<PrivacyPreferences />} />
            </Routes>
          </Layout>
        </Router>
      </DatabaseProvider>
    </ThemeProvider>
  )
}

export default App
