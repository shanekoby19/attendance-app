import { useContext, createContext, useState } from 'react';

const useAuthStore = () => {
    const [authUser, setAuthUser] = useState(null);

    return {
        authUser,
        setAuthUser
    }
}

export const AuthContext = createContext(null);

export const AuthContextProvider = ({children}) => {
    return (
        <AuthContext.Provider value={useAuthStore()}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthUser = () => useContext(AuthContext).authUser;
export const useSetAuthUser = () => useContext(AuthContext).setAuthUser;