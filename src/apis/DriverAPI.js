import tokenAPI from './TokenAPI.js'; // tokenAPI를 가져오기

const host = 'http://localhost:8080/api/v1/driver'

export const getListDriver = async () => {


    const res = await tokenAPI.get(`${host}/list`);

    return res.data;
};

export const addDriver = async (name, maxDeliveryCount) => {
    const res = await tokenAPI.post(`${host}/add`, {
        name,
        maxDeliveryCount,
    });
    return res.data;
};