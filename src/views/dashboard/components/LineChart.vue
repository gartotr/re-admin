<template>
  <div ref="LineChartContainer" class="line-chart-container"></div>
</template>

<script>
import Echarts from "echarts";
import "echarts/theme/macarons";

export default {
  name: "LineChart",
  // :chart-data="lineChartData" :yTittle="yTitle"
  props: {
    yTittle: {
      type: String,
      required: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  watch: {
    chartData({ expectedData, actualData }) {
      this.setOption({ expectedData, actualData });
    },
  },
  methods: {
    initChart() {
      this.myChart = Echarts.init(this.$refs.LineChartContainer, "macarons");
    },
    setOption({ expectedData, actualData }) {
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "skyblue",
            },
          },
        },
        legend: {
          data: ["预期", "实际"],
        },
        grid: {
          left: "2%",
          right: "2%",
          bottom: "2%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "交易金额(万元)",
          },
        ],
        series: [
          {
            name: "预期",
            type: "line",

            areaStyle: {},
            data: expectedData,
            smooth: true,
            lineStyle: {
              color: "#fb7293",
            },
            areaStyle: {
              color: "gray",
              opacity: 0.2,
            },
          },
          {
            name: "实际",
            type: "line",

            areaStyle: {},
            data: actualData,
            smooth: true,
            lineStyle: {
              color: "#67e0e3",
            },
            areaStyle: {
              color: "gray",
              opacity: 0,
            },
          },
        ],
      };

      this.myChart.setOption(option);
    },
  },
  mounted() {
    this.initChart();
  },
};
</script>

<style lang="sass" scoped>
.line-chart-container
  width: 100%
  height: 400px
</style>
