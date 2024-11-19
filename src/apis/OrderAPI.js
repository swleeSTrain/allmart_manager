import axios from "axios";

const host = 'http://localhost:8080/api/v1/orders'

export const getListOrder = async (page, searchParams = {}) => {
    const { keyword, type, orderId } = searchParams;

    const res = await axios.get(`${host}/list`, {
        params: {
            page: page,
            size: 10,
            keyword: keyword || null,
            type: type || null,
            orderId: orderId || null,
        },
    });

    return res.data;
};

// 조회
export const getReadOrder = async (orderID) => {

    const res = await axios.get(`${host}/${orderID}`)

    return res.data
}