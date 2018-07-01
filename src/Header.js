import React, { Component } from 'react';
import logo from './styles/logo.svg';
import './styles/app.css';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class Header extends Component {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <h1 className="App-title">HackDays 2018 AWS mobile application</h1>
            </header>
        );
    }
}

export default Header;
