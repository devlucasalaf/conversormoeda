import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Main from './components/Main'
import Result from './components/Result'


const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Main}></Route>
        <Route path={`/result`} component={Result}></Route>
      </Switch>
    </BrowserRouter>
  )
}

export default Routes