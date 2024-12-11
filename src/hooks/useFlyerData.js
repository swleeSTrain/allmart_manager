import { ref } from "vue";

export function useFlyerData() {
    const title = ref("");
    const content = ref("");
    const audioFiles = ref([]); // array of audio files
    const attachments = ref([]); // array of image files

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
