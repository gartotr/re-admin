<template>
  <el-card style="margin-top: 20px">
    <el-button type="primary" icon="el-icon-plus" :disabled="!category.category3Id" @click="add"
      >添加SPU</el-button
    >
    <el-table :data="spuList" border style="width: 100%; margin-top: 20px" v-loading="loading">
      <el-table-column label="序号" width="100" align="center" type="index"> </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" icon="el-icon-plus" size="mini"></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="modify(row)"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :page-sizes="[3, 6, 9, 12]"
      :page-size.sync="limit"
      :current-page="page"
      layout="  prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "SpuShowList",

  data() {
    return {
      limit: 3,
      page: 1,
      total: 0,
      spuList: [],
      loading: false,
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    modify(row) {
      this.$emit("showUpdateList", row);
    },
    add() {
      this.$emit("showUpdateList", { category3Id: this.category.category3Id });
    },
    //获取分页信息
    async getPageList(page, limit) {
      this.loading = true;
      const { category3Id } = this.category;
      const result = await this.$API.spu.getAttrValueList({ page, limit, category3Id });
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    handleCategoryChange(category) {
      this.category = category;
      this.getPageList(this.page, this.limit);
    },
    clearList() {
      this.spuList = [];
      this.page = 1;
      this.limit = 3;
      this.total = 0;
      this.category.category3Id = "";
    },
  },
  mounted() {
    this.$bus.$on("change", this.handleCategoryChange);
    this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    //全局事件 每次加载就会绑定可以绑定多次 所以卸载要清空
    this.$bus.$off("change", this.handleCategoryChange);
    this.$bus.$off("clearList", this.clearList);
  },
};
</script>

<style lang="sass" scoped>
.el-pagination
  text-align: right
/deep/.el-select--mini
  margin-left: 350px
</style>
