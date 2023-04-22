import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './styles/App.scss';

import RecordManager from './components/RecordManager';
import RandomRecordGenerator from './components/RandomRecordGenerator';
import RecordStats from './components/RecordStats';
import AddRecord from './components/AddRecord';
import EditRecord from './components/EditRecord';
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
    "Country Rock",
    "Dance",
    "Disco",
    "Easy Listening",
    "Electronic",
    "Folk",
    "Funk",
    "Grunge",
    "Holiday",
    "Indie Rock",
    "International",
    "Jazz",
    "Oldies",
    "Opera",
    "Other",
    "Pop",
    "Prog Rock",
    "Psychedelic Rock",
    "Punk",
    "Rap",
    "Reggae",
    "Rock",
    "Soft Rock",
    "Ska",
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

  const tooltipText = {
    genre: 'Genres are subjective, but choose the one you think fits this album best!',
    link: 'Enter the URL of a website with more information about this album. Wikipedia is often a good source.',
    image: 'Find an image of this album cover online. (Again, Wikipedia is usually reliable.) Right-click the image and select "Copy image address.',
    favorite: 'Is this a "go-to" record that you listen to more than others? Maybe you keep your favorite records in a separate location from the others? If so, mark it as a favorite! (It will be denoted with a yellow star)',
  };

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
        <Route path='/Generate'>
          <RandomRecordGenerator user={user} genres={genres} hasGenre={hasGenre} setCurrentUser={setCurrentUser}/>
        </Route>
        <Route path='/Stats'>
          <RecordStats user={user} genres={genres} hasGenre={hasGenre} setCurrentUser={setCurrentUser}/>
        </Route>
        <Route path='/add-record'>
          <AddRecord user={user} genres={genres} tooltipText={tooltipText}/>
        </Route>
        <Route
          path='/edit-record/:id'
          render={(props) => <EditRecord {...props} genres={genres} tooltipText={tooltipText}/>}
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