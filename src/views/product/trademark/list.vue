<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    <!-- 表格 -->
    <el-table :data="trademark" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="序号" width="120" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column prop="" label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="logo" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="warning" icon="el-icon-edit" @click="updata(row)"> 修改 </el-button>
          <el-button type="danger" icon="el-icon-delete"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分液器
     -->
    <el-pagination
      @size-change="getList(pages, $event)"
      @current-change="getList($event, limit)"
      :page-sizes="[3, 6, 9, 12]"
      :page-size.sync="limit"
      layout="  prev, pager, next,sizes,total"
      :total="total"
    >
    </el-pagination>

    <!-- 弹出层 -->
    <el-dialog
      :title="trademarkForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="visible"
      width="50%"
    >
      <!-- 表单 -->
      <el-form :model="trademarkForm" ref="trademarkForm" label-width="100px" :rules="rules">
        <el-form-item label="商品名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="logoUrl">
          <!-- 上传 -->
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkForm.logoUrl" :src="trademarkForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png,大小不超过2mb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      pages: 1, //当前页数
      limit: 3, //选择单页展示的数量
      total: 0,
      visible: false,
      loading: false,
      trademarkForm: {
        tmName: "",
        logoUrl: "",
      },
      trademark: [],
      rules: {
        tmName: [
          {
            required: true,
            message: "请输入品牌的名称",
            trigger: "blur",
          },
        ],
        logoUrl: [
          {
            required: true,
            message: "请上传品牌LOGO",
          },
        ],
      },
    };
  },
  methods: {
    async getList(page, limit) {
      this.loading = true;
      const res = await this.$API.trademark.getPageList(page, limit);

      if (res.code === 200) {
        const { current, size, total, records } = res.data;
        this.trademark = records;
        this.size = size;
        this.pages = current;
        this.total = total;
      } else {
        this.$message.error("获取数据失败~");
      }
      this.loading = false;
    },
    // 上传成功触发
    handleAvatarSuccess(res) {
      this.trademarkForm.logoUrl = res.data;
    },
    // 上传后触发
    beforeAvatarUpload(file) {
      const imgType = ["image/jpg", "image/png", "image/jpeg"];
      const isValidType = imgType.indexOf(file.type);
      const isLt = file.size / 1024 / 1024 < 2;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO大小不能超过2m!");
      }
      return isValidType && isLt;
    },
    // 上传表单
    submitForm(form) {
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          const { trademarkForm } = this;
          //如果是修改 则trademark会有id
          const isUpdata = !!trademarkForm.id;

          if (isUpdata) {
            const tm = this.trademark.find((tm) => tm.id === trademarkForm.id);
            //输入修改的内容 不修改就返回
            if (tm.tmName === trademarkForm.tmName && tm.logoUrl === trademarkForm.logoUrl) {
              this.$message.warning("请输入修改内容");
              return;
            }
          }
          let res;
          if (isUpdata) {
            res = await this.$API.trademark.updataTrademark(trademarkForm);
          } else {
            res = await this.$API.trademark.addTrademark(trademarkForm);
          }

          if (res.code === 200) {
            this.$message.success(`${isUpdata ? "修改" : "添加"}品牌成功了呢~`);
            this.visible = false;
            this.getList(this.pages, this.limit);
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    //修改按钮
    updata(row) {
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.visible = true;
      this.trademarkForm = { ...row };
    },
    //添加功能
    add() {
      this.visible = true;
      this.trademarkForm = {
        tmName: "",
        logoUrl: "",
      };
    },
  },
  mounted() {
    this.getList(this.pages, this.limit);
  },
};
</script>

<style lang="sass" scoped>
.el-table
  margin: 20px 0
.el-pagination
  text-align: right
/deep/.el-select--mini
  margin-left: 300px
/deep/.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

.avatar-uploader .el-upload:hover
  border-color: #409EFF

.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center

.avatar
  width: 178px
  height: 178px
  display: block
</style>
