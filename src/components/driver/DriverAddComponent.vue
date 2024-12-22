<template>
  <div class="add-driver">
    <h1>드라이버 추가</h1>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="name">이름</label>
        <input
            type="text"
            id="name"
            v-model="driver.name"
            placeholder="드라이버 이름을 입력하세요"
            required
        />
      </div>
      <div class="form-group">
        <label for="maxDeliveryCount">최대 배달 건수</label>
        <input
            type="number"
            id="maxDeliveryCount"
            v-model="driver.maxDeliveryCount"
            placeholder="최대 배달 건수를 입력하세요"
            required
            min="1"
        />
      </div>
      <button type="submit" class="submit-btn">드라이버 추가</button>
    </form>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { addDriver } from '../../apis/DriverAPI';

export default {
  name: 'AddDriver',
  setup() {
    const driver = ref({
      name: '',
      maxDeliveryCount: 1,
    });

    const successMessage = ref('');
    const errorMessage = ref('');

    const handleSubmit = async () => {
      successMessage.value = '';
      errorMessage.value = '';

      try {
        const response = await addDriver(driver.value.name, driver.value.maxDeliveryCount);
        successMessage.value = `드라이버 ${response.name}가 추가되었습니다!`;
        driver.value = { name: '', maxDeliveryCount: 1 };
      } catch (error) {
        errorMessage.value = '드라이버 추가 중 오류가 발생했습니다.';
        console.error(error);
      }
    };

    return {
      driver,
      successMessage,
      errorMessage,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.add-driver {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover {
  background-color: #45a049;
}

.success-message {
  margin-top: 15px;
  color: green;
  text-align: center;
}

.error-message {
  margin-top: 15px;
  color: red;
  text-align: center;
}
</style>
