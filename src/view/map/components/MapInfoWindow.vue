<template>
  <div class="info-window">
    <div class="info-img">
      <img :src="station" alt="" />
    </div>

    <div class="info-content">
      <h3>{{ data.title }}</h3>

      <p>充电桩数量：{{ data.count }}</p>

      <p>
        充电站状态：
        <span :class="data.status === 1 ? 'using' : 'repair'">
          {{ data.status === 1 ? "使用中" : "维修中" }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    title: string;
    count: number;
    status: number;
  };
  station: string;
}>();
</script>

<style scoped>
.info-window {
  display: flex;
  align-items: center;
  padding: 10px;
  width: 330px;
}

.info-img img {
  width: 120px;
  height: 80px;
  object-fit: cover;
}

.info-content {
  margin-left: 15px;
  line-height: 28px;
}

.info-content h3 {
  margin: 0;
}

.info-content p {
  margin: 0;
}

.using {
  color: #409eff;
}

.repair {
  color: #f56c6c;
}
</style>
