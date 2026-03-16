import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({children}) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if(loading){
        return <div><h1>Loading...</h1></div>
    }

    // agar user logged in nahi hoga to ye by default login page pe patak dega user ko
    if(!user){
        // return <div><h1>You must be logged in to access this page</h1></div>
        return <Navigate to="/login" replace/>
    }

  return children
}

export default Protected