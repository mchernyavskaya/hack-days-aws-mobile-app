import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';

// aws mobile init
// http://bit.ly/HackDaysPlayWithReact
Amplify.configure(awsmobile);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
