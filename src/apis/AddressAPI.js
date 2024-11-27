
import axios from "axios";

// 카카오 주소 API 스크립트 로드
export const loadKakaoPostcodeScript = () => {
    return new Promise((resolve, reject) => {
        if (document.getElementById("kakao-postcode-script")) {
            resolve(); // 이미 스크립트가 로드된 경우
            return;
        }

        const script = document.createElement("script");
        script.id = "kakao-postcode-script";
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.onload = resolve;
        script.onerror = reject;

        document.head.appendChild(script);
    });
};

export const fetchCustomers = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/v1/customer");
        return response.data; // 서버에서 반환된 고객 데이터
    } catch (error) {
        console.error("회원 목록 가져오기 실패:", error);
        throw error;
    }
};



export const registerCustomer = async (customerData) => {
    console.log("Axios 전송 데이터:", customerData);
    return await axios.post("http://localhost:8080/api/v1/customer/register", customerData, {
        headers: {
            "Content-Type": "application/json",
        },
    });

};