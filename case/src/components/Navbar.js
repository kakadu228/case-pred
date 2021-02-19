import React, { useContext, useEffect } from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import {User} from 'react-router-dom'
export const Navbar = () => {
    const history = useHistory()
    const message = useMessage()
    const {error, clearError} = useHttp()
    const auth = useContext(AuthContext)

    useEffect( () => {
        console.log(error)
        message(error)
        clearError()
    }, [error, message])

    const logoutHadler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    }
    return(
        <div class="pos-f-t">
            <div class="collapse" id="navbarToggleExternalContent">
                <div class="bg-blue p-4">
                    <li className='menu-li-1'><NavLink className='menu-a-1' to='/create'>Создать</NavLink></li>
                    <li className='menu-li-1'><NavLink className='menu-a-1' to='/links'>Таблица измерений</NavLink></li>
                    <li className='menu-li-1'><NavLink className='menu-a-1' to='/dio'>Диаграмма изменения</NavLink></li>
                    <li className='menu-li-1'><NavLink className='menu-a-1' to='/' onClick={logoutHadler}>Выход</NavLink></li>
                </div>
            </div>
            <nav class="navbar navbar-dark bg-dark">
                <a href="#" class="brand-logo right"><img height='47' src='/logo2.png' alt='Хуй' /></a>
                <div class="nav-wrapper">
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i class="material-icons">menu</i>
                    </button>
                    <ul id="nav-mobile" class="right hide-on-med-and-down">
                        <li className='menu-li-2'><NavLink to='/create'>Создать</NavLink></li>
                        <li className='menu-li-2'><NavLink className='menu-a-2' to='/links'>Таблица измерений</NavLink></li>
                        <li className='menu-li-2'><NavLink className='menu-a-2' to='/dio'>Диаграмма изменения</NavLink></li>
                        <li className='menu-li-2'><NavLink className='menu-a-2' to='/' onClick={logoutHadler}>Выход</NavLink></li>
                    </ul>
                </div>
            </nav>
        </div>  
    )
}