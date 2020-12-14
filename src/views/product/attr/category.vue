<template>
  <div>
    <el-card>
      <el-form inline :model="category">
        <el-form-item label="一级分类">
          <el-select
            v-model="category.category1Id"
            placeholder="请选择"
            @change="handleSelectChange1"
            :disabled="disabled"
          >
            <el-option
              :label="c1.name"
              :value="c1.id"
              v-for="c1 in category1List"
              :key="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category.category2Id"
            placeholder="请选择"
            @change="handleSelectChange2"
            :disabled="disabled"
          >
            <el-option
              :label="c2.name"
              :value="c2.id"
              v-for="c2 in category2List"
              :key="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category.category3Id"
            placeholder="请选择"
            @change="handleSelectChange3"
            :disabled="disabled"
          >
            <el-option
              :label="c3.name"
              :value="c3.id"
              v-for="c3 in category3List"
              :key="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Category",
  props: ["disabled"],
  data() {
    return {
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  methods: {
    // 获取二级分类
    async handleSelectChange1(category1Id) {
      this.category2List = [];
      this.category3List = [];
      this.category.category2Id = "";
      this.category.category3Id = "";
      const res = await this.$API.attrs.getCategorys2(category1Id);
      if (res.code === 200) {
        this.category2List = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    // 获取三级分类
    async handleSelectChange2(category2Id) {
      this.category.category3Id = "";
      this.category3List = [];
      const res = await this.$API.attrs.getCategorys3(category2Id);
      if (res.code === 200) {
        this.category3List = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    //获取所有
    async handleSelectChange3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      };
      this.$emit("change", category);
    },
  },
  async mounted() {
    const res = await this.$API.attrs.getCategorys1();
    if (res.code === 200) {
      this.category1List = res.data;
    } else {
      this.$message.error(res.message);
    }
  },
};
</script>

<style lang="less" scoped>
</style>
