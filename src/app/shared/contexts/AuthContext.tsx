import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { AuthService } from "../services/api/auth/AuthService";


interface AuthContextData {
    isAuthenticaded: boolean;
    logout: () => void;
    login: (email: string, password: string) => Promise<string | void>;
}

const AuthContext = createContext({} as AuthContextData);

const LOCAL_STOREGE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string>();

    useEffect(() => {
        if (accessToken) {
            setAccessToken(accessToken);
        } else {
            setAccessToken(undefined);
        }
    }, [accessToken]);

    const handleLogin = useCallback(async (email: string, password: string) => {
        const result = await AuthService.auth(email, password);

        if (result instanceof Error) {
            return result.message;
        } else {
            setAccessToken(result.accessToken);
        }
    }, []);

    const handleLogout = useCallback(() => {
        setAccessToken(undefined);
    }, []);

    const isAuthenticaded = useMemo(() => !!accessToken, [accessToken]);

    return (
        <AuthContext.Provider value={{ 
            isAuthenticaded,
            login: handleLogin,
            logout: handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);