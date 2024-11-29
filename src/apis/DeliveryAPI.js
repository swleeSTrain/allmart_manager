import tokenAPI from './TokenAPI.js';

const deliveryAPIHost = "http://localhost:8080/api/v1/delivery";

// 배달 상태별 통계 가져오기
export const fetchDeliveryStatusCount = async () => {
    const response = await tokenAPI.get(`${deliveryAPIHost}/status-count`);
    return response.data; // { PENDING: 25, IN_PROGRESS: 10, COMPLETED: 5 }
};

export const fetchOrdersByStatus = async (status) => {
    const response = await tokenAPI.get(`${deliveryAPIHost}/orders-by-status`, {
        params: { status },
    });
    return response.data;
};