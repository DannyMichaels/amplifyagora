import React, { useState, useEffect } from 'react';
import { Auth, Hub, Logger } from 'aws-amplify';
import { Authenticator, AmplifyTheme } from 'aws-amplify-react';
import './App.css';

// check withAuthenticator vs Authenticator
export default function App() {
  const [user, setUser] = useState(null);

  const alex = new Logger('Alexander_the_auth_watcher');

  const getUserData = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    userData ? setUser(userData) : setUser(null);
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
        setUser(null);
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    console.dir(AmplifyTheme);
    getUserData();
    Hub.listen('auth', alex);
  }, []);

  if (!user) {
    return <Authenticator theme={theme} />;
  }

  return <div>App</div>;
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
