import { ref } from "vue";
import { registerCustomer } from "../apis/AddressAPI.js";
import { getQrCodeData, simulateQrCodeScan, listenForQrCodeScan } from "../apis/QRAPI.js";

export function useCustomerRegister() {
    const customer = ref({
        name: "",
        phoneNumber: "",
        postcode: "",
        roadAddress: "",
        detailAddress: "",
        fullAddress: "",
    });

    const qrCodeId = ref(null);
    const qrCodeImage = ref("");
    const showModal = ref(false);

    const resetForm = () => {
        customer.value = {
            name: "",
            phoneNumber: "",
            postcode: "",
            roadAddress: "",
            detailAddress: "",
            fullAddress: "",
        };
    };

    const register = async () => {
        try {
            const response = await registerCustomer(customer.value);

            if (response.status === "success") {
                qrCodeId.value = response.qrCodeId;
                qrCodeImage.value = `/api/v1/qrcode/${qrCodeId.value}`;
                showModal.value = true;
            } else {
                throw new Error("회원 등록 실패");
            }
        } catch (error) {
            console.error("회원 등록 실패:", error);
            alert("회원 등록 중 오류가 발생했습니다.");
        }
    };

    const listenForScan = () => {
        listenForQrCodeScan(qrCodeId.value, () => {
            alert("QR 코드 스캔 완료!");
            showModal.value = false;
        });
    };

    const simulateScan = async () => {
        try {
            await simulateQrCodeScan(qrCodeId.value);
            alert("QR 코드 스캔 완료 이벤트 전송 성공!");
        } catch (error) {
            console.error("QR 코드 스캔 이벤트 실패:", error);
            alert("QR 코드 스캔 이벤트 전송 중 오류가 발생했습니다.");
        }
    };

    const closeModal = () => {
        showModal.value = false;
    };

    return {
        customer,
        qrCodeImage,
        showModal,
        register,
        resetForm,
        listenForScan,
        simulateScan,
        closeModal,
    };
}
