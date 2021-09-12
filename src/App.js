import './App.css';
import React, { useState, useEffect } from 'react';
import { Auth, Hub, Logger } from 'aws-amplify';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MarketPage from './pages/MarketPage';
import Navbar from './components/Navbar';
import { useStateValue } from './context/currentUser';

// check withAuthenticator vs Authenticator
export default function App() {
  const { currentUser, setCurrentUser } = useStateValue();

  const alex = new Logger('Alexander_the_auth_watcher');

  const getUserData = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    userData ? setCurrentUser(userData) : setCurrentUser(null);
  };

  alex.onHubCapsule = (capsule) => {
    switch (capsule.payload.event) {
      case 'signIn':
        console.log('signed in');
        getUserData();
        break;
      case 'signUp':
        console.log('signed up');
        break;
      case 'signOut':
        console.log('signed out');
        setCurrentUser(null);
        break;
      default:
        return;
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
    } catch (err) {
      console.error('Error signing out user', err);
    }
  };

  useEffect(() => {
    console.dir(AmplifyTheme);
    getUserData();
    Hub.listen('auth', alex);
  }, []);

  if (!currentUser) {
    return <Authenticator theme={theme} />;
  }

  return (
    <Router>
      <>
        {/* Navbar */}
        <Navbar handleSignOut={handleSignOut} />
        {/* Routes */}
        <div className="app-container">
          <Route exact path="/" component={HomePage} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route path="/markets/:marketId" component={MarketPage} />
        </div>
      </>
    </Router>
  );
}

const theme = {
  ...AmplifyTheme,
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: '#ffc0cb',
  },
  button: {
    ...AmplifyTheme.button,
    // backgroundColor: '#f90',
    backgroundColor: 'var(--amazonOrange)',
  },
  sectionBody: {
    ...AmplifyTheme.sectionBody,
    padding: '5px',
  },
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: 'var(--squidInk)',
  },
};

/*  includeGreetings: true, 
 // Show only certain components
    authenticatorComponents: [MyComponents],
                // display federation/social provider buttons 
                federated: {myFederatedConfig}, 
                // customize the UI/styling
                theme: {myCustomTheme}});*/

// export default withAuthenticator(App, true, [], null, theme);
