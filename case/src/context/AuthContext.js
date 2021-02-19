import {createContext} from 'react'

function noob() {}

export const AuthContext = createContext( {
    token: null,
    userId: null,
    login: noob,
    logout: noob,
    isAuthenticated: false
})
