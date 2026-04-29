import { createContext } from "react";
import { useState } from "react";

export const SongContext = createContext();


export const SongContextProvider = ({ children }) => {
    const [song, setSong] = useState({
        "url": "https://ik.imagekit.io/abhinav007/moodify/songs/Gehraiyaan_F14bguJzV.mp3",
        "posterUrl": "https://ik.imagekit.io/abhinav007/moodify/posters/Gehraiyaan_qblfEugsT.jpeg",
        "title": "Gehraiyaan",
        "mood": "happy",
    })
    

    const [loading, setLoading] = useState(false);


    return (
        <SongContext.Provider value={{loading, setLoading, song, setSong}}>
            {children}
        </SongContext.Provider>
    )
}