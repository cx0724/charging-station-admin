import * as echarts from "echarts";
import { onMounted, onBeforeUnmount, nextTick, ref, type Ref } from "vue";
// chartRef DOM元素
// setChartData 数据
export function useEcharts(
  chartRef: Ref<HTMLElement | null>,
  setChartData: any,
) {
  const myChart = ref<echarts.ECharts | null>(null);

  let resizeObserver: ResizeObserver | null = null;

  const initChart = async () => {
    await nextTick();
    if (!chartRef.value) return;
    myChart.value = echarts.init(chartRef.value);
    myChart.value.setOption(await setChartData());

    // 监听图表容器尺寸变化
    resizeObserver = new ResizeObserver(() => {
      myChart.value?.resize();
    });
    resizeObserver.observe(chartRef.value);
  };

  onMounted(() => {
    initChart();
  });

  onBeforeUnmount(() => {
    // 停止监听
    resizeObserver?.disconnect();

    // 销毁 ECharts
    myChart.value?.dispose();
    myChart.value = null;
  });
}
