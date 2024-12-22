<template>
  <div class="customer-register">
    <h1>고객 등록</h1>
    <form @submit.prevent="registerCustomer" class="form">
      <div class="form-group">
        <label for="name">이름:</label>
        <input type="text" v-model="customer.name" id="name" placeholder="이름을 입력하세요" required />
      </div>
      <div class="form-group">
        <label for="phoneNumber">전화번호:</label>
        <input type="text" v-model="customer.phoneNumber" id="phoneNumber" placeholder="010-1234-5678" required />
      </div>
      <div class="form-group">
        <label>주소 검색:</label>
        <AddressSearchComponent @address-selected="setAddress" />
      </div>
      <div class="form-group">
        <label for="postcode">우편번호:</label>
        <input type="text" v-model="customer.postcode" id="postcode" readonly />
      </div>
      <div class="form-group">
        <label for="roadAddress">도로명 주소:</label>
        <input type="text" v-model="customer.roadAddress" id="roadAddress" readonly />
      </div>
      <div class="form-group">
        <label for="detailAddress">상세 주소:</label>
        <input type="text" v-model="customer.detailAddress" id="detailAddress" placeholder="상세 주소를 입력하세요" />
      </div>
      <div class="form-group">
        <label for="fullAddress">전체 주소:</label>
        <input
            type="text"
            v-model="customer.fullAddress"
            id="fullAddress"
            readonly
            placeholder="자동으로 입력됩니다"
        />
      </div>
      <button type="submit" class="submit-button">등록</button>
    </form>

    <QrCodeModal
        v-if="isQrCodeModalOpen"
        :qrCodeUrl="qrCodeUrl"
        @close="isQrCodeModalOpen = false"
    />
  </div>
</template>

<script>
import Swal from "sweetalert2";
import AddressSearchComponent from "../../components/address/AddressSearchComponent.vue";
import { registerCustomer } from "../../apis/AddressAPI.js";
import { generateQRCode } from "../../apis/QrAPI.js"; // QR 코드 API 호출 함수
import QrCodeModal from "../qr/QrCodeModal.vue"; // QR 코드 모달 컴포넌트
import { useMart } from "../../store/useMart.js";
import {useRouter} from "vue-router";

const router = useRouter();

export default {
  components: {
    AddressSearchComponent,
    QrCodeModal,
  },
  data() {
    return {
      customer: {
        name: "",
        phoneNumber: "",
        postcode: "",
        roadAddress: "",
        detailAddress: "",
        fullAddress: "",
        martID: null,
      },
      isQrCodeModalOpen: false, // QR 코드 모달 상태
      qrCodeUrl: "", // QR 코드 URL 저장
    };
  },
  methods: {
    setAddress(address) {
      this.customer.postcode = address.zonecode;
      this.customer.roadAddress = address.roadAddress;
      this.customer.fullAddress = `${address.roadAddress} ${this.customer.detailAddress}`;
    },
    resetForm() {
      this.customer = {
        name: "",
        phoneNumber: "",
        postcode: "",
        roadAddress: "",
        detailAddress: "",
        fullAddress: "",
        martID: null,
      };
    },
    async registerCustomer() {
      try {
        const martStore = useMart();
        this.customer.martID = martStore.martID;
        const response = await registerCustomer(this.customer);


        Swal.fire({
          icon: "success",
          title: "등록 완료 !!!",
          text: "고객이 성공적으로 등록되었습니다.",
        }).then(async () => {
          this.resetForm();

          // QR 코드 생성 API 호출
          const qrResponse = await generateQRCode(martStore.martID);
          this.qrCodeUrl = qrResponse; // QR 코드 URL 저장
          this.isQrCodeModalOpen = true; // QR 코드 모달 열기
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "오류 발생",
          text: error.response?.data?.message || "고객을 등록하는 도중 오류가 발생했습니다.",
        });
      }
    },
  },
  watch: {
    "customer.detailAddress"(newDetail) {
      this.customer.fullAddress = `${this.customer.roadAddress} ${newDetail}`;
    },
  },
};
</script>


<style scoped>
/* 컨테이너 스타일 */
.customer-register {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 제목 스타일 */
.customer-register h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

/* 폼 스타일 */
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 폼 그룹 스타일 */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* 레이블 스타일 */
.form-group label {
  font-weight: bold;
  color: #555;
}

/* 인풋 필드 스타일 */
.form-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

/* 버튼 스타일 */
.submit-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 버튼 hover 스타일 */
.submit-button:hover {
  background-color: #0056b3;
}
</style>
