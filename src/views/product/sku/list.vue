<template>
  <el-card>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="序号" width="100"> </el-table-column>
      <el-table-column prop="name" label="名称" width="180"> </el-table-column>
      <el-table-column prop="name" label="描述" width="180"> </el-table-column>
      <el-table-column prop="name" label="默认图片" width="200"> </el-table-column>
      <el-table-column prop="name" label="重量" width="180"> </el-table-column>
      <el-table-column prop="address" label="价格" width="100"> </el-table-column>
      <el-table-column prop="address" label="操作"> </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "SKuList",
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
      ],
    };
  },
};
</script>
