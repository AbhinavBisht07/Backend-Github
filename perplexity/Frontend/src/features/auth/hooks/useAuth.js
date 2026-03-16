import { useDispatch } from "react-redux";
import { setUser, setError, setLoading } from "../auth.slice";
// from API layer :-
import {register, login, getMe} from "../service/auth.api"


export function useAuth(){


    const dispatch = useDispatch()

    async function handleRegister({email, username, password}){
        try {
            dispatch(setLoading(true))
            const data = await register({email, username, password})
            // registeration ke time response mein koi data nahi aega ... bas ek email aega humare address pe .. verify karne ke liye .. 
        } catch(err){
            dispatch(setError(err.response?.data?.message || "Registration failed"));
        }finally{
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({email, password}){
        try{
            dispatch(setLoading(true));
            const data = await login({email, password})
            // issbaar data aarha hoga to user mein set kar denge 
            dispatch(setUser(data.user))
        } catch(err){
            dispatch(setError(err.response?.data?.message || "Login failed"))
        } finally{
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe(){
        try{
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user))
        } catch(err){
            dispatch(setError(err.response?.data?.message || "Failed to fetch user data"))
        } finally{
            dispatch(setLoading(false));
        }
    }

    return {handleRegister, handleLogin, handleGetMe}

}