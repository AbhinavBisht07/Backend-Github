import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:3000",
//     withCredentials: true,
// })
const api = axios.create({
    baseURL: "https://perplexity-clone-9lkm.onrender.com",
    withCredentials: true,
})


export async function register({email, username, password}){

    const response = await api.post("/api/auth/register", {email, username, password})
    return response.data
}

export async function login({email, password}){
    const response = await api.post("/api/auth/login", {email,password})
    return response.data;
}


export async function logout(){
    const response = await api.post("/api/auth/logout");
    return response.data;
}


export async function getMe(){
    const response = await api.get("/api/auth/get-me")
    return response.data;
}

// email bhejne wali api(/verify-email) ko integrate karne ki jarurat nahi hai ... wo purely backend se kaam karti hai ..