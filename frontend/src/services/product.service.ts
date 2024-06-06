import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/product/";
//const API_URL = "http://pascom.suzarte.com.br:12782/api/product/";

export const addproduct = (name: string, stands: Array<String>, unit: string) => {
    return axios.post(API_URL + "productadd", {
        name,
        stands,
        unit
    }, { headers: authHeader() })
}

export const transaction = (product: string, quantity: number, stand:number, user: string, type: string) => {
    
    return axios.post(API_URL + "transaction", {
        type,
        product,
        quantity,
        user,
        stand
    }, { headers: authHeader() })
}

export const getAvailableList = (standIdent: string) => {
    return axios.get(API_URL + "availablelist/" + standIdent, { headers: authHeader() })
}

export const getProductList = () => {
    return axios.get(API_URL + "productlist", { headers: authHeader() })
}

export const getStandList = () => {
    return axios.get(API_URL + "standlist", { headers: authHeader() })
}

export const getStand = (standIdent:string) => {
    return axios.get(API_URL + "stand/" + standIdent, { headers: authHeader() })
}