// Importing API layer
import {getfeed, createPost, likePost, unlikePost} from "../services/post.api"; 
// Importing State layer 
import { useContext, useEffect } from "react";
import { PostContext } from "../post.context";

export const usePost = () => {
    const context = useContext(PostContext);

    const { loading, setLoading, post, setPost, feed, setFeed } = context;

    const handleGetFeed = async () => {
        setLoading(true);
        const data = await getfeed();
        // setFeed(data.posts.reverse());
        setFeed(data.posts);
        setLoading(false);
    }

    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true);
        const data = await createPost(imageFile, caption);
        setFeed([data.post], ...feed); // jo abhi post aayi hai wo daal di and then baaki jitni bhi feed pehle thi wo daaldi ... nayi feed ban gy humari ..
        setLoading(false);
    }

    const handleLike = async (post) => {

        const data = await likePost(post)
        handleGetFeed();

    }
    const handleUnlike = async (post) => {

        const data = await unlikePost(post);
        handleGetFeed();

    }

    useEffect(()=>{
        if(!feed){
            handleGetFeed();
        }
    }, []);

    return {loading, feed, post, handleGetFeed, handleCreatePost, handleLike, handleUnlike};
}