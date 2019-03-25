import React from 'react';
import ReactDOM from 'react-dom';
import AppEditor from './screens/AppEditor/AppEditor';
import registerServiceWorker from './registerServiceWorker';

import './index.scss';

ReactDOM.render(<AppEditor />, document.getElementById('root'));
registerServiceWorker();
