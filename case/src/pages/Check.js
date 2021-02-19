import React, {useContext, useCallback, useState, useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'
import {useParams} from 'react-router-dom'


export const Check = ({email}) => {
    const linkId = useParams().id
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const auth = useContext(AuthContext)
    const {token} = useContext(AuthContext)
    const [code, setCode] = useState({
        coden: '', email: email
    })

    useEffect( () => {
        console.log(error)
        message(error)
        clearError()
    }, [error, message])

    
    const changeHandler = event => {
        setCode({ ...code, [event.target.name]: event.target.value})
    }

    const registerHalder = async () => {
        try{
            const data = await request('/api/auth/check_2', 'POST', {...code})
            message(data.message)
            if (data.message === 'Смена пароля'){
                window.location = `/reply/${data.hashEmail}`
            }
        }catch(e){}
    }

    const presHalder = async event =>{
        if (event.key === 'Enter'){
            try{
                const data = await request('/api/auth/check_2', 'POST', {...code})
                message(data.message)
                if (data.message === 'Смена пароля'){
                    window.location = `/reply/${data.hashEmail}`
                }
            }catch(e){}
        }
    }

    const generatenewcodeHalder = async () =>{
        try{
            const data = await request('/api/auth/generate_code_2', 'POST', {...code})
            setCode({ ...code, mk: data.chec})
            message(data.message)
        }catch(e){}
    }

    return(
        <div className="block-2 row justify-content-center">
            <div className='valign-wrapper center-align'> 
                <div className='form-1 block-23' >
                    <h3 className="h4-log">2) Подтверждение</h3>
                    <div className='mb-3'>
                        <label for="exampleInputPassword1" class="form-label">Код</label>
                        <input 
                        onChange={changeHandler}
                        type="text" 
                        class="form-control" 
                        placeholder="Код" 
                        name="coden"
                        onChange={changeHandler}
                        id="coden"
                        onKeyPress={presHalder}/>
                    </div>
                    <a href='#' data-toggle="modal" data-target="#exampleModal">Нет кода?</a><br /><br />
                    <a href = '#' onClick={generatenewcodeHalder}  disabled={loading}>Отправить ещё раз</a><br />
                    <a href = '#' class="btn btn-primary" onClick={registerHalder} disabled={loading}>Отправить</a>
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
                                    <p>Проверьте правильность почты. Если почта введена верно, то проверьте спам.</p>
                                    <a data-dismiss="modal" className="btn btn-primary modal-btn">Понятно</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}