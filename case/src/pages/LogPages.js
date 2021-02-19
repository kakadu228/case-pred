import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
export const LogPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()

    const [form, setForm] = useState({
        email:'', password: ''
    })

    useEffect( () => {
        console.log(error)
        message(error)
        clearError()
    }, [error, message])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    const loginHaldler = async () =>{
        try{
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        }catch(e){}
    }

    const pressHalder = async event => {
        if (event.key === 'Enter'){
            try{
                const data = await request('/api/auth/login', 'POST', {...form})
                auth.login(data.token, data.userId)
            }catch(e){}
        }
    }

    return (
        <div className="row justify-content-center">
            <div className='block-1 valign-wrapper center-align'> 
                <form className='form-1 s-3 xl-3 offset-xl-3 m-6 offset-m-3 l-6 offset-l-3'>
                    <h1 className="h1-log">Контроль веса</h1>
                    <h3 className="h2-log">Авторизация</h3>
                    <div className="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email</label>
                        <input type="email" class="form-control input-1" name='email' onChange={changeHandler} id="exampleInputEmail1" placeholder="email" aria-describedby="emailHelp" onKeyPress={pressHalder}/>
                    </div>
                    <div className="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control input-1" name='password' placeholder="password" onChange={changeHandler} id="exampleInputPassword1" onKeyPress={pressHalder}/>  
                    </div>
                    <div className="text-center">
                        <a  href='/reg'>Не зарегистрированы?<br />Зарегестрируйтесь</a><br /><br />
                        <a href='/recovery'>Забыли пароль?</a><br />

                        <a class="btn btn-primary" onClick={loginHaldler} >Войти</a>
                    </div>
                </form>
            </div>
        </div>
    )
}