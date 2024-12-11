import { ref } from "vue";
import cookie from "js-cookie"
import Cookies from "js-cookie";
import {useMart} from "../store/useMart.js";

export function useFlyerData() {
    const title = ref("");
    const content = ref("");
    const audioFiles = ref([]); // array of audio files
    const attachments = ref([]); // array of image files
    const martId = ref([]);

    const useMart1 = useMart();
    // Prepare data for sending
    const getFlyerData = () => {
        return {
            title: title.value,
            content: content.value,
            audioURL: audioFiles.value.map((file) => file.name),
            attachImages: attachments.value.map((file, index) => ({
                imageURL: file.name,
                ord: index,
            })),
            martId: 1//  쿠키 값이 없을 경우 null로 처리

        };
    };

    return {
        title,
        content,
        audioFiles,
        attachments,
        getFlyerData,
    };
}
