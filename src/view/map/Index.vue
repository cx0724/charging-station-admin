<template>
  <div class="map">
    <el-card>
      <div id="container"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Index">
import { onMounted, onUnmounted, ref, createApp } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import icon from "@/assets/flashIcon.png";
import { mapList } from "@/api/modules/map";
import MapInfoWindow from "./components/MapInfoWindow.vue";
import station from "@/assets/station.jpg";
const markersData = ref([]);
let map: any = null;

onMounted(() => {
  AMapLoader.load({
    key: "	Q33BZ-RZZ6V-BELPI-UMGPT-325OE-WIFFQ", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 5, // 初始化地图级别
        center: [108.939645, 34.343207], // 初始化地图中心点位置
      });
      mapList().then((res) => {
        if (res.code === 200) {
          markersData.value = res.data;
          //创建信息窗体
          const infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -30),
          });
          markersData.value.forEach((markerData: any) => {
            const marker = new AMap.Marker({
              position: markerData.position,
              icon,
              title: "北京",
            });
            marker.on("click", () => {
              // 创建一个 DOM 容器
              const container = document.createElement("div");
              // 创建 Vue 组件实例
              const app = createApp(MapInfoWindow, {
                data: markerData,
                station,
              });
              // 挂载到容器
              app.mount(container);
              // 设置 InfoWindow 内容
              infoWindow.setContent(container);
              // 打开 InfoWindow
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
