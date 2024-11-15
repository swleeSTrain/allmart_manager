import axios from "axios";

const host = 'http://localhost:8080/api/v1/orders'

export const getListOrder = async (page, searchParams = {}) => {
    const { keyword, customerId, orderId } = searchParams;

    const res = await axios.get(`${host}/list`, {
        params: {
            page: page,
            size: 10,
            keyword: keyword || null,
            type: customerId || null,
            orderId: orderId || null,
        },
    });

    return res.data;
};