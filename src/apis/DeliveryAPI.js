import axios from 'axios';

const deliveryAPIHost = "http://localhost:8080/api/v1/delivery";

export const fetchDeliveryStatusSummary = async () => {
    try {
        const response = await axios.get(`${deliveryAPIHost}/status-count`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Failed to fetch delivery status counts.');
    }
};

export const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
        await axios.put(`${deliveryAPIHost}/${deliveryId}/status`, null, {
            params: { newStatus }
        });
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Failed to update delivery status.');
    }
};
