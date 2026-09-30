<template>
  <div class="dashboard">
    <el-row :gutter="20" class="dashboard-row">
      <el-col :span="18" class="main-col">
        <!-- 今日设备运行状态 -->
        <el-card class="equipment-card">
          <template #header>
            <div class="card-header">
              <span>今日设备运行状态</span>
            </div>
          </template>
          <div class="equipment">
            <div
              class="item"
              v-for="(item, index) in equipmentStatusList"
              :key="index"
            >
              <h4 class="mt mb">{{ item.name }}</h4>
              <img :src="item.img" style="width: 45px" />
              <h1>{{ item.quantity }}</h1>
              <div class="statistic-card">
                <el-statistic :value="item.exception">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      异常设备
                      <el-tooltip
                        effect="dark"
                        :content="`前有${item.exception}台设备异常，请尽快处理`"
                      >
                        <el-icon style="margin-left: 4px" :size="12">
                          <Warning />
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-statistic>
                <div class="statistic-footer">
                  <div class="footer-item">
                    <span>相较昨日</span>
                    <span>
                      <span class="comparison">{{ item.comparison }}</span>
                      <el-icon :color="item.isState ? 'red' : 'green'">
                        <CaretTop />
                      </el-icon>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <!-- 能源统计 -->
        <el-card class="energy-card mt">
          <template #header>
            <div class="card-header">
              <span>能源统计</span>
            </div>
          </template>
          <el-row class="energy-row">
            <el-col :span="8">
              <div ref="chartRef" style="width: 100%; height: 100%"></div>
            </el-col>
            <el-col :span="16">
              <div ref="chartRef2" style="width: 100%; height: 100%"></div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6" class="main-col">
        <el-card class="profit-card">
          <template #header>
            <div class="card-header">
              <span>营收统计表</span>
            </div>
          </template>
          <ul class="ranking-list">
            <li
              class="ranking-item"
              v-for="(item, index) in profitList"
              :key="index"
            >
              <span class="rank">{{ index + 1 }}</span>
              <span class="store-name">{{ item.name }}</span>
              <span class="sales">{{ item.sales }}</span>
              <span style="margin-left: 50px">
                {{ item.percentage }}
                <el-icon :color="item.color">
                  <CaretTop />
                </el-icon>
              </span>
            </li>
          </ul>
        </el-card>
        <el-card class="energy-card mt">
          <template #header>
            <div class="card-header">
              <span>设备总览</span>
            </div>
          </template>
          <el-row class="energy-row">
            <div ref="chartRef3" style="width: 100%; height: 100%"></div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="index">
import flash from "@/assets/flash.png";
import flash2 from "@/assets/flash2.png";
import flash3 from "@/assets/flash3.png";
import { useEcharts } from "@/hooks/useEcharts";
import { chartData, chartData2, chartData3 } from "@/api/modules/dashboard";
import { ref, reactive } from "vue";
const equipmentStatusList = ref([
  {
    name: "充电桩使用率",
    quantity: "2263 / 3398",
    exception: 9,
    img: flash,
    comparison: "15%",
    isState: true,
  },
  {
    name: "充电柜使用率",
    quantity: "655 / 1233",
    exception: 5,
    img: flash2,
    comparison: "24%",
    isState: false,
  },
  {
    name: "充电站使用率",
    quantity: "72 / 95",
    exception: 1,
    img: flash3,
    comparison: "30%",
    isState: false,
  },
]);
const profitList = ref([
  {
    name: "广州",
    sales: "924574",
    percentage: "24%",
    color: "green",
  },
  {
    name: "深圳",
    sales: "662337",
    percentage: "8%",
    color: "green",
  },
  {
    name: "上海",
    sales: "523234",
    percentage: "20%",
    color: "red",
  },
  {
    name: "北京",
    sales: "492255",
    percentage: "15%",
    color: "red",
  },
  {
    name: "南京",
    sales: "47540",
    percentage: "17%",
    color: "green",
  },
  {
    name: "杭州",
    sales: "42941",
    percentage: "13%",
    color: "green",
  },
  {
    name: "长沙",
    sales: "165221",
    percentage: "3%",
    color: "green",
  },
]);

const chartRef = ref<HTMLElement | null>(null);
const chartRef2 = ref<HTMLElement | null>(null);
const chartRef3 = ref<HTMLElement | null>(null);

