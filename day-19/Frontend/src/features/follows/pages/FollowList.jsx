import React from 'react'
import { useNavigate } from 'react-router'
import "../style/followList.scss"

const FollowList = () => {
    const navigate = useNavigate();
    return (
        <main>
            <div className="followList">
                <div className="followers list">
                    <h1>Followers</h1>
                </div>
                <div className="following list">
                    <h1>Following</h1>
                </div>
                <div className="follow-requests list">
                    <h1>Follow Requests</h1>
                </div>
                <div className="others list">
                    <h1>Others</h1>
                </div>

                <button
                onClick={()=>{navigate("/")}} 
                className='closeBtn button primary-button'>Close</button>
            </div>
        </main>
    )
}

export default FollowList