import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Routes,Route} from 'react-router-dom'
import Recognition from './pages/Recognition'
import Layout from './components/layout/Layout'
import Profile1 from './pages/Profile1'
import EmployeesPage from './pages/EmployeesPage'
import Chat from './pages/Chat'
import Home from './pages/Home'
import Login from './pages/LogIn'

function App() {
  return (
    <>
      <div>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/profile" element={<Layout><Profile1/></Layout>}/>
              <Route path="/recognition" element={<Layout><Recognition/></Layout>}/>
              <Route path='/employees' element={<Layout><EmployeesPage/></Layout>}/>
              <Route path='/chat' element={<Layout><Chat/></Layout>}/>
            </Routes>   
      </div>
    </>
  )
}

export default App
