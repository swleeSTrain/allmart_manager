import axios from "axios";

const host = 'http://localhost:8080/api/v1/kakao';

export const getGeoLocation = async (address) => {

    // API 요청
    const res = await axios.get(`${host}/coordinates`, {
        params: { address } // 쿼리 파라미터로 주소 전달
    });

    return res.data;

};
