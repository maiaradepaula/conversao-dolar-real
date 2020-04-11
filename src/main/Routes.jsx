import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
import Exchange from '../components/exchange/DollarToReal'

export default props => 
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/exchange' component={Exchange} />
        <Redirect from='*' to='/' />
    </Switch>