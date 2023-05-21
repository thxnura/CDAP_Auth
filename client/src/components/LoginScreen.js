import React, { useState, useEffect } from 'react';

function checkIsAuth() {
  const url = 'http://localhost:5001/api/isAuth';

  return fetch(url)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('User is not authorized (401 error).');
      }
    });
}

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    
    const url = 'http://localhost:5001/api/login';
    const requestBody = {
      email: username,
      password: password
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      setResponse(JSON.stringify(data));
    } catch (error) {
      setResponse('An error occurred while making the login request.');
      console.error(error);
    }
  };

  useEffect(() => {
    checkIsAuth()
      .then((data) => {
        setResponse(`User is authorized. Email: ${data.email}`);
      })
      .catch((error) => {
        setResponse(error.message);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkIsAuth()
        .then((data) => {
          setResponse(`User is authorized. Email: ${data.email}`);
        })
        .catch((error) => {
          setResponse(error.message);
        });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <div>{response}</div>
    </div>
  );
}

export default LoginScreen;
