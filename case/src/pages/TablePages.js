import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'
import {Diog} from '../components/Diog'
import { useMessage } from '../hooks/message.hook'

const moment = require('moment')



export const TablePages = () => {
    const {token} = useContext(AuthContext)
    const {loading, error, request, clearError} = useHttp()
    const message = useMessage()
    const [links, setLink] = useState(null)
    const [forms, setForms] = useState('000')
    const [frome, setFrom] = useState('')
    const [str, setStr] = useState('')
    const [to, setTo] = useState('')
    const [actibe, setActive] = useState('')

    const [code, setCode] = useState({
        coden: '', mk: ''
    })

    const getlink = useCallback(async () => {
        try {
            const fetched = await request(`/api/auth/info`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setActive(fetched)
        } catch (e) {}
    }, [token, request])

    useEffect(() => {
        getlink()
    }, [getlink])

    useEffect( () => {
        console.log(error)
        message(error)
        clearError()
    }, [error, message])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/del`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setLink(fetched)
        } catch (e) {}
    }, [token, request])

    useEffect(() => {
        getLink()
    }, [getLink])
    

    const changeHandler = event => {
        setCode({ ...code, [event.target.name]: event.target.value})
    }

    const registerHalder = async () => {
        try{
            const data = await request('/api/auth/reg', 'POST', {...code})
            message(data.chec)
        
        }catch(e){}
    }

    const generatenewcodeHalder = async () =>{
        try{
            const data = await request('/api/auth/generate_code', 'POST', null, {
                Authorization: `Bearer ${token}`
            })
            message(data.message)
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
                            <label for="exampleInputPassword1" class="form-label">Повторно пароль</label>
                            <input 
                            onChange={changeHandler}
                            type="text" 
                            class="form-control" 
                            placeholder="password" 
                            name="coden"
                            id="coden"
                            />
                        </div>
                        <a href='/create' class="bnt btn btn-primary" onClick={registerHalder} disabled={loading}>Регистрация</a><br />
                        <a href='#' onClick={generatenewcodeHalder} disabled={loading}>Отправить ещё раз</a>
                    </form>
                </div>
            </div> 
        )
    }else{
        if (forms === '000'){
            return (
                <div className="row justify-content-center">
                    <div className='block-dio'>
                        <form className='form-1 col s12'>
                            <div className='mb-3'>
                                <select className='browser-default' onChange={(e) => {
                                    const dar = e.target.value
                                    setForms(dar)
                                }} >
                                    <option value="000">Свой промежуток даты</option>
                                    <option value={moment().subtract(7, 'days').calendar('L')}>Неделя</option>
                                    <option value={moment().subtract(1, 'month').calendar('L')}>Месяц</option>
                                    <option value={moment().subtract(2, 'month').calendar('L')}>Два месяца</option>
                                    <option value={moment().subtract(6, 'month').calendar('L')}>Полгода</option>
                                    <option value={moment().subtract(1, 'year').calendar('L')}>Год</option>
                                </select>
                            </div>
                            <div class="input-field input-1">
                                <input 
                                onChange={ event => setStr({ ...str, [event.target.name]: event.target.value})}
                                name='str'
                                type="text" 
                                placeholder="Желаемый вес" 
                                />
                            </div>
                            <div className='dio'>
                                { !loading && links && <Diog str={str} links={links} from={forms} to={to} fo={frome}/> }
                            </div>
                            <p>Дата должна соответсвовать следующему формату :</p><h3>МЕСЯЦ/ДЕНЬ/ГОД</h3>
                            <div class="input-field">
                                <input 
                                onChange={ event => setFrom({ ...frome, [event.target.name]: event.target.value})}
                                name='from'
                                className='input-32'
                                type="text" 
                                placeholder="От" 
                                id='input-32'
                                />
                                <input 
                                onChange={ event => setTo({ ...to, [event.target.name]: event.target.value})}
                                name='to'
                                className='input-32'
                                id='input-33'
                                type="text" 
                                placeholder="До" 
                                />
                            </div>
                        </form>
                    </div>
                </div>
    
                )
        }
        if (loading) {
            return <Loader />
        }
        return (
            <div className='container block-dio'>
                <form className='form-1 s-3 xl-3 offset-xl-3 m-6 offset-m-3 l-6 offset-l-3'>
                    <div className='mb-3'>
                        <select className='browser-default' onChange={(e) => {
                            const dar = e.target.value
                            setForms(dar)
                        }} >
                            <option value="000">Свой промежуток даты</option>
                            <option value={moment().subtract(7, 'days').calendar('L')}>Неделя</option>
                            <option value={moment().subtract(1, 'month').calendar('L')}>Месяц</option>
                            <option value={moment().subtract(2, 'month').calendar('L')}>Два месяца</option>
                            <option value={moment().subtract(6, 'month').calendar('L')}>Полгода</option>
                            <option value={moment().subtract(1, 'year').calendar('L')}>Год</option>
                        </select>
                    </div>
                    <div class="input-field input-1">
                        <input 
                        onChange={ event => setStr({ ...str, [event.target.name]: event.target.value})}
                        name='str'
                        type="text" 
                        placeholder="Желаемый вес" 
                        />
                    </div>
                    <div className='dio'>
                        { !loading && links && <Diog str={str} links={links} from={forms} to={to} fo={frome}/> }
                    </div>
                </form>
            </div>
        )
    }   
    }
    
