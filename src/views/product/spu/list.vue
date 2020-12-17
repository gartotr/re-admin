<template>
  <div>
    <SkuList v-if="isShowSkuList" :spuItem="spuItem"></SkuList>
    <div v-else>
      <Category :disabled="!isShowList"></Category>
      <!-- 第一个 -->
      <SpuShowList
        v-if="isShowList"
        @showUpdateList="showUpdateList"
        @showSkuList="showSkuList"
      ></SpuShowList>
      <!-- 第二个 -->
      <SpuUpdateList v-else :item="item" @showList="showList"></SpuUpdateList>
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SkuList from "./skuList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
      isShowSkuList: false,
      spuItem: {},
    };
  },
  methods: {
    showSkuList(row) {
      this.isShowSkuList = true;
      this.spuItem = row;
    },
    showUpdateList(row) {
      this.item = { ...row };
      this.isShowList = false;
    },
    showList(category3Id) {
      this.isShowList = true;
      this.$nextTick(() => {
        this.$bus.$emit("change", { category3Id });
      });
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SkuList,
  },
};
</script>

<style lang="sass" scoped>
</style>
