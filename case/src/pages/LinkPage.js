import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'
import {LinksList} from '../components/LinksList'
import { useMessage } from '../hooks/message.hook'

export const LinkPage = () => {
  const [links, setLinks] = useState([])
  const {loading, error, request, clearError} = useHttp()
  const message = useMessage()
  const {token} = useContext(AuthContext)
  const [flag, setFlag] = useState()
  const [actibe, setActive] = useState('')
  const [code, setCode] = useState({
      coden: '', mk: ''
  })


  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request('/api/link', 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setLinks(fetched)
    } catch (e) {}
  }, [token, request])


  const fetchUser = useCallback(async () => {
    try {
      const fetcheds = await request('/api/auth/flg', 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setFlag(fetcheds)
    } catch (e) {}
  }, [token, request])

  const Getlink = useCallback(async () => {
    try {
        const fetched = await request(`/api/auth/info`, 'GET', null, {
          Authorization: `Bearer ${token}`
        })
        setActive(fetched)
    } catch (e) {}
  }, [token, request])


  useEffect(() => {
    Getlink()
  }, [Getlink])


  useEffect( () => {
    console.log(error)
    message(error)
    clearError()
  }, [error, message])


  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])


  useEffect(() => {
    fetchUser()
  }, [fetchUser])
 

  if (loading) {
    return <Loader/>
  }


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
                  <a href='#' class="btn btn-primary" onClick={registerHalder} disabled={loading}>Регистрация</a><br />
                  <a href='#' onClick={generatenewcodeHalder} disabled={loading}>Отправить ещё раз</a>
              </form>
          </div>
      </div> 
  )
  }else{
    return (
      <div className='Table-page'>
        {!loading && <LinksList links={links} flag={flag} />}
      </div>
    )
  }
}