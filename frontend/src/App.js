import React, { useEffect, useState } from 'react';
import Login from './login.js';
import WrestlerList from './WrestlerList';
import WrestlerForm from './WrestlerForm';

/*
TODO: 
Make a css file for the frontend to make it less ugly
*/
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') === 'true');
  const [wrestlers, setWrestlers] = useState([]);

  const fetchWrestlers = async () => {
    try {
      const response = await fetch('http://localhost:5000/wrestlers');
      if (response.ok) {
        const data = await response.json();
        setWrestlers(data);
      } else {
        console.error('Failed to fetch wrestlers');
      }
    } catch (error) {
      console.error('Error fetching wrestlers:', error);
    }
  };

  useEffect(() => {
    fetchWrestlers();
  }, []);

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
          <WrestlerForm onAddWrestler={fetchWrestlers} />
          <WrestlerList wrestlers={wrestlers} />
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        </>
      )}
    </div>
  );
}

export default App;