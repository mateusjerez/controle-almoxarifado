import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/product/";

export const addproduct = (name: string, stands: Array<String>, unit: string) => {
    return axios.post(API_URL + "productadd", {
        name,
        stands,
        unit
    }, { headers: authHeader() })
}

export const transactionin = (product: string, quantity: number, user: string) => {
    const type = "IN";

    return axios.post(API_URL + "transactionin", {
        type,
        product,
        quantity,
        user
    }, { headers: authHeader() })
}

export const getList = () => {
    return axios.get(API_URL + "list")
}