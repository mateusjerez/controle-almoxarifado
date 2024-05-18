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

export const transactionin = (product: string, quantity: number, user: string, type: string) => {
    
    return axios.post(API_URL + "transaction", {
        type,
        product,
        quantity,
        user
    }, { headers: authHeader() })
}

export const transactionout = (product: string, quantity: number, stand:string, user: string, type:string) => {
    return axios.post(API_URL + "transaction", {
        type,
        product,
        quantity,
        user,
        stand
    }, { headers: authHeader() })
}

export const getAvailableList = (standIdent: string) => {
    return axios.get(API_URL + "availablelist/" + standIdent)
}

export const getProductList = () => {
    return axios.get(API_URL + "productlist")
}

export const getStandList = () => {
    return axios.get(API_URL + "standlist")
}

export const getStand = (standIdent:string) => {
    return axios.get(API_URL + "stand/" + standIdent)
}