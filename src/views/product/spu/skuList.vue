<template>
  <el-card>
    <el-form ref="skuForm" label-width="100px">
      <!-- SPU名 -->
      <el-form-item label="SPU名称" prop="spuName">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <!-- SKU名称 -->
      <el-form-item label="SKU名称" prop="spuName">
        <el-input prop="" placeholder="请输入SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <!-- 价格 -->
      <el-form-item label="价格(元)" prop="spuName">
        <el-input-number
          style="width: 300px"
          placeholder="请输入价格"
          controls-position="right"
          :min="0"
          v-model="sku.skuPrice"
        ></el-input-number>
      </el-form-item>
      <!-- 重量 -->
      <el-form-item label="重量(千克)" prop="spuName">
        <el-input-number
          style="width: 300px"
          placeholder="请输入重量"
          controls-position="right"
          :min="0"
          v-model="sku.skuMg"
        ></el-input-number>
      </el-form-item>
      <!-- 规格 -->
      <el-form-item label="规格描述" prop="spuName">
        <el-input
          prop=""
          type="textarea"
          placeholder="请输入规格"
          v-model="sku.skuMessage"
        ></el-input>
      </el-form-item>
      <!-- 平台属性 -->
      <el-form-item label="平台属性" prop="spuName">
        <div class="skulist-select" v-for="attr in attrList" :key="attr.id">
          <span>{{ attr.attrName }}</span>
          <el-select :placeholder="`请选择`" v-model="spu.attrId">
            <el-option
              :label="value.valueName"
              v-for="value in attr.attrValueList"
              :key="value.id"
              :value="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性" prop="spuName">
        <div class="skulist-select" v-for="sale in spuSaleAttrList" :key="sale.id">
          <span>{{ sale.saleAttrName }}</span>
          <el-select :placeholder="`请选择`">
            <el-option
              :label="value.saleAttrValueName"
              v-for="value in sale.spuSaleAttrValueList"
              :key="value.id"
              :value="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <!-- 图片 -->
      <el-form-item label="图片列表" prop="spuName">
        <el-table border style="width: 100%; margin: 10px 0" ref="multipleTable" :data="imageList">
          <el-table-column type="selection" width="55" prop="isCheck"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img :src="scope.row.imgUrl" :alt="scope.row.imgName" style="height: 80px"
            /></template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button type="primary" size="mini">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "SkuList",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem,
      sku: {},
      attrList: [],
      spuSaleAttrList: [],
      imageList: [],
    };
  },
  methods: {
    //获取平台属性
    async getAttrList() {
      const res = await this.$API.attrs.getAttrList({
        category1Id: this.spu.category1Id,
        category2Id: this.spu.category2Id,
        category3Id: this.spu.category3Id,
      });

      if (res.code === 200) {
        this.attrList = res.data;
        this.$message.success("获取平台属性列表成功");
      } else {
        this.$message.error(res.message);
      }
    },
    //获取销售属性
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);

      if (result.code === 200) {
        this.$message.success("获取销售属性列表");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.success("获取销售属性失败");
      }
    },
    async getImgList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.imageList = result.data;

        this.$message.success("获取品牌图片成功");
      } else {
        this.$message.error("获取品牌数据失败");
      }
    },
  },
  mounted() {
    this.getAttrList();
    this.getSpuSaleAttrList();
    this.getImgList();
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left
.skulist-select
  display: inline-block
  margin-right: 20px
</style>
