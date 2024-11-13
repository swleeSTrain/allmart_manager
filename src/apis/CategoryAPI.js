import axios from "axios";

const host = 'http://localhost:8080/api/v1/category';

// 등록
export const postAddCategory = async (obj) => {

    const formData = new FormData();
    formData.append('name', obj.name);

    const res = await axios.post(`${host}/add`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // form-data 형식 명시
        }
    });

    return res.data; // 서버에서 반환된 응답 데이터
};
