import React, { useState } from 'react'
import "../style/form.scss"
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const {handleLogin, loading} = useAuth();
    const navigate = useNavigate();

    if(loading){
        return (
            <h1>Loading...</h1>
        )
    }

    function handleSubmit(e) {
        e.preventDefault();

        handleLogin(username, password)
        .then(res=>{
            console.log(res);
            navigate("/");
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