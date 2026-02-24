// Importing API layer
import {getfeed} from "../services/post.api"; 
// Importing State layer 
import { useContext } from "react";
import { PostContext } from "../post.context";

export const usePost = () => {
    const context = useContext(PostContext);

    const { loading, setLoading, post, setPost, feed, setFeed } = context;

    const handleGetFeed = async () => {
        setLoading(true);
        const data = await getfeed();
        setFeed(data.posts);
        setLoading(false);
    }

    return {loading, feed, post, handleGetFeed};
}