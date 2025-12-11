import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
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
          <Route path='/' element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LogPage />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard1 /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/event" element={<ProtectedRoute><Layout><ProfessionalEventsPage /></Layout></ProtectedRoute>} />
          <Route path="/recognition" element={<ProtectedRoute><Layout><Recognition /></Layout></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><Layout><Feed /></Layout></ProtectedRoute>} />
          <Route path='/employees' element={<ProtectedRoute><Layout><EmployeesPage /></Layout></ProtectedRoute>} />
          <Route path='/chat' element={<ProtectedRoute><Layout><Chat /></Layout></ProtectedRoute>} />
          <Route path='/settings' element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  )
}

export default App
