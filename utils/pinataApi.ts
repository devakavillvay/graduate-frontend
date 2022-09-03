import axios from "axios";

const pinataApi = axios.create({
    baseURL: "https://api.pinata.cloud/pinning",
});

pinataApi.interceptors.request.use(
    async (request: any) => {
        try {
            request.headers.common.Authorization = `Bearer ${process.env.PINATA_JWT}`;
        } catch (error) {
            console.log("axiosApiInstance-try-cathc", error);
        }
        return request;
    },
    (error) => {
        Promise.reject(error);
    }
);

export { pinataApi };
