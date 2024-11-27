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
  </div>
</template>

<script>
import AddressSearchComponent from "../../components/address/AddressSearchComponent.vue";
import { registerCustomer } from "../../apis/AddressAPI.js";

export default {
  components: {
    AddressSearchComponent,
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
      },
    };
  },
  methods: {
    setAddress(address) {
      this.customer.postcode = address.zonecode;
      this.customer.roadAddress = address.roadAddress;
      this.customer.fullAddress = `${address.roadAddress} ${this.customer.detailAddress}`;
    },
    // 폼 초기화 메서드
    resetForm() {
      this.customer = {
        name: "",
        phoneNumber: "",
        postcode: "",
        roadAddress: "",
        detailAddress: "",
        fullAddress: "",
      };
    },
    async registerCustomer() {
      try {
        const response = await registerCustomer(this.customer);
        alert("고객 등록 완료!");
        console.log(response);
        this.resetForm(); // 성공 시 폼 초기화
      } catch (error) {
        console.error("고객 등록 실패:", error);
        alert("고객 등록에 실패했습니다.");
      }
    },
  },
  watch: {
    // 상세 주소 변경 시 전체 주소 업데이트
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
