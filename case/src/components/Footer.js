import React, { useContext, useEffect } from 'react'
import {AuthContext} from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import {User} from 'react-router-dom'
export const Footer = () => {
    const message = useMessage()
    const {error, clearError} = useHttp()
    const auth = useContext(AuthContext)

    useEffect( () => {
        console.log(error)
        message(error)
        clearError()
    }, [error, message])

    return(
        <div>
            <footer class="page-footer">
                <div class="container">
                    <div class="row">
                        <div class="col l6 s12">
                            <h5 class="white-text">Продакшен DSM-11</h5>
                            <p class="grey-text text-lighten-4">Не знаю что тут писать.</p>
                        </div>
                        <div class="col l4 offset-l2 s12">
                            <h5 class="white-text">Авторы</h5>
                            <ul>
                                <li><a class="grey-text text-lighten-3" href="#!">Сапунов Даниил</a></li>
                                <li><a class="grey-text text-lighten-3" href="#!">Карелин Вячеслав</a></li>
                                <li><a class="grey-text text-lighten-3" href="#!">Артовский Максим</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="footer-copyright">
                    <div class="container">
                        © 2021 case-pred
                        <a class="grey-text text-lighten-4 right" href="#!">И тут</a>
                    </div>
                </div>
            </footer>
        </div>
        
    )
}