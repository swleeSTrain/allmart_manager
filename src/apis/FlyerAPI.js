import axios from "axios";



export const registerFlyers = async(dataToSend) => {


    try {
        const host = "https://allmartsystem.shop";
        // const host = "http://localhost:8080";
        const response = await axios.post(`${host}/api/v1/flyer/register`, dataToSend,
            {
                headers: { 'Content-Type': 'application/json' }
                ,withCredentials: true
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

export const getFlyerData = async( page = 1) => {
    try{
        const host = "https://allmartsystem.shop";
        // const host = "http://localhost:8080";
        const response = await axios.get(`${host}/api/v1/flyer/list/system`,
            {
                params : { page },
                headers: { 'Content-Type': 'application/json' }
                ,withCredentials: true
            });
        if(response.status === 200) {
            alert(`Flyer 리스트 조회 성공 : ${response.data}`);
        }else{
            alert(`Flyer list 조회 실패`);
        }

        return response;
    }catch(error) {
        console.error(`Flyer list 조회 중 에러 발생 `, error);
    }
}

export const getMartFlyerData = async( page = 1) => {
    try{
        const martId = 1;
        const host = "https://allmartsystem.shop";
        const response = await axios.get(`${host}/api/v1/${martId}/flyer/list`,
            {
                params : { page },
                headers: { 'Content-Type': 'application/json' }
                ,withCredentials: true
            });
        if(response.status === 200) {
            alert(`Flyer 리스트 조회 성공 : ${response.data}`);
        }else{
            alert(`Flyer list 조회 실패`);
        }

        return response;
    }catch(error) {
        console.error(`Flyer list 조회 중 에러 발생 `, error);
    }
}