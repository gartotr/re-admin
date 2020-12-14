<template>
  <el-card style="margin-top: 20px">
    <el-form ref="form" :model="spu" label-width="80px">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input v-model="spu.spuName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            v-for="tm in trademarkList"
            :label="tm.tmName"
            :value="tm.id"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input type="textarea" placeholder="请输入SPU描述" v-model="spu.description"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload class="avatar-uploader" list-type="picture-card">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性" prop="saleAttrId">
        <el-select :placeholder="`还剩1个未选择`">
          <el-option
            v-for="tm in trademarkList"
            :label="tm.tmName"
            :value="tm.id"
            :key="tm.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table :data="spuSaleAttrList" border style="width: 100%; margin: 20px 0">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名称" width="150"> </el-table-column>

          <el-table-column label="属性值列表">
            <template>
              <el-tag style="margin-right: 5px">1</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template>
              <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mounted } from "v-charts/lib/core";
export default {
  name: "SpuUpdateList",
  props: {
    item: Object,
  },
  data() {
    return {
      spu: this.item,
      spuSaleAttrList: [
        {
          saleAttrName: 1,
        },
      ],
      trademarkList: [],
    };
  },
  methods: {
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.trademarkList = result.data;
        this.$message.success("获取品牌成功成功");
      } else {
        this.$message.error("获取品牌数据失败");
      }
    },
  },
  mounted() {
    this.getTrademarkList();
  },
};
</script>

<style lang="less" scoped>
</style>
