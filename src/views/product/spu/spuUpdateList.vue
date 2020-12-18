<template>
  <el-card style="margin-top: 20px">
    <el-form ref="spuForm" :model="spu" label-width="80px" :rules="rules">
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

      <el-form-item label="SPU图片" prop="description">
        <el-upload
          accept="image/*"
          class="avatar-uploader"
          list-type="picture-card"
          :file-list="formatImageList"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg/png文件，且不超过50kb</span>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性" prop="sale">
        <el-select :placeholder="`还剩${filterSaleAttrList.length}个未选择`" v-model="spu.sale">
          <el-option
            v-for="sale in filterSaleAttrList"
            :label="sale.name"
            :value="`${sale.id}-${sale.name}`"
            :key="sale.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" @click="addSpuSaleAttr" :disabled="!spu.sale"
          >添加销售属性</el-button
        >
        <el-table :data="spuSaleAttrList" border style="width: 100%; margin: 20px 0">
          <el-table-column type="index" label="序号" width="80" align="center"> </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名称" width="150"> </el-table-column>
          <el-table-column label="属性值列表">
            <template v-slot="{ row }">
              <el-tag
                @close="delTag(i, row)"
                closable
                style="margin-right: 5px"
                v-for="(attrVal, i) in row.spuSaleAttrValueList"
                :key="attrVal.id"
                >{{ attrVal.saleAttrValueName }}</el-tag
              >

              <el-input
                v-if="row.edit"
                size="mini"
                style="width: 150px"
                @blur="editCompleted(row)"
                @keyup.enter.native="editCompleted(row)"
                ref="input"
                v-model="saleAttrValueText"
              ></el-input>

              <el-button icon="el-icon-plus" size="mini" v-else @click="edit(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                @onConfirm="delSpuSaleAttr($index)"
                :title="`确定删除 ${row.saleAttrName} 吗？`"
                ><el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button
              ></el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="changeShowList">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="visible">
      <img width="100%" :src="previewImgUrl" alt="img" />
    </el-dialog>
  </el-card>
</template>

<script>
import { mounted } from "v-charts/lib/core";
import LogoVue from "@/layout/components/Sidebar/Logo.vue";
export default {
  name: "SpuUpdateList",
  props: {
    item: Object,
  },
  data() {
    return {
      spu: this.item,
      imageList: [],
      saleAttrList: [],
      spuSaleAttrList: [],
      trademarkList: [],
      saleAttrValueText: "",
      visible: false,
      previewImgUrl: "",
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称~" }],
        tmId: [{ required: true, message: "请输入品牌~" }],
        description: [{ required: true, message: "请输入SPU描述~" }],
        imageList: [{ validator: this.imageListValidator, required: true }],
        sale: [{ validator: this.saleValidator, required: true }],
      },
    };
  },
  computed: {
    //保存发送请求

    formatImageList() {
      return this.imageList.map((img) => {
        return {
          uid: img.uid || img.id,
          name: img.skuName,
          url: img.imgUrl,
        };
      });
    },
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        return !this.spuSaleAttrList.find((spu) => spu.baseSaleAttrId === sale.id);
      });
    },
  },
  methods: {
    changeShowList() {
      this.$emit("showList", {
        category1Id: this.spu.category1Id,
        category2Id: this.spu.category2Id,
        category3Id: this.spu.category3Id,
      });
    },
    save() {
      this.$refs.spuForm.validate(async (value) => {
        //表示通过校验
        if (value) {
          const spu = {
            ...this.spu,
            spuImageList: this.imageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };

          let result;

          if (this.spu.id) {
            result = await this.$API.spu.updateSpu(spu);
          } else {
            result = await this.$API.spu.saveSpu(spu);
          }

          if (result.code === 200) {
            this.$message.success("更新数据成功");
            this.$bus.$on();
            this.$emit("showList", this.spu.category3Id);
          } else {
            this.$message.success("更新数据成功");
          }
        }
      });
    },

    //验证图片
    imageListValidator(rules, value, cb) {
      if (this.imageList > 0) {
        // 校验通过
        cb();
      }
      cb(new Error("请上传至少一张图片"));
    },
    //验证sale
    saleValidator(rule, value, callback) {
      // 判断至少选择一个销售属性
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error("请选择至少一个销售属性~"));
        return;
      }

      // 判断销售属性中至少添加一个销售属性值
      const isNotOk = this.spuSaleAttrList.some((sale) => sale.spuSaleAttrValueList.length === 0);

      if (isNotOk) {
        callback(new Error("销售属性至少添加一个销售属性值, 请添加~"));
        return;
      }

      callback();
    },
    //获取所有品牌信息
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.trademarkList = result.data;
        this.$message.success("获取品牌成功");
      } else {
        this.$message.error("获取品牌数据失败");
      }
    },
    //SPU图片
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
    //图片处放大
    handlePictureCardPreview(file) {
      this.previewImgUrl = file.url;
      this.visible = true;
    },
    //图片删除
    handleRemove(file, fileList) {
      this.imageList = this.imageList.filter((img) => img.imgUrl !== file.url);
    },
    //图片上传
    beforeAvatarUpload(file) {
      // console.log(file);
      const imgTypes = ["image/jpg", "image/png", "image/jpeg"];
      // 检测文件类型
      const isValidType = imgTypes.indexOf(file.type) > -1;
      // 检测文件大小
      const isLt = file.size / 1024 / 1024 < 2;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO大小不能超过 2mb!");
      }
      // 返回值为true，代表可以上传
      // 返回值为false，代表不可以上传
      return isValidType && isLt;
    },
    //上传成功
    handleAvatarSuccess(res, file) {
      this.imageList.push({
        uid: file.uid,
        imgName: file.name, // 文件名称
        imgUrl: res.data, // 图片地址
        spuId: this.spu.id, // SPU id
      });
    },
    //销售属性
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.saleAttrList = result.data;
        this.$message.success("获取销售属性成功");
      } else {
        this.$message.error("获取销售属性失败");
      }
    },
    async getSpuSaleAttrList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);

      if (result.code === 200) {
        this.$message.success("获取销售属性列表");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.success("获取销售属性失败");
      }
    },
    //点击添加销售属性的列表

    addSpuSaleAttr() {
      // 选中的销售属性
      const { sale, id } = this.spu;
      const [baseSaleAttrId, saleAttrName] = sale.split("-");
      // 将销售属性添加到商品中
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId, // 所有销售属性id
        saleAttrName, // 所有销售属性名称
        spuId: id, // SPU id
        spuSaleAttrValueList: [], // 销售属性值列表
      });
      // 清空选中的销售属性id
      this.spu.sale = "";
    },
    //显示隐藏input框
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    editCompleted(row) {
      if (this.saleAttrValueText) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrValueText,
          spuId: row.spuId,
        });
        this.saleAttrValueText = "";
      }

      row.edit = false;
    },
    delSpuSaleAttr(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    //删除标签
    delTag(index, row) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
  },
  mounted() {
    this.getTrademarkList();
    this.getSaleAttrList();
    if (this.spu.id) {
      this.getImgList();

      this.getSpuSaleAttrList();
    }
  },
};
</script>

<style lang="less" scoped>
</style>
