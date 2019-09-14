import React from 'react';
import { Switch , Route, BrowserRouter } from 'react-router-dom';
import Main from '../pages/main/main.pages';


const AppRoute = ()=>{
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Main} />
            </Switch>
        </BrowserRouter>
    )
}


export default AppRoute;