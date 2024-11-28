import axios from 'axios';

const host = 'http://localhost:8080/api/v1/mart';

export const getListMart = async (page, searchParams = {}) => {

    const { keyword, type } = searchParams;

    try {
        const res = await axios.get(`${host}/list`, {
            params: {
                page: page,
                size: 10,
                keyword: keyword || null,
                type: type || null,
            },
        });

        return res.data;

    } catch (error) {
        console.error('API 호출 에러:', error);
        throw error;
    }
};
