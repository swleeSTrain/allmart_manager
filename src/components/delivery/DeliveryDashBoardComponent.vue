<template>
  <div class="dashboard-container">
    <h1 class="title">Delivery Status Dashboard</h1>

    <div class="status-summary">
      <div
          v-for="(count, status) in deliveryStatusSummary"
          :key="status"
          class="status-card"
      >
        <h2>{{ statusMap[status] }}</h2> <!-- 한글 상태로 변환 -->
        <p>{{ count }}</p>
      </div>
    </div>

    <div class="update-status">
      <h2>Update Delivery Status</h2>
      <form @submit.prevent="handleUpdateStatus">
        <input
            v-model="updateForm.deliveryId"
            type="text"
            placeholder="Delivery ID"
        />
        <select v-model="updateForm.newStatus">
          <option v-for="(label, status) in statusMap" :key="status" :value="status">
            {{ label }}
          </option>
        </select>
        <button type="submit">Update</button>
      </form>
    </div>
  </div>
</template>

<script>
import { fetchDeliveryStatusSummary, updateDeliveryStatus } from "../../apis/DeliveryAPI";

export default {
  data() {
    return {
      deliveryStatusSummary: {}, // 영어 상태값과 매핑된 카운트
      updateForm: {
        deliveryId: "",
        newStatus: "", // 영어 상태값으로 전달
      },
      statusMap: {
        PENDING: "배달대기중",
        START: "배달시작",
        IN_PROGRESS: "배달중",
        COMPLETED: "완료",
        CANCELLED: "취소",
      },
    };
  },
  methods: {
    async fetchData() {
      try {
        this.deliveryStatusSummary = await fetchDeliveryStatusSummary();
      } catch (error) {
        alert("Failed to fetch delivery status summary.");
      }
    },
    async handleUpdateStatus() {
      const { deliveryId, newStatus } = this.updateForm;
      if (!deliveryId || !newStatus) {
        alert("Both Delivery ID and Status are required!");
        return;
      }
      try {
        await updateDeliveryStatus(deliveryId, newStatus); // 영어 상태값 전달
        alert("Status updated successfully!");
        this.fetchData();
      } catch (error) {
        alert("Failed to update status.");
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
.dashboard-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  text-align: center;
  color: #4a90e2;
  margin-bottom: 20px;
}

.status-summary {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.status-card {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  width: 150px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.status-card h2 {
  font-size: 1.2rem;
  color: #4a90e2;
}

.status-card p {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.update-status {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.update-status h2 {
  color: #4a90e2;
  margin-bottom: 10px;
}

form {
  display: flex;
  gap: 10px;
}

input,
select,
button {
  padding: 10px;
  font-size: 1rem;
}

button {
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #357ab8;
}
</style>
