import tokenAPI from './TokenAPI.js'; // tokenAPI를 가져오기

const host = 'http://localhost:8080/api/v1/qrcode/generate'

export const generateQRCode = async () => {

    const response = await tokenAPI.get(host);

    console.log(response.data);

    return response.data; // QR 코드 URL 반환
};
