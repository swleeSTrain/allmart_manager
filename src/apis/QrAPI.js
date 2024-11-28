import tokenAPI from './TokenAPI.js'; // tokenAPI를 가져오기

const host = '/api/v1/qrcode/generate'

export const generateQRCode = async () => {
    const response = await tokenAPI.get(host);

    return response.data; // QR 코드 URL 반환
};
