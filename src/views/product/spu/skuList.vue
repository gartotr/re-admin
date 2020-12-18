<template>
  <el-card>
    <el-form ref="skuForm" label-width="100px" :model="sku" :rules="rules">
      <!-- SPU名 -->
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <!-- SKU名称 -->
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="请输入SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <!-- 价格 -->
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          align="left"
          style="width: 300px"
          placeholder="请输入价格"
          controls-position="right"
          :min="0"
          :max="999999"
          v-model="sku.price"
        ></el-input-number>
      </el-form-item>
      <!-- 重量 -->
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          style="width: 300px"
          placeholder="请输入重量"
          controls-position="right"
          :min="0"
          :max="99999"
          v-model="sku.weight"
        ></el-input-number>
      </el-form-item>
      <!-- 规格 -->
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input type="textarea" placeholder="请输入规格" v-model="sku.skuDesc"></el-input>
      </el-form-item>
      <!-- 平台属性 -->
      <el-form-item label="平台属性" prop="skuAttrValueList">
        <div class="skulist-select" v-for="(attr, index) in attrList" :key="attr.id">
          <el-form-item :label="attr.attrName" style="display: inline-block">
            <el-select
              :placeholder="`请选择`"
              v-model="sku.skuAttrValueList[index]"
              @change="clearValidate('skuAttrValueList')"
              style="margin-bottom: 8px"
            >
              <el-option
                :label="value.valueName"
                v-for="value in attr.attrValueList"
                :key="value.id"
                :value="`${attr.id}-${value.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <div class="skulist-select" v-for="(sale, index) in spuSaleAttrList" :key="sale.id">
          <el-form-item :label="sale.saleAttrName" style="display: inline-block">
            <el-select
              placeholder="请选择"
              v-model="sku.skuSaleAttrValueList[index]"
              @change="clearValidate('skuSaleAttrValueList')"
              style="margin-bottom: 8px"
            >
              <el-option
                v-for="value in sale.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="value.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <!-- 图片 -->
      <el-form-item label="图片列表" prop="skuImageList">
        <el-form-item>
          <el-table
            ref="multipleTable"
            border
            :data="imageList"
            style="width: 100%; margin: 20px 0"
            @selection-change="handleSelectionChange"
            row-key="id"
          >
            <el-table-column type="selection" reserve-selection width="55"> </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope"
                ><img
                  style="display: inline-block; height: 100px"
                  :src="scope.row.imgUrl"
                  :alt="scope.row.imgName"
              /></template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  v-if="!row.isDefault"
                  type="primary"
                  size="mini"
                  @click="setDefault(row.id)"
                  >设为默认</el-button
                >
                <el-tag v-else type="success">默认</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
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
      attrList: [],
      spuSaleAttrList: [],
      imageList: [],
      rules: {
        // 表单验证规则
        skuName: [{ required: true, message: "请输入sku名称", trigger: "change" }],
        price: [{ required: true, message: "请输入sku价格", trigger: "change" }],
        weight: [{ required: true, message: "请输入sku重量", trigger: "change" }],
        skuDesc: [{ required: true, message: "请输入sku描述", trigger: "change" }],
        skuAttrValueList: [
          {
            required: true,
            validator: this.skuAttrValueListValidator,
          },
        ],
        skuSaleAttrValueList: [{ required: true, validator: this.skuSaleAttrValueListValidator }],
        skuImageList: [{ required: true, validator: this.skuImageListValidator }],
      },
      sku: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
    };
  },
  methods: {
    cancel() {
      this.$emit("showList", {
        category1Id: this.spu.category1Id,
        category2Id: this.spu.category2Id,
        category3Id: this.spu.category3Id,
      });
    },
    save() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          // console.log("校验通过~");
          const { category3Id, id: spuId, tmId } = this.spu;

          const skuAttrValueList = this.sku.skuAttrValueList.map((attr) => {
            const [attrId, valueId] = attr.split("-");
            return {
              attrId,
              valueId,
            };
          });

          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map((saleAttrValueId) => {
            return {
              saleAttrValueId,
              spuId,
            };
          });

          const skuDefaultImg = this.sku.skuImageList.find((img) => img.isDefault).imgUrl;

          const result = await this.$API.sku.saveSku({
            ...this.sku,
            category3Id,
            spuId,
            tmId,
            skuAttrValueList,
            skuSaleAttrValueList,
            skuDefaultImg,
          });

          if (result.code === 200) {
            this.$message.success("保存sku成功~");

            this.$emit("showList", {
              category1Id: this.spu.category1Id,
              category2Id: this.spu.category2Id,
              category3Id: this.spu.category3Id,
            });
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    //默认图片

    setDefault(id) {
      this.clearValidate("skuImageList");

      this.imageList = this.imageList.map((img, index) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });

      this.sku.skuImageList = this.sku.skuImageList.map((img, index) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
    },
    //清空表单校验
    clearValidate(prop) {
      this.$refs.skuForm.clearValidate(prop);
    },
    //
    handleSelectionChange(skuImageList) {
      this.sku.skuImageList = skuImageList;
    },
    //校验
    skuAttrValueListValidator(rule, value, callback) {
      const {
        attrList,
        sku: { skuAttrValueList },
      } = this;

      if (skuAttrValueList.length !== attrList.length || skuAttrValueList.some((attr) => !attr)) {
        callback(new Error("请对所有平台属性进行选择~"));
        return;
      }

      callback();
    },
    skuSaleAttrValueListValidator(rule, value, callback) {
      const {
        spuSaleAttrList,
        sku: { skuSaleAttrValueList },
      } = this;

      if (
        skuSaleAttrValueList.length !== spuSaleAttrList.length ||
        skuSaleAttrValueList.some((sale) => !sale)
      ) {
        callback(new Error("请对所有销售属性进行选择~"));
        return;
      }

      callback();
    },
    skuImageListValidator(rule, value, callback) {
      const {
        sku: { skuImageList },
      } = this;

      if (skuImageList.length === 0) {
        callback(new Error("请选择至少一张图片~"));
        return;
      }

      if (!skuImageList.some((img) => img.isDefault)) {
        callback(new Error("请设置一张默认图片~"));
        return;
      }

      callback();
    },
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
