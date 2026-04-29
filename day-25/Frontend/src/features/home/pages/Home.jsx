import React from 'react'
import FaceExpression from "../../expression/components/FaceExpression";
import Player from '../components/Player';
import { useSong } from '../hooks/useSong';
import Nav from '../../shared/components/Nav';

const Home = () => {
    const {handleGetSong} = useSong();
    return (
        <>
            <Nav/>
            <FaceExpression 
            onClick={ (expression)=>{ handleGetSong({mood:expression}) } }
            />
            <Player />
        </>

    )
}

export default Home