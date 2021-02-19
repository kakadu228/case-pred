import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import {Loader} from '../components/Loader'
import {Check} from './Check'


export const Recovery = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [str, setStr] = useState({
        email: ''
    })


    const pressHalder = async event =>{ 
        try{
            const data = await request('/api/auth/rest', 'POST', {...str}, {
                Authorization: `Bearer ${auth.token}`
            })
            if (data.message === 'Подтвердите'){
                auth.login(data.token, data.userId)
            }
            message(data.message)
        }catch(e){}
    }

    
    const back = async() =>{
        window.location = '/'
    }


    const presHalder = async event =>{
        if (event.key === 'Enter'){
            try{
                const data = await request('/api/auth/rest', 'POST', {...str}, {
                    Authorization: `Bearer ${auth.token}`
                })
                if (data.message === 'Подтвердите'){
                    auth.login(data.token, data.userId)
                }
                message(data.message)
            }catch(e){}
        }
    }

    
    return (
        <div>
            <a onClick={back} className='btn btn-1 btn-primary'>Назад</a>
            <div className="block-1 row justify-content-center">
                <div className='valign-wrapper center-align'> 
                    <div className='form-1' >
                        <h1 className="h1-log">Контроль веса</h1>
                        <h3 className="h4-log">1) Поиск аккаунта</h3>
                        <div class="mb-3 block-re">
                            <label for="exampleInputEmail1" class="form-label">Почта</label>
                            <input 
                            type="email" 
                            className="form-control" 
                            placeholder="email" 
                            id="email" 
                            name="email"
                            onKeyPress={presHalder}
                            onChange={event => setStr({ ...str, [event.target.name]: event.target.value})}
                            aria-describedby="emailHelp"/>
                            <a class="btn btn-primary" onClick={pressHalder} >Найти</a>
                            {!loading && <Check email={str.email} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}