import axios from "axios";

const API_URL = "http://localhost:8080/api/report/";

export const getStandProduct = (standId: number) => {
    return axios.get(API_URL + "standxproduct/" + standId)

}

export const getStockAlert = () => {
    return axios.get(API_URL + "stockalert")
}