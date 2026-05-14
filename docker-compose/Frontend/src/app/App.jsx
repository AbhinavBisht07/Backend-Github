import { useState, useEffect } from 'react'
import axios from "axios";

import './App.css'

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const response = axios.get('/api/users')
    .then(response => {
      setUsers(response.data);
    })
  }, []);

  return (
    <div className="App">
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App
