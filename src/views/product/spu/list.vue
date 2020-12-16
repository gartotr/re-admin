<template>
  <div>
    <Category :disabled="!isShowList"></Category>
    <!-- 第一个 -->
    <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList"></SpuShowList>
    <SpuUpdateList v-else :item="item" @showList="showList"></SpuUpdateList>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";

export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
    };
  },
  methods: {
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
  },
};
</script>

<style lang="sass" scoped>
</style>
