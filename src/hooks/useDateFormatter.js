
const useDateFormatter = () => {

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based index, so add 1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0'); // 시
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 분

        return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
    };


    return { formatDate };
};

export default useDateFormatter;