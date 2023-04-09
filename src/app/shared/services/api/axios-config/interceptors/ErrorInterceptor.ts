import { AxiosError } from "axios";

export const errorInterceptor = (error: AxiosError) => {
    if (error.message === "Network Error" && !error.response) {
        return Promise.reject("Error de conexão");
    }
    if (error.response?.status === 404) {
        return Promise.reject("Página não encontrada");
    }
    
    return Promise.reject(error);
};
