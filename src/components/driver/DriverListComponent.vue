<template>
  <div class="driver-list">
    <h1>드라이버 리스트</h1>

    <div v-if="loading" class="loading">로딩 중...</div>

    <table v-if="!loading" class="driver-table">
      <thead>
      <tr>
        <th>드라이버 ID</th>
        <th>이름</th>
        <th>최대 배달 건수</th>
        <th>현재 배달 건수</th>
        <th>배달 가능 여부</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="driver in drivers" :key="driver.driverId">
        <td>{{ driver.driverId }}</td>
        <td>{{ driver.name }}</td>
        <td>{{ driver.maxDeliveryCount }}</td>
        <td>{{ driver.currentDeliveryCount }}</td>
        <td>{{ driver.canAcceptDelivery ? '가능' : '불가' }}</td>
      </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button class="pagination-btn" :disabled="page === 1" @click="changePage(page - 1)">이전</button>
      <span class="page-info">페이지 {{ page }}</span>
      <button class="pagination-btn" @click="changePage(page + 1)">다음</button>
    </div>

    <button class="add-driver-btn" @click="moveToAdd">드라이버 추가</button>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getListDriver } from '../../apis/DriverAPI';

export default {
  name: 'DriverList',
  setup() {
    const drivers = ref([]);
    const page = ref(1);
    const loading = ref(false);
    const router = useRouter();

    const fetchDrivers = async () => {
      loading.value = true;
      try {
        const response = await getListDriver();
        drivers.value = response;
      } catch (error) {
        console.error('드라이버 정보를 가져오는 중 오류 발생:', error);
      } finally {
        loading.value = false;
      }
    };

    const changePage = (newPage: number) => {
      page.value = newPage;
      fetchDrivers();
    };

    const moveToAdd = () => {
      const query = {
        page: page.value
      };

      router.push({
        path: '/driver/add',
        query
      });
    };

    onMounted(() => {
      fetchDrivers();
    });

    return {
      drivers,
      page,
      loading,
      fetchDrivers,
      changePage,
      moveToAdd,
    };
  },
};
</script>

<style scoped>
.driver-list {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}
.driver-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.driver-table th {
  background-color: #4CAF50;
  color: white;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  border: 1px solid #ddd;
}
.driver-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}
.driver-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
.driver-table tr:hover {
  background-color: #f1f1f1;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}
.pagination-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.pagination-btn:hover {
  background-color: #45a049;
}
.pagination-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.page-info {
  font-size: 18px;
  color: #333;
  font-weight: bold;
}
.loading {
  text-align: center;
  font-size: 18px;
  color: #666;
}
.add-driver-btn {
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.add-driver-btn:hover {
  background-color: #0056b3;
}
</style>
