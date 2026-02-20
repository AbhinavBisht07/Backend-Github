import { createContext, useState, useEffect } from "react";

import { register, login, getMe } from "./services/auth.api"; // jo teen functions banaye the auth.api.js mein wo import kar denge ...


export const AuthContext = createContext();

export function AuthProvider( {children} ) {
    const [user, setUser] = useState(null); // null isliye rahega kyuki starting mein koi bhi user logged in nahi rehta hai 
    const [loading, setLoading] = useState(false);

    const handleLogin = async (username, password) => {
        setLoading(true); // jab user ko login kara denge hum... to starting mein loading wali state dikh rahi hogi ... fir neeche await ke baad jo bhi response aega (user login hua ya nahi) uske ooper depend karega kya dikhega humko ...

        try{
            const response = await login(username, password); //login function chala diya auth.api.js wala 
            // response mein jo bhi user aega usko set kar denge setUser mein :-
            setUser(response.user);
        }
        catch(err){ //agar kuch error arha hoga to log kkara denge error ko 
            console.log(err);
        }
        // finally hum loading state hata denge .. chaahe response mein user login hua ho ya kuch error aya ho doesnt matter ...
        finally{ 
            setLoading(false);
        }
    }

    const handleRegister = async (username, email, password)=>{
        setLoading(true); // starting mein loading state .. while server is trying to reistering user ...

        try{
            const response = await register(username, email, password)
            // await ke baad kuch response aega ... response mein jo bhi user aega usko hum user state mein set kar denge ...
            setUser(response.user);
        }
        catch(err){ 
            console.log(err)
        }
        finally{
            setLoading = false;
        }
    }

    return (
        <AuthContext.Provider value={ {user, loading, handleLogin, handleRegister} }>
            {children}
        </AuthContext.Provider>
    )
}