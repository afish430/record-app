import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './styles/App.scss';

import RecordManager from './components/RecordManager';
import AddRecord from './components/AddRecord';
import EditRecord from './components/EditRecord';
import RandomRecordGenerator from './components/RandomRecordGenerator';
import AppHeader from './components/AppHeader';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <AppHeader></AppHeader>
          <Route exact path='/' component={RandomRecordGenerator} />
          <Route path='/manage-records' component={RecordManager} />
          <Route path='/add-record' component={AddRecord} />
          <Route path='/edit-record/:id' component={EditRecord} />
        </div>
      </Router>
    );
  }
}

export default App;