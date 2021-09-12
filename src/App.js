import { withAuthenticator, AmplifyTheme } from 'aws-amplify-react';
import React from 'react';
import './App.css';

function App() {
  return <div>App</div>;
}

const theme = {
  ...AmplifyTheme,
  navBar: {
    ...AmplifyTheme.navBar,,
    backgroundColor: "#ffc0cb",
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

export default withAuthenticator(App, true, [], null, theme);
