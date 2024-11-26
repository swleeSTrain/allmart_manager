import axios from "axios";

const host = 'http://localhost:8080/api/v1/member';

// 회원가입
export const postSignUp = async (obj) => {

    const res = await axios.post(`${host}/signUp`, obj, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res.data;
};

// 로그인
export const postSignIn = async (obj) => {

    const res = await axios.post(`${host}/makeToken`, obj, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return res.data;
};
//
// // 회원 조회
// export const getCategory = async (categoryID) => {
//
//     const res = await axios.get(`${host}/${categoryID}`);
//
//     return res.data;
// };
//
// // 삭제
// export const deleteCategory = async (categoryID) => {
//
//     const res = await axios.delete(`${host}/${categoryID}`)
//
//     return res.data
// }
//
// // 수정
// export const putEditCategory = async (obj) => {
//
//     const res = await axios.put(`${host}/${obj.categoryID}`, obj, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
//
//     return res.data;
// };


