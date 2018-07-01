import React, { Component } from 'react';
import Header from './Header.js';
import UploadForm from './UploadForm.js';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <UploadForm/>
            </div>
        );
    }
}

export default App;
