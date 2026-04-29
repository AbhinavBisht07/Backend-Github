import React from 'react'
import "../styles/nav.scss"
import { useNavigate } from 'react-router'

const Nav = () => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <h2>Moodify</h2>
            <div>
                <button
                    onClick={() => { navigate("/upload-songs") }}
                    className='button'>+ New Song</button>

                <button
                    onClick={() => { navigate("/all-songs") }}
                    className='button'>All Songs</button>
            </div>
        </nav>
    )
}

export default Nav