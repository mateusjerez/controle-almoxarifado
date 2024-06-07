import axios from "axios";
import authHeader from "./auth-header";

//const API_URL = "http://localhost:8080/api/report/";
const API_URL = "http://pascom.suzarte.com.br:12782/api/report/";

export const getStandProduct = (standId: number) => {
    return axios.get(API_URL + "standxproduct/" + standId, { headers: authHeader() })

}

export const getStockAlert = () => {
    return axios.get(API_URL + "stockalert", { headers: authHeader() })
}