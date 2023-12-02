import React, { useState } from 'react';

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: password })
      });

      if (response.ok) {
        // Call onLogin when the login is successful
        onLogin();
      } else {
        // Handle unsuccessful login attempts
        setErrorMessage('Login failed: Incorrect password.');
      }
    } catch (error) {
      console.error('Login error: ${error.message}');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button type="submit">Login</button>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>} {/* Display error message */}
    </form>
  );
}

export default Login;