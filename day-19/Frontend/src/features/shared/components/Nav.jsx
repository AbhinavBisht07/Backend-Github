import React from 'react'
import "../style/nav.scss"
import { useNavigate } from 'react-router'


const Nav = () => {
    const navigate = useNavigate();
    return (
        <nav className='navbar'>
            <p>Insta</p>
            <div>
                <button
                    onClick={() => {navigate("/create-post")}}
                    className='button primary-button'>new post</button>

                <button
                onClick={()=>{navigate("/follow-list")}} 
                className='button primary-button'>Follow List</button>
            </div>
        </nav>
    )
}

export default Nav