import React, {useEffect} from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { usePost } from '../hooks/usePost';
import Nav from '../../shared/components/Nav';

const Feed = () => {

    const {loading, feed, handleGetFeed, handleLike, handleUnlike} = usePost();

    useEffect(()=>{
        handleGetFeed();
    }, [])

    if(loading || !feed){
        return (<main><h1>Feed is loading......</h1></main>)
    }

    console.log(feed);

    return (
        <main className='feed-page'>
            <Nav />

            <div className="feed">
                <div className="posts">
                    {feed.map(post=>{
                        return <Post user={post.user} post={post} loading={loading} handleLike={handleLike} handleUnlike={handleUnlike}/>
                    })}
                </div>
            </div>
        </main>
    )
}

export default Feed

