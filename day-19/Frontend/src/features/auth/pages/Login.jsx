import React, {useState} from 'react'
import "../style/form.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from '../hooks/useAuth';

const Login = () => {

    const { user, loading, handleLogin } = useAuth();

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        await handleLogin(username, password)

        navigate("/");
        // console.log("User logged in.");
    }

    // rendering the loading state :-
    if(loading){
        return (
            <main>
                <h1>Loading......</h1>
            </main>
        )
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        onChange={(e) => { setUsername(e.target.value) }}
                        value={username}
                        type="text"
                        name='username'
                        id='username'
                        placeholder='Enter username' />

                    <input
                        onChange={(e) => { setPassword(e.target.value) }}
                        value={password}
                        type="password"
                        name='password'
                        id='password'
                        placeholder='Enter password' />

                    <button className='button primary-button'>Login</button>
                </form>

                <p>Don't have an account? <Link to={"/register"}>Create One.</Link> </p>
            </div>
        </main>
    )
}

export default Login