import React, {useContext, useCallback, useState, useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'

const moment = require('moment')



export const CreatePage = () => {
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const auth = useContext(AuthContext)
    const {token} = useContext(AuthContext)
    const [actibe, setActive] = useState('')
    const [link, setLink] = useState({
        fut: ''
    })

    const [code, setCode] = useState({
        coden: '', mk: ''
    })
    

    useEffect( () => {
        console.log(error)
        message(error)
        clearError()
    }, [error, message])


    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/auth/info`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setActive(fetched)
        } catch (e) {}
    }, [token, request])


    useEffect(() => {
        getLink()
    }, [getLink])


    useEffect(() => {
        window.M.updateTextFields()
      }, [])


    const pressHandlerl= async event =>{
        if (event.key === 'Enter'){
            event.preventDefault();
        }
    }

    const changeHandler = event => {
        setCode({ ...code, [event.target.name]: event.target.value})
    }


    const registerHalder = async () => {
        try{
            const data = await request('/api/auth/check_1', 'POST', {...code}, {
                Authorization: `Bearer ${auth.token}`
                })
            message(data.message)
        
        }catch(e){}
    }

    const generatenewcodeHalder = async () =>{
        try{
            const data = await request('/api/auth/generate_code', 'POST', null, {
                Authorization: `Bearer ${auth.token}`
                })
            setCode({ ...code, mk: data.chec})
        }catch(e){}
    }


    if (actibe.activ === false){
        return(
            <div className="block-1 row justify-content-center">
                <div className='valign-wrapper center-align'> 
                    <form className='form-1' >
                        <h1 className="h1-log">Контроль веса</h1>
                        <h3 className="h2-log">Подтверждение</h3>
                        <div className='mb-3'>
                            <label for="exampleInputPassword1" class="form-label">Код</label>
                            <input 
                            onChange={changeHandler}
                            type="text" 
                            class="form-control" 
                            placeholder="password" 
                            name="coden"
                            id="coden"
                            />
                        </div>
                        <a href = '/create' class="bnt btn btn-primary" onClick={registerHalder} disabled={loading}>Отправить</a><br />
                        <a href='#' data-toggle="modal" data-target="#exampleModal_2">Нет кода?</a><br /><br />
                        <a href = '#' onClick={generatenewcodeHalder} disabled={loading}>Отправить ещё раз</a>
                        <div className="modal fade" id="exampleModal_2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Подтверждение</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Проверьте правильность почты. Если почта введена верно, то проверьте спам.</p>
                                        <a data-dismiss="modal" className="btn btn-primary modal-btn">Понятно</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div> 
        )
    }


    const pressHandler = async event => { 
        try{
            const data = await request('/api/link/generate', 'POST', {...link, date: moment().format('L')}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
        }catch(e){}
    }


    return(
        <div className='row justify-content-center'>
            <div className='block-create'>
                <div className='valign-wrapper center-align'> 
                    <form className='form-1 s-3 xl-3 offset-xl-3 m-6 offset-m-3 l-6 offset-l-3' onKeyDown={pressHandlerl}>
                        <div className='mb-3'>
                            <div class="input-field input-1">
                                <input 
                                type="text" 
                                placeholder="Введите массу" 
                                id="link" 
                                name='fut'
                                onChange={event => setLink({ ...link, [event.target.name]: event.target.value})}
                                onKeyPress={pressHandlerl}
                                />
                                <a class='btn btn-primary' data-toggle="modal" data-target="#exampleModal">Добавить вес</a>
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
                                        <p>Уверены, что вы хотите внести именно <h5>{link.fut}</h5></p>
                                        <a data-dismiss="modal" className="btn btn-primary modal-btn">Нет</a>
                                        <a data-dismiss="modal" className="btn btn-primary modal-btn" onClick={pressHandler} href='#'>Да</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}