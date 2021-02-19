import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {LinkPage} from './pages/LinkPage'
import {CreatePage} from './pages/CreatePage'
import {TablePages} from './pages/TablePages'
import {RegPage} from './pages/RegPage'
import {LogPage} from './pages/LogPages'
import {Recovery} from './pages/ReacovertPage'
import {Check} from './pages/Check'
import {Reply} from './pages/ReplyPage'

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/links" exact>
                    <LinkPage />
                </Route>
                <Route path="/links/:id" exact>
                    <LinkPage />
                </Route>
                <Route path="/creat" exact>
                    <CreatePage />
                </Route>
                <Route path="/dio" exact>
                    <TablePages />
                </Route>
                <Route path="/recovery" exact>
                    <Recovery />
                </Route>
                <Route path="/recovery" exact>
                    <Recovery />
                </Route>
                {/* <Route path="/reply" exact>
                    <Reply />
                </Route>
                <Route path="/check" exact>
                    <Check />
                </Route> */}
                <Redirect to="/creat"/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/check" exact>
                    <Check />
                </Route>
                <Route path="/recovery" exact>
                    <Recovery />
                </Route>
                <Route path="/recovery/:id" exact>
                    <Recovery />
                </Route>
            <Route path="/reg" exact>
                <RegPage />
            </Route>
            <Route path="/reply/:id" exact>
                <Reply />
            </Route>
            <Route path="/" exact>
                <LogPage />
            </Route>

            <Redirect to="/" />
        </Switch>
    )
}