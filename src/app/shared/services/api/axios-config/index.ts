import Axios from "axios";

import { responseInterceptor, errorInterceptor } from "./interceptors";
import { Environment } from "@/app/shared/environment";

const Api = Axios.create({
    baseURL: Environment.URL_BASE
});

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error),
);

export { Api };