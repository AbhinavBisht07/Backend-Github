import { useContext } from "react";
import { AuthContext } from "../auth.context";

import { login, register, getMe } from "../services/auth.api";


export const useAuth = ()=>{

    const context = useContext(AuthContext);

    const {user, setUser, loading, setLoading} = context

    // pehle bhi create kare the ye functions bas location change kardi inki humne ...hook layer mein laagye inko ...
    // pehle ye poora code STATE layer mein likh rahe the ... par iss baar state layer mein humne handleLogin/handleRegister bnaya hi nahi notice karna(bas user and loading wala data bnaya hai) ... 
    const handleLogin = async (username, password)=>{

        setLoading(true)

        const response = await login(username, password);
        // humari ye api response mien 2 cheezein bhejti thi yaad karna : ek to message (ki user logged in successfully) and doosra user ka data "user" field ke andar ... to wahi set karenge yahan pe.
        setUser(response.user);

        setLoading(false);
    }

    const handleRegister = async (username, email, password)=>{
        setLoading(true); //state layer ka use karke .. loading state ko manage kar ra hook

        const response = await register(username, email, password) //api ayer ka use karke ...api ko call kr ra hook and response ko manage kar ra..
        setUser(response.user); //user state ko manage kar ra hook

        setLoading(false); 
    }

    return{
        user, loading, handleLogin, handleRegister
    } //jahan pe bhi hum useAuth() funtion ka use karenge wahan pe useAuth 4 data return karwa dega : user, loading, handleLogin and handleRegister ..
}
// we can see how hook layer manages(orchestrates) both state and api layers..