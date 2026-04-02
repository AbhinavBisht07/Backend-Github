import { useDispatch } from "react-redux";
import { setUser, setError, setLoading, resetAuth } from "../auth.slice";
import { resetChat } from "../../chat/chat.slice";
// from API layer :-
import { register, login, getMe, logout } from "../service/auth.api"


export function useAuth() {


    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
            return data
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Registration failed"))
            throw err // important
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            const data = await login({ email, password })
            // issbaar data aarha hoga to user mein set kar denge 
            dispatch(setUser(data.user))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogout() {
        try {
            dispatch(setLoading(true));
            await logout();
            dispatch(resetAuth()); // wipes user, loading, error
            dispatch(resetChat()); // wipes chats, currentChatId, messages
            window.location.href = "/login";
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Logout failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user))
        } catch (err) {
            if(err.response?.status === 401){
                // not setting error for unauthorized user(not logged in user)
                dispatch(resetAuth());
            } else {
                dispatch(setError(err.response?.data?.message || "Failed to fetch user data"))
            }
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { handleRegister, handleLogin, handleGetMe, handleLogout }
}