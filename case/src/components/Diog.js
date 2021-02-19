import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Loader} from '../components/Loader'
import {LineChart, ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis,YAxis, Tooltip, Legend, Line} from 'recharts'
const moment = require('moment')


export const Diog = ({ str, links, from, to, fo} ) => {
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [forms, setForms] = useState('')

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    let data = []

    if (from !== '000'){
        for (let i = 0; i < links.length; i++) {
            if ((moment(links[i].date).isAfter(from) === true && moment(links[i].date).isBefore(moment().format('L')) === true) || moment(links[i].date).isSame(moment().format('L')) === true || moment(links[i].date).isSame(from) === true){
                data.push(
                    {
                        'name' : links[i].date,
                        'Вес' : links[i].fut,
                        'Желаемый вес': str.str
                    }
                )
            }
        }
    }else{
        for (let i = 0; i < links.length; i++) {
            if ((moment(links[i].date).isAfter(fo.from) === true && moment(links[i].date).isBefore(to.to) === true) || moment(links[i].date).isSame(to.to) === true || moment(links[i].date).isSame(fo.from) === true){
                data.push(
                    {
                        'name' : links[i].date,
                        'Вес' : links[i].fut,
                        'Желаемый вес': str.str
                    }
                )
            }
        }
    }
    

    var mql = window.matchMedia("(orientation: portrait)");
    mql.addListener(function(m) {
        if(m.matches) {
            window.location.reload()
        }
        else {
            window.location.reload()
        }
    });


    if(mql.matches) {  
        return(
            <h3 style={{color: 'yellow'}}>Переверните телефон </h3>
        )
    }else {  
        return(
            <div className='row justify-content-centeriner'>
                <ResponsiveContainer className='adap-di' width='150%' height={500}> 
                    <LineChart className='adap-di'  data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>    
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="white" />

                        <YAxis stroke="white" />
                        <Tooltip stroke="white"/>
                        <Legend />
                        <Line type="monotone" dataKey="Желаемый вес" stroke="#FFC300" />
                        <Line type="monotone" dataKey="Вес" stroke="#00FA9A" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
}