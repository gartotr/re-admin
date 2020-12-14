<template>
  <div>
    <Category :disabled="!isShowList"></Category>
    <el-card style="margin-top: 20px" v-show="isShowList">
      <el-button type="primary" icon="el-icon-plus" @click="add" :disabled="!category.category3Id"
        >添加属性</el-button
      >
      <el-table :data="attrList" border style="width: 100%; margin-top: 20px">
        <el-table-column label="序号" width="100" align="center" type="index"> </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150"> </el-table-column>
        <el-table-column prop="" label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              v-for="attrVal in row.attrValueList"
              :key="attrVal.id"
              style="margin-right: 5px"
              >{{ attrVal.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updata(row)"
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 第二个 -->
    <el-card style="margin-top: 20px" v-show="!isShowList">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attr.attrName"
        >添加属性值</el-button
      >
      <el-table :data="attr.attrValueList" border style="width: 100%; margin: 20px">
        <el-table-column label="序号" width="100" align="center" type="index"> </el-table-column>
        <el-table-column label="属性值名称">
          <!-- span 点击切换imput -->
          <template v-slot="{ row, $index }">
            <span @click="edit(row)" v-if="!row.edit" style="display: block; width: 100%">{{
              row.valueName
            }}</span>
            <el-input
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
              size="mini"
              v-model="row.valueName"
              v-else
              ref="input"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <!-- 文档有问题：onConfirm -->
            <el-popconfirm
              @onConfirm="delAttrValue($index)"
              :title="`确定删除 ${row.valueName} 吗？`"
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
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "@/components/Category";

export default {
  name: "AttrList",
  data() {
    return {
      isShowList: true,
      attr: {
        attrName: "",
        attrValueList: [],
      },
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      attrList: [],
    };
  },
  methods: {
    clearList() {
      this.attrList = [];
      this.category.category3Id = "";
    },
    async getAttrList(category) {
      this.category = category;

      const res = await this.$API.attrs.getAttrList(category);
      if (res.code === 200) {
        this.attrList = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    add() {
      this.isShowList = false;
      this.attr.attrName = "";
      this.attr.attrValueList = [];
      this.attr.id = "";
    },
    updata(attr) {
      this.attr = JSON.parse(JSON.stringify(attr));
      this.isShowList = false;
    },
    //设置显示隐藏input 的edit
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    editCompleted(row, index) {
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    //删除列
    delAttrValue(index) {
      this.attr.attrValueList.splice(index, 1);
    },
    //添加属性值
    addAttrValue() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //保存上传数据
    async save() {
      const isAdd = !this.attr.id;
      const data = this.attr;

      if (isAdd) {
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }

      const result = await this.$API.attrs.saveAttrInfo(data);
      if (result.code === 200) {
        this.$message.success("更新数据成功");
        this.getAttrList(this.category);
        this.isShowList = true;
      } else {
        this.$message.error(res.message);
      }
    },
  },
  mounted() {
    this.$bus.$on("change", this.getAttrList);
    this.$bus.$on("clearList", this.clearList);
  },
  components: {
    Category,
  },
};
</script>
