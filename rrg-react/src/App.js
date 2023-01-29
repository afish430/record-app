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
  const [genres, setGenres] = useState([
    "Classic Rock",
    "Rock",
    "Folk",
    "Alternative",
    "Country",
    "Pop",
    "Rap",
    "Oldies",
    "Reggae",
    "Holiday",
    "Childrens",
    "Other"
  ]);

  const setCurrentUser = (user) => {
    setUser(user);
    setViewMode("Tile");
  }

  const setViewMode = (mode) => {
    setMode(mode);
  }

    return (
      <Router>
        <div>
          <AppHeader user={user} setCurrentUser={setCurrentUser}></AppHeader>
          <Route exact path='/'>
            <RecordManager user={user} mode={mode} genres={genres} setViewMode={setViewMode}/>
          </Route>
          <Route path='/generator'>
            <RandomRecordGenerator user={user} genres={genres}/>
          </Route>
          <Route path='/add-record'>
            <AddRecord user={user} genres={genres}/>
          </Route>
          <Route
            path='/edit-record/:id'
            render={(props) => <EditRecord {...props} genres={genres}/>}
          />
          <Route path="/login">
            <LoginPage setCurrentUser={setCurrentUser} />
          </Route>
          <Route path='/create-account' component={CreateUserPage} />
        </div>
      </Router>
    );
  }

export default App;