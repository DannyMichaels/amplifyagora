import React, { useState, createContext, useContext } from 'react';

const CurrentUserContext = createContext();

const useStateValue = () => useContext(CurrentUserContext);

function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState('');

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export { CurrentUserContext, CurrentUserProvider, useStateValue };
