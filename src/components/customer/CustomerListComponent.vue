<template>
  <div class="customer-list">
    <h1>회원 목록</h1>
    <table>
      <thead>
      <tr>
        <th>번호</th>
        <th>이름</th>
        <th>전화번호</th>
        <th>포인트</th>
        <th>우편번호</th>
        <th>도로명 주소</th>
        <th>상세 주소</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(customer, index) in customers" :key="customer.customerID">
        <td>{{ customer.customerID }}</td>
        <td>{{ customer.name }}</td>
        <td>{{ customer.phoneNumber }}</td>
        <td>{{ customer.loyaltyPoints || '-' }}</td>
        <td>{{ customer.postcode }}</td>
        <td>{{ customer.roadAddress }}</td>
        <td>{{ customer.detailAddress }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { fetchCustomers } from "../../apis/AddressAPI.js";

export default {
  data() {
    return {
      customers: [], // 회원 데이터를 저장할 배열
    };
  },
  async created() {
    try {
      this.customers = await fetchCustomers(); // API 호출하여 데이터 가져오기
    } catch (error) {
      console.error("회원 목록을 가져오는데 실패했습니다.");
    }
  },
};
</script>


<style scoped>
.customer-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.customer-list h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #007bff;
  color: white;
}

th, td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 8px 10px;
  white-space: nowrap; /* 텍스트를 한 줄로 유지 */
  overflow: hidden;
  text-overflow: ellipsis; /* 텍스트가 길면 생략 표시 (...) */
}

tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>