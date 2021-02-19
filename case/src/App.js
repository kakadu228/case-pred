import React, {useState, useEffect, useCallback} from 'react'
import {useHttp} from './hooks/http.hook'
import {useRoutes} from './routes'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthContext} from './context/AuthContext'
import {useAuth} from './hooks/auth.hook'
import { Loader } from './components/Loader'
import 'materialize-css'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'

function App() {
 
  const {token, login, logout, userId, ready} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  if (!ready){
    return <Loader />
  }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
      <Router>
        { isAuthenticated && <Navbar />}
       <div className = 'container h-100'>
        {routes}
        </div>
        {/* { isAuthenticated && <Footer />} */}
      </Router>
    </AuthContext.Provider>
  )
}

export default App