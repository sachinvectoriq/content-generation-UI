// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import GenerationForm from './components/features/GenerationForm.jsx'
import Help from './components/layout/Help.jsx'
import Header from './components/layout/Header.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import './index.css'

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />
      <Routes>
        <Route path="/" element={<GenerationForm />} />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  )
}

export default App;