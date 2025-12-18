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
import ProfileView from './components/Profile/ProfileView'
import Promotion from './pages/Promotion'
import Redemption from './pages/Redemption'
import LogPage from './pages/LogPage'
import Settings from './pages/Settings'
import ProfileFeed from './pages/ProfileFeed'
import ProfileUploads from './pages/ProfileUploads'
import ProfileLanguages from './pages/ProfileLanguages'
import ProfileLocation from './pages/ProfileLocation'
import ProfileFiles from './pages/ProfileFiles'
import ProfileDisplay from './pages/ProfileDisplay'
import ProfileDeleted from './pages/ProfileDeleted'
import ProfileClearHistory from './pages/ProfileClearHistory'
import ProfileExit from './pages/ProfileExit'
import ProfileReferrals from './pages/ProfileReferrals'
import CookiesPolicy from './pages/CookiesPolicy'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import Feedback from './pages/Feedback'
import RateApp from './pages/RateApp'
import RecruitmentLayout from "./pages/recruitment/RecruitmentLayout";
import Applications from "./pages/recruitment/Applications";
import Interviews from "./pages/recruitment/Interviews";
import Offers from "./pages/recruitment/Offers";
import RedemptionPage from './pages/Redeem'




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
          <Route path="/profile/:id" element={<ProtectedRoute><Layout><ProfileView /></Layout></ProtectedRoute>} />
          <Route path="/event" element={<ProtectedRoute><Layout><ProfessionalEventsPage /></Layout></ProtectedRoute>} />
          <Route path="/recognition" element={<ProtectedRoute><Layout><Recognition /></Layout></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><Layout><Feed /></Layout></ProtectedRoute>} />
          <Route path="/promotion" element={<ProtectedRoute><Layout><Promotion /></Layout></ProtectedRoute>} />
          <Route path="/redemption" element={<ProtectedRoute><Layout><RedemptionPage /></Layout></ProtectedRoute>} />
          <Route path='/employees' element={<ProtectedRoute><Layout><EmployeesPage /></Layout></ProtectedRoute>} />
          <Route path='/chat' element={<ProtectedRoute><Layout><Chat /></Layout></ProtectedRoute>} />
          <Route path='/settings' element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
          <Route path='/settings/rate' element={<ProtectedRoute><Layout><RateApp /></Layout></ProtectedRoute>} />
          <Route path='/settings/privacy' element={<ProtectedRoute><Layout><PrivacyPolicy /></Layout></ProtectedRoute>} />
          <Route path='/settings/terms' element={<ProtectedRoute><Layout><Terms /></Layout></ProtectedRoute>} />
          <Route path='/settings/cookies' element={<ProtectedRoute><Layout><CookiesPolicy /></Layout></ProtectedRoute>} />
          <Route path='/settings/contact' element={<ProtectedRoute><Layout><Contact /></Layout></ProtectedRoute>} />
          <Route path='/settings/feedback' element={<ProtectedRoute><Layout><Feedback /></Layout></ProtectedRoute>} />

          <Route path='/profile/feed' element={<ProtectedRoute><Layout><ProfileFeed /></Layout></ProtectedRoute>} />
          <Route path='/profile/uploads' element={<ProtectedRoute><Layout><ProfileUploads /></Layout></ProtectedRoute>} />
          <Route path='/profile/languages' element={<ProtectedRoute><Layout><ProfileLanguages /></Layout></ProtectedRoute>} />
          <Route path='/profile/location' element={<ProtectedRoute><Layout><ProfileLocation /></Layout></ProtectedRoute>} />
          <Route path='/profile/files' element={<ProtectedRoute><Layout><ProfileFiles /></Layout></ProtectedRoute>} />
          <Route path='/profile/display' element={<ProtectedRoute><Layout><ProfileDisplay /></Layout></ProtectedRoute>} />
          <Route path='/profile/deleted' element={<ProtectedRoute><Layout><ProfileDeleted /></Layout></ProtectedRoute>} />
          <Route path='/profile/clear-history' element={<ProtectedRoute><Layout><ProfileClearHistory /></Layout></ProtectedRoute>} />
          <Route path='/profile/exit' element={<ProtectedRoute><Layout><ProfileExit /></Layout></ProtectedRoute>} />
          <Route path='/profile/referrals' element={<ProtectedRoute><Layout><ProfileReferrals /></Layout></ProtectedRoute>} />

          <Route path="/recruitment/*" element={<ProtectedRoute><Layout><RecruitmentLayout /></Layout></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  )
}

export default App
