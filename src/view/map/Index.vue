<template>
  <div class="map">
    <el-card>
      <div id="container"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Index">
import { onMounted, onUnmounted, ref, createApp } from "vue";
import { ElMessage } from "element-plus";
import AMapLoader from "@amap/amap-jsapi-loader";
import icon from "@/assets/flashIcon.png";
import { mapList, type MapMarker } from "@/api/modules/map";
import MapInfoWindow from "./components/MapInfoWindow.vue";
import station from "@/assets/station.jpg";

const markersData = ref<MapMarker[]>([]);
const amapKey = import.meta.env.VITE_AMAP_KEY;
let map: any = null;

onMounted(() => {
  if (!amapKey) {
    ElMessage.error("地图服务尚未配置，请联系管理员");
    return;
  }

  AMapLoader.load({
    key: amapKey,
    version: "1.4.15",
    plugins: ["AMap.Scale"],
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 5,
        center: [108.939645, 34.343207],
      });
      mapList().then((res) => {
        if (res.code === 200) {
          markersData.value = res.data;
          const infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -30),
          });
          markersData.value.forEach((markerData) => {
            const marker = new AMap.Marker({
              position: markerData.position,
              icon,
              title: "北京",
            });
            marker.on("click", () => {
              const container = document.createElement("div");
              const app = createApp(MapInfoWindow, {
                data: markerData,
                station,
              });
              app.mount(container);
              infoWindow.setContent(container);
              infoWindow.open(map, marker.getPosition());
            });

            map.add(marker);
          });
        }
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<style scoped>
.map {
  width: 100%;
  height: calc(100% - 60px);
  .el-card {
    width: 100%;
    height: 100%;
    #container {
      padding: 0px;
      margin: 0px;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
