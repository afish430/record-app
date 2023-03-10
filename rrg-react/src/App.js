import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './styles/App.scss';

import RecordManager from './components/RecordManager';
import AddRecord from './components/AddRecord';
import EditRecord from './components/EditRecord';
import RandomRecordGenerator from './components/RandomRecordGenerator';
import AppHeader from './components/AppHeader';
import LoginPage from './components/LoginPage';
import CreateUserPage from './components/CreateUserPage';
import NotFoundPage from './components/NotFoundPage';

function App() {

  const [user, setUser] = useState({});
  const [mode, setMode] = useState('');
  const genres = [
    "Alternative",
    "Blues",
    "Children's",
    "Classical",
    "Classic Rock",
    "Country",
    "Dance",
    "Disco",
    "Folk",
    "Funk",
    "Holiday",
    "Indie Rock",
    "Jazz",
    "Oldies",
    "Opera",
    "Other",
    "Pop",
    "Prog Rock",
    "Punk",
    "Rap",
    "Reggae",
    "Rock",
    "Soul",
    "Soundtrack"
  ];

  const hasGenre = (genre, records) => {
    if (genre === "Favorites") {
        return records.filter(rec => rec.favorite === true).length > 0;
    }
    else if (genre === "Pre-1960") {
      return records.filter(rec => rec.year < 1960).length > 0;
  }
    else if (genre === "1960s") {
        return records.filter(rec => rec.year >= 1960 && rec.year < 1970).length > 0;
    }
    else if (genre === "1970s") {
        return records.filter(rec => rec.year >= 1970 && rec.year < 1980).length > 0;
    }
    else if (genre === "1980s") {
        return records.filter(rec => rec.year >= 1980 && rec.year < 1990).length > 0;
    }
    else if (genre === "1990s") {
        return records.filter(rec => rec.year >= 1990 && rec.year < 2000).length > 0;
    }
    else if (genre === "2000 to Present") {
        return records.filter(rec => rec.year >= 2000).length > 0;
    }
    else if (genre === "Favorites") {
        return records.filter(rec => rec.favorite === true).length > 0;
    }
    else {
        return records.filter(rec => rec.genre === genre).length > 0;
    } 
}

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
        <Switch>
        <Route exact path='/'>
          <RecordManager user={user} mode={mode} genres={genres} hasGenre={hasGenre} setViewMode={setViewMode} setCurrentUser={setCurrentUser}/>
        </Route>
        <Route path='/generator'>
          <RandomRecordGenerator user={user} genres={genres} hasGenre={hasGenre} setCurrentUser={setCurrentUser}/>
        </Route>
        <Route path='/add-record'>
          <AddRecord user={user} genres={genres}/>
        </Route>
        <Route
          path='/edit-record/:id'
          render={(props) => <EditRecord {...props} genres={genres}/>}
        />
        <Route path="/login">
          <LoginPage setCurrentUser={setCurrentUser} setViewMode={setViewMode}/>
        </Route>
        <Route path='/create-account' component={CreateUserPage} />
        <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;