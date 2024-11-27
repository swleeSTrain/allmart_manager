<template>
  <div>
    <button type="button" @click="openPostcode" class="search-button">주소 검색</button>
  </div>
</template>

<script>
export default {
  methods: {
    openPostcode() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          // 주소 선택 후 부모 컴포넌트로 데이터 전달
          this.$emit("address-selected", {
            roadAddress: data.roadAddress,
            jibunAddress: data.jibunAddress,
            zonecode: data.zonecode,
          });
        },
      }).open();
    },
  },
  mounted() {
    // Daum 주소 API 스크립트 로드
    if (!window.daum) {
      const script = document.createElement("script");
      script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      document.head.appendChild(script);
    }
  },
};
</script>

<style scoped>
.search-button {
  padding: 10px 20px;
  font-size: 14px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #0056b3;
}
</style>
