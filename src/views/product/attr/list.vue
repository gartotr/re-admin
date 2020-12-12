<template>
  <div>
    <Category @change="getAttrList"></Category>
    <el-card style="margin-top: 20px" v-show="isShowList">
      <el-button type="primary" icon="el-icon-plus" @click="showAttr">添加属性</el-button>
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
          <template>
            <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 第二个 -->
    <el-card style="margin-top: 20px" v-show="!isShowList">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
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
        <el-table-column label="操作----" width="150">
          <template>
            <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Category from "./category";

export default {
  name: "AttrList",
  data() {
    return {
      isShowList: true,
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      attrList: [],
    };
  },
  methods: {
    getAttrList(attrList) {
      this.attrList = attrList;
    },
    showAttr() {
      console.log(222);
      this.isShowList = !this.isShowList;
    },
  },
  components: {
    Category,
  },
};
</script>
