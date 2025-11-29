import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Routes,Route} from 'react-router-dom'
import Recognition from './pages/Recognition'
import Layout from './components/layout/Layout'
import EmployeesPage from './pages/EmployeesPage'
import Chat from './pages/Chat'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Dashboard1 from './pages/Dashboard1'
import ProfessionalEventsPage from './pages/ProfessionalEventsPage'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import LogPage from './pages/LogPage'
import Settings from './pages/Settings'



function App() {
  return (
    <>
      <div>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path="/login" element={<LogPage/>}/>
              <Route path="/Signup" element={<SignUp/>}/>
              <Route path="/dashboard" element={<Layout><Dashboard1/></Layout>}/>
              <Route path="/profile" element={<Layout><Profile/></Layout>}/>
              <Route path="/event" element={<Layout><ProfessionalEventsPage/></Layout>}/>
              <Route path="/recognition" element={<Layout><Recognition/></Layout>}/>
              <Route path="/feed" element={<Layout><Feed/></Layout>}/>
              <Route path='/employees' element={<Layout><EmployeesPage/></Layout>}/>
              <Route path='/chat' element={<Layout><Chat/></Layout>}/>
              <Route path='/settings' element={<Layout><Settings/></Layout>}/>
            </Routes>   
      </div>
    </>
  )
}

export default App
