import {Link, useParams, NavLink} from 'react-router-dom'
import React, {useContext, useState, useEffect, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'


export const LinksList = ({ links, flag }) => {
  const linkId = useParams().id
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const auth = useContext(AuthContext)
  const [link, setLink] = useState('')
  const [linkss, setLinks] = useState('')
  const [code, setCode] = useState({
      coden: '', mk: ''
  })

  useEffect( () => {
    console.log(error)
    message(error)
    clearError()
}, [error, message])

  const getLink = async () =>{
    try{
      const fetched = await request(`/api/link/links/${linkId}`, 'GET', null , {
        Authorization: `Bearer ${auth.token}`
      })
      setLinks(fetched)
    }catch(e){}
  }

  const getLink_2 = async () =>{
    try{
      const fetched = await request(`/api/link/links/${linkId}`, 'GET', null , {
        Authorization: `Bearer ${auth.token}`
      })
      setLinks(fetched)
      window.location.reload();
    }catch(e){}
  }

  const closeHalder = async () => {
    window.location = '/links'
  }

  const getLink_3 = async () =>{
    window.location = '/links'
  }
  
  if (!links.length) {
    return <p className="center">Пока нет ничего</p>
  }

  if (flag === '1'){
    return(
      <div>
        <table className='centered'>
          <thead>
            <tr>
              <th>№</th>
              <th>Значение</th>
              <th>Дата</th>

              <th>Удалить</th>
            </tr>
            </thead>
          <tbody>
          { links.map((link, index) => {
            return (
              <tr key={link._id}>
                <td>{index + 1}</td>
                <td>{link.fut}</td>
                <td>{link.date}</td>
                <td>
                    <NavLink data-toggle="modal" data-target="#exampleModal" onClick={getLink} to={'/links/' + link.date.replace(/[\.\/]/g,'.')}>
                      {link.delete}
                    </NavLink>
                </td>
                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Подтверждение</h5>
                        <button onClick={closeHalder} type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <p>Удалить?</p>
                        <a data-dismiss="modal" className="btn btn-primary modal-btn" onClick={getLink_3}>Нет</a>
                        <a data-dismiss="modal" className="btn btn-primary modal-btn" onClick={getLink_2} href='#'>Да</a>
                      </div>
                    </div>
                  </div>
                </div>
              </tr>
            )
          }) }
          </tbody>
        </table>
      </div>
    )
  }else{
    return (
      <table className='centered'>
        <thead>
        <tr>
          <th>№</th>
          <th>Значение</th>
          <th>Дата</th>
        </tr>
        </thead>
        <tbody>
        { links.map((link, index) => {
          return (
            <tr key={link._id}>
              <td>{index + 1}</td>
              <td>{link.fut}</td>
              <td>{link.date}</td>
            </tr>
          )
        }) }
        </tbody>
      </table>
    )
  }
}




  