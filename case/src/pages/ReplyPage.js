import React, {useContext, useCallback, useState, useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'
import {NavLink, useHistory, useParams} from 'react-router-dom'


export const Reply = () => {
    const linkId = useParams().id
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const auth = useContext(AuthContext)
    const {token} = useContext(AuthContext)
    const [code, setCode] = useState({
        email: linkId, pass_1: '', pass_2: ''
    })

    useEffect( () => {
        console.log(error)
        message(error)
        clearError()
    }, [error, message])


    const changeHandler = event => {
        setCode({ ...code, [event.target.name]: event.target.value})
    }


    const presHalder = async event =>{
        if (event.key === 'Enter'){
            try{
                const data = await request('/api/auth/reply', 'POST', {...code})
                message(data.message)
                if (data.message === 'Пароль успешно восстановлен'){
                    auth.login(data.token, data.userId)
                    window.location = '/create'
                }
            }catch(e){}
        }
    }


    const registerHalder = async () => {
        try{
            const data = await request('/api/auth/reply', 'POST', {...code})
            message(data.message)
            if (data.message === 'Пароль успешно восстановлен'){
                auth.login(data.token, data.userId)
                window.location = '/create'
            }
        }catch(e){}
    }

    
    return(
        <div className="block-1 row justify-content-center">
            <div className='valign-wrapper center-align'> 
                <form className='form-1' >
                    <h1 className="h1-log">Контроль веса</h1>
                    <h3 className="h4-log">3) Смена пароля</h3>
                    <div className='mb-3'>
                        <label for="exampleInputPassword1" class="form-label">Новый пароль</label>
                        <input 
                        onChange={changeHandler}
                        type="password" 
                        class="form-control" 
                        placeholder="password" 
                        name="pass_1"
                        onChange={changeHandler}
                        id="pass_1"
                        />
                         <label for="exampleInputPassword1" class="form-label h14-log">Повторно пароль</label>
                        <input 
                        onChange={changeHandler}
                        type="password" 
                        class="form-control" 
                        placeholder="password" 
                        name="pass_2"
                        onChange={changeHandler}
                        onKeyPress={presHalder}
                        id="pass_2"
                        />
                    </div>
                    <a href = '#' class="btn btn-primary" onClick={registerHalder} disabled={loading}>Сменить</a><br />
                </form>
            </div>
        </div> 
    )
}