// 营收占比饼图数据接口
const setChartData = async () => {
  const res = await chartData2();
  const chartOptions = reactive({
    legend: {
      top: "bottom",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a}<br/>{b}:{c}",
    },
    series: [
      {
        name: "营收占比",
        type: "pie",
        radius: ["50%", "70%"],
        center: ["50%", "45%"],
        roseType: "area",
        emphasis: {
          label: {
            show: true,
            fontSize: "16",
            fontWeight: "bold",
          },
        },
        data: res.data.list,
      },
    ],
    graphic: {
      type: "text",
      left: "center",
      top: "center",
      style: {
        text: "营收占比",
        fontSize: 20,
        fill: "#333",
      },
    },
  });
  return chartOptions;
};
// 能源统计折线图;
const setChartData2 = async () => {
  const res = await chartData();
  const chartOptions = reactive({
    grid: {
      top: 70, // 原来例如 40，增大后图表整体内容向下
      left: 60,
      right: 40,
      bottom: 10,
    },
    title: {
      text: "电量统计",
      left: "left top",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      top: 10,
      data: res.data.list.map((item: any) => item.name),
      textStyle: {
        color: "#333",
      },
    },
    xAxis: {
      type: "category",
      data: [
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
      ],
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
      name: "KW",
      axisLabel: {
        formatter: "{value} KW",
      },
    },
    series: [
      {
        name: "",
        type: "line",
        data: [],
        itemStyle: {
          color: "purple",
          shadowColor: "rgba(0, 255, 0, 0.3)",
          shadowBlur: 10,
        },
        lineStyle: {
          width: 4,
        },
        smooth: true,
      },
      {
        name: "",
        type: "line",
        data: [],
        itemStyle: {
          color: "lightgreen",
          shadowColor: "rgba(0, 255, 0, 0.3)",
          shadowBlur: 10,
        },
        lineStyle: {
          width: 4,
        },
        smooth: true,
      },
      {
        name: "",
        type: "line",
        data: [],
        itemStyle: {
          color: "skyblue",
          shadowColor: "rgba(0, 255, 0, 0.3)",
          shadowBlur: 10,
        },
        lineStyle: {
          width: 4,
        },
        smooth: true,
      },
    ],
  });
  // 重新赋值后端返回的数据
  for (let index = 0; index < res.data.list.length; index++) {
    chartOptions.series[index].data = res.data.list[index].data;
    chartOptions.series[index].name = res.data.list[index].name;
  }
  return chartOptions;
};
// 设备总览;
const setChartData3 = async () => {
  const res = await chartData3();
  const chartOptions = reactive({
    radar: {
      // shape: 'circle',
      indicator: [
        { name: "闲置数", max: 65 },
        { name: "使用数", max: 160 },
        { name: "故障数", max: 300 },
        { name: "维修数", max: 380 },
        { name: "更换数", max: 520 },
        { name: "报废数", max: 250 },
      ],
    },
    series: [
      {
        name: "设备总览",
        type: "radar",
        data: [
          {
            value: res.data.list,
            name: "设备总览",
          },
        ],
      },
    ],
  });

  return chartOptions;
};
useEcharts(chartRef, setChartData);
useEcharts(chartRef2, setChartData2);
useEcharts(chartRef3, setChartData3);
</script>

<style scoped lang="less">
.dashboard {
  height: calc(100% - 60px);
  min-height: 500px;
  overflow-y: auto;
  .dashboard-row {
    height: 100%;
    .main-col {
      height: 100%;
      display: flex;
      flex-direction: column;
      .equipment-card {
        flex: 0 1 42%;
        min-height: 0;
        overflow: hidden;

        :deep(.el-card__body) {
          height: 100%;
          min-height: 0;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .equipment {
          flex: 1;
          min-height: 0;
        }
      }
      :deep(.el-card__body) {
        padding: 10px 10px 20px 0px !important;
      }

      .energy-card {
        flex: 1;
        min-height: 0;
      }

      .energy-card :deep(.el-card__body) {
        flex: 1;
        min-height: 0;

        .energy-row {
          height: 100%;
        }
      }
    }
  }
  .title {
    display: flex;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    align-items: flex-end;
    margin-bottom: 20px;

    p {
      color: #86909c;
    }
  }
  .equipment {
    display: flex;
    justify-content: space-between;
    padding: 0 50px;

    .item {
      text-align: center;
      height: 100%;
      h1 {
        font-size: 26px;
        margin: 10px 0px !important;
      }

      :deep(.el-statistic__content) {
        font-size: 20px;
        font-weight: bold;
      }
    }
    .comparison {
      font-weight: bold;
      margin-left: 3px;
      margin-right: 3px;
    }
  }
  .profit-card {
    flex: 0 1 42%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    :deep(.el-card__header) {
      flex-shrink: 0;
    }
    ::v-deep(.el-card__body) {
      flex: 1;
      min-height: 0;
      box-sizing: border-box;
      overflow: hidden; // 卡片本身不滚，交给下面的 ul 滚动
      padding: 0px !important;
    }
    .ranking-list {
      padding: 0px 20px !important;
      margin: 0px !important;
      height: 100%;
      box-sizing: border-box;
      margin: 0;
      padding: 0 10px 10px 0; // 最后一条数据到底部仍保留 10px 空白
      overflow-y: auto;
      overflow-x: hidden;
      /* 覆盖全局隐藏滚动条 */
      scrollbar-width: auto;
      &::-webkit-scrollbar {
        display: block !important;
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: #909399;
        border-radius: 3px;
      }
      .ranking-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        &:nth-child(1) {
          .rank {
            background-color: rgb(103, 194, 58);
            color: #fff;
          }
        }
        &:nth-child(2) {
          .rank {
            background-color: rgb(64, 158, 255);
            color: #fff;
          }
        }
        &:nth-child(3) {
          .rank {
            background-color: rgb(230, 162, 60);
            color: #fff;
          }
        }
        .rank {
          display: inline-block;
          font-weight: bold;
          color: #666;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          text-align: center;
          line-height: 30px;
        }

        .store-name {
          flex-grow: 1;
          padding: 0 10px;
        }

        .sales {
          color: #666;
        }
      }

      .ranking-item:nth-child(even) {
        background-color: rgb(253, 246, 236);
      }
    }
  }
}
</style>
