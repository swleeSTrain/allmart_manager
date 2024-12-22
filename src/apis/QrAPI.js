import tokenAPI from './TokenAPI.js'; // tokenAPI를 가져오기

const host = 'https://allmartsystem.shop/api/v1/qrcode/generate';
// const host = 'http://localhost:8080/api/v1/qrcode/generate';

export const generateQRCode = async (martID) => {
    if (!martID) {
        throw new Error("martID가 제공되지 않았습니다."); // martID 유효성 검사
    }

    const response = await tokenAPI.get(`${host}?martID=${martID}`);
    console.log(response.data);

    return response.data; // QR 코드 URL 반환
};
