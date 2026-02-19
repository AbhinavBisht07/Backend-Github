import React, { useState } from 'react'
import "../style/form.scss"
import { Link } from "react-router";
import axios from "axios";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        axios.post("http://localhost:3000/api/auth/login", {
            username,
            password
        }, { withCredentials: true })
            .then(res => {
                console.log(res.data);
            })
    }


    return (
        // <div>Login</div>
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        onChange={(e) => { setUsername(e.target.value) }}
                        value={username}
                        type="text"
                        name='username'
                        placeholder='Enter username' />

                    <input
                        onChange={(e) => { setPassword(e.target.value) }}
                        value={password}
                        type='password'
                        name='password'
                        placeholder='Enter password' />
                    <button>Login</button>
                </form>

                <p>Dont have an account? <Link to='/register' className='toggleAuthForm'>Register</Link></p>
            </div>
        </main>
    )
}

export default Login