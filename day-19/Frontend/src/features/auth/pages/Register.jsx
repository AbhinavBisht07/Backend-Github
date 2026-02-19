import { Link } from "react-router";
import axios from "axios";
import { useState } from "react";

const Register = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault(); // prevents the page from reloading on form submit ..

        axios.post("http://localhost:3000/api/auth/register",{
                username,
                email,
                password
            },
            {
                withCredentials: true
            })
            .then((res) => {
                console.log(res.data);
            })
    }

    return (
        // <div>Register</div>
        <main>
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        onChange={(e) => { setUsername(e.target.value) }}
                        value={username}
                        type="text"
                        name='username'
                        placeholder='Enter username' />

                    <input
                        onChange={(e) => { setEmail(e.target.value) }}
                        value={email}
                        type="text"
                        name='email'
                        placeholder='Enter email' />

                    <input
                        onChange={(e) => { setPassword(e.target.value) }}
                        value={password}
                        type="password"
                        name='password'
                        placeholder='Enter password' />

                    <button>Register</button>
                </form>

                {/* <p>Already have an account? <a href="/login">Login</a></p> */}
                <p>Already have an account? <Link to='/login' className='toggleAuthForm'>Login</Link> </p>
            </div>
        </main>
    )
}

export default Register