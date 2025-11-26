import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Routes,Route} from 'react-router-dom'
import Recognition from './pages/Recognition'
import Layout from './components/layout/Layout'
import Profile1 from './pages/Profile1'
import EmployeesPage from './pages/EmployeesPage'

function App() {
  return (
    <>
      <div>
          <Layout>
            <Routes>
              <Route path="/profile" element={<Profile1/>}/>
              <Route path="/recognition" element={<Recognition/>}/>
              <Route path='/employees' element={<EmployeesPage/>}/>
            </Routes>
          </Layout>       
      </div>
    </>
  )
}

export default App
