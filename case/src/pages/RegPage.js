import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import {Loader} from '../components/Loader'

export const RegPage = () => {
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()

    const [form, setForm] = useState({
        email:'', password: '', password_2: '', flag: ''
    })
    
    

    useEffect( () => {
        console.log(error)
        message(error)
        clearError()
    }, [error, message])


    if (loading) {
        return <Loader />
    }


    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }


    const registrHaldler = async () =>{
        try{
            const data = await request('/api/auth/reg', 'POST', {...form})
            message(data.message)
            if (data.message === 'Подтвердите почту'){
                try{
                    const data = await request('/api/auth/login', 'POST', {...form})
                    auth.login(data.token, data.userId)
                }catch(e){}
            }
        }catch(e){}
    }


    const presHalder = async event =>{
        if (event.key === 'Enter'){
            try{
                const data = await request('/api/auth/reg', 'POST', {...form})
                message(data.message)
            }catch(e){}
        }
    }


    return (
        <div className="block-1 row justify-content-center">
            <div className='valign-wrapper center-align'> 
                <div className='form-1' >
                    <h1 className="h1-log">Контроль веса</h1>
                    <h3 className="h2-log">Регистрация</h3>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Почта</label>
                        <input 
                        type="email" 
                        class="form-control" 
                        placeholder="email" 
                        id="email" 
                        name="email"
                        onChange={changeHandler}
                        aria-describedby="emailHelp"
                        onKeyPress={presHalder}/>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Пароль</label>
                        <input 
                        type="password" 
                        class="form-control" 
                        placeholder="password" 
                        name="password"
                        onChange={changeHandler}
                        id="password"
                        onKeyPress={presHalder}/>
                        <p className='p-2'>Пароль должен состоять не меньше, чем из 6 символов</p>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Повторно пароль</label>
                        <input 
                        type="password" 
                        class="form-control" 
                        placeholder="password" 
                        name="password_2"
                        onChange={changeHandler}
                        id="password_2"
                        onKeyPress={presHalder}/>
                        <p className='p-2'>Пароль должен состоять не меньше, чем из 6 символов</p>
                    </div>
                    <div>
                        <select className='browser-default log-sel' onChange={changeHandler} name='flag'>
                            <option value="1">Выбор режима</option>
                            <option value='1'>Пользовательский</option>
                            <option value='2'>Соревнование</option>
                        </select>
                        <a className='tutor' data-toggle="modal" data-target="#exampleModal">...Подробнее о режимах...</a><br /><br />
                    </div>
                    <div className="text-center">
                        <a className='tutut' href='/'>Есть аккаунт?<br /> Войди</a><br />
                        <a  href='#!' className="btn btn-primary" onClick={registrHaldler} type='' disabled={loading}>Регистрация</a>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Подтверждение</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className='p-block-1'>Вам предлагется на выбор два режима аккаунта:<br /><br />1) Пользовательский - у вас есть полный доступ ко всем функциям, вы можете редактировать таблицу измерений, удаляя данные. Этот режим подойдет тем, кто пользуется приложением исключительно для себя.<br /><br />2) Соревнование - это режим, в котором пользователь не может изменять свой вес, а только вводить и отслеживать его. Этот режим подойдет людям, которые не хотят врать прежде всего себе, но не могут удержаться от данного соблазна. Так же можно использовать в спорах,
                                чтобы честность сохранялась, и данные не были изменены.</p>
                            <a data-dismiss="modal" className="btn btn-primary modal-btn">Понятно</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}