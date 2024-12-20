import tokenAPI from './TokenAPI.js'; // tokenAPI를 가져오기

const host = 'https://allmartsystem.shop/api/v1/orders'

export const getListOrder = async (page, searchParams = {}) => {
    const { keyword, type, orderId } = searchParams;

    const res = await tokenAPI.get(`${host}/list`, {
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

    const res = await tokenAPI.get(`${host}/${orderID}`)

    return res.data
}

// 상태 변경
export const updateOrderStatus = async (orderID, newStatus) => {
    const res = await tokenAPI.put(`${host}/${orderID}/status`, null, {
        params: {
            newStatus: newStatus, // 변경할 상태
        },
    });
    return res.data;
};