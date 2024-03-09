import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import RecordManager from './components/RecordManager';
import RandomRecordGenerator from './components/RandomRecordGenerator';
import RecordStats from './components/RecordStats';
import NewRecord from './components/NewRecord';
import EditRecord from './components/EditRecord';
import AppHeader from './components/AppHeader';
import LoginPage from './components/LoginPage';
import CreateUserPage from './components/CreateUserPage';
import NotFoundPage from './components/NotFoundPage';
import { Record } from './shared/types/record';
import { User } from './shared/types/user';
import { RecordRoute } from './shared/types/recordRoute';

import './styles/App.scss';

const App: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<RecordRoute>(RecordRoute.Manage);

  const setManageActive = (): void => {
      setActiveRoute(RecordRoute.Manage);
  }

  const [user, setUser] = useState<User>({});
  const [mode, setMode] = useState<string>('');
  const genres: string[] = [
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

  // const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:8082/api" :"https://vinylator-api.onrender.com/api";
  const BASE_URL = "https://vinylator-api.onrender.com/api";


  const hasGenre = (genre: string, records: Record[]): boolean => {
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
    image: 'Find an image of this album cover online. Right-click the image and select "Copy image address." If on mobile, tap the image and try copying its URL from the browser. If using Wikipedia on iPhone, you may need to tap into the image, then "Details," then tap the link under that image, then finally copy the URL from the browser.',
    favorite: 'Is this a "go-to" record that you listen to more than others? Maybe you keep your favorite records on a separate shelf from the others? If so, list it as a favorite! (Favorites are marked with a yellow star)',
  };

  const setCurrentUser = (user: User) => {
    setUser(user);
  }

  const setViewMode = (mode: string) => {
    setMode(mode);
  }

  return (
    <Router>
      <div>
        <AppHeader
          user={user}
          activeRoute={activeRoute}
          setCurrentUser={setCurrentUser}
          setActiveRoute={setActiveRoute}
        />
        <Switch>
          <Route exact path='/'>
            <RecordManager
              user={user}
              mode={mode}
              genres={genres}
              hasGenre={hasGenre}
              setViewMode={setViewMode}
              setCurrentUser={setCurrentUser}
              baseUrl={BASE_URL}/>
          </Route>
          <Route path='/Stats'>
            <RecordStats
              user={user} 
              genres={genres}
              setCurrentUser={setCurrentUser}
              setManageActive={setManageActive}
              baseUrl={BASE_URL}/>
          </Route>
          <Route path='/Generate'>
            <RandomRecordGenerator
              user={user}
              genres={genres}
              hasGenre={hasGenre}
              setCurrentUser={setCurrentUser}
              setManageActive={setManageActive}
              baseUrl={BASE_URL}/>
          </Route>
          <Route path='/add-record'>
            <NewRecord
              user={user}
              genres={genres}
              tooltipText={tooltipText}
              baseUrl={BASE_URL}/>
          </Route>
          <Route
            path='/edit-record/:id'
            render={(props) => 
            <EditRecord {...props}
              genres={genres}
              tooltipText={tooltipText}
              baseUrl={BASE_URL}
            />}
          />
          <Route path="/login">
            <LoginPage
              setCurrentUser={setCurrentUser}
              setViewMode={setViewMode}
              baseUrl={BASE_URL}/>
          </Route>
          <Route path='/create-account'>
            <CreateUserPage baseUrl={BASE_URL}/>
          </Route>
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;