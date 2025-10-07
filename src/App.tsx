import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import FusionQuery from './pages/FusionQuery'
import FissionQuery from './pages/FissionQuery'
import TwoToTwoQuery from './pages/TwoToTwoQuery'
import ShowElementData from './pages/ShowElementData'
import TablesInDetail from './pages/TablesInDetail'
import AllTables from './pages/AllTables'
import CascadesAll from './pages/CascadesAll'

function App() {
  return (
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
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
