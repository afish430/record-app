import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './styles/App.scss';

import RecordManager from './components/RecordManager';
import AddRecord from './components/AddRecord';
import EditRecord from './components/EditRecord';
import RandomRecordGenerator from './components/RandomRecordGenerator';
import AppHeader from './components/AppHeader';
import LoginPage from './components/LoginPage';
import CreateUserPage from './components/CreateUserPage';

function App() {

  const [user, setUser] = useState({});
  const [mode, setMode] = useState('');

  const setCurrentUser = (user) => {
    setUser(user);
  }

  const setViewMode = (mode) => {
    setMode(mode);
  }

    return (
      <Router>
        <div>
          <AppHeader user={user} setCurrentUser={setCurrentUser}></AppHeader>
          <Route exact path='/'>
            <RecordManager user={user} mode={mode} setViewMode={setViewMode}/>
          </Route>
          <Route path='/generator'>
            <RandomRecordGenerator user={user}/>
          </Route>
          <Route path='/add-record'>
            <AddRecord user={user}/>
          </Route>
          <Route path='/edit-record/:id' component={EditRecord} />
          <Route path="/login">
            <LoginPage setCurrentUser={setCurrentUser} />
          </Route>
          <Route path='/create-account' component={CreateUserPage} />
        </div>
      </Router>
    );
  }

export default App;