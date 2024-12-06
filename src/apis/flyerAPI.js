import axios from "axios";



export const registerFlyers = async(dataToSend) => {


    try {
        const host = "http://localhost:8080";
        const response = await axios.post(`${host}/api/v1/flyer/register`, dataToSend,
            {
                headers: { 'Content-Type': 'application/json' }
            });

        if (response.status === 200) {
            alert(`Flyer 등록 성공! ID: ${response.data}`);
        } else {
            alert('Flyer 등록 실패!');
        }

        return response;
    } catch (error) {
        console.error('Flyer 등록 중 에러 발생:', error);
    }


}
