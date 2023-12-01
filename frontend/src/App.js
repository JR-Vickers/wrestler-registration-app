import React, { useState } from 'react';
import Login from './login.js';
import WrestlerList from './WrestlerList';
import WrestlerForm from './WrestlerForm';

/*
TODO: 
I want the WrestlerList to update automatically 
after entering a new wrestler, without needing to manually
refresh the page.

Make a css file for the frontend to make it less ugly
*/
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') === 'true');

  const handleLoginSuccess = () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <h1>Wrestling Tournament Registration</h1>
      {!isLoggedIn ? (
        <Login onLogin={handleLoginSuccess} />
      ) : (
        <>
          <WrestlerForm />
          <WrestlerList />
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        </>
      )}
    </div>
  );
}

export default App;