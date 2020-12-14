import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  //销售属性 admin/product/baseSaleAttrList
  getBaseSaleAttrList() {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: "GET"
    });
  },
  //删除SPU /admin/product/deleteSpu/{spuId}
  deleteSpu(spuId) {
    return request({
      method: "DELETE",
      url: `${api_name}/deleteSpu/${spuId}`
    });
  },
  // 获取SPUID /admin/product/getSpuById/{spuId}
  getSpuById(spuId) {
    return request({
      method: "GET",
      url: `${api_name}/getSpuById/${spuId}`
    });
  },
  // 保存SPU信息 /admin/product/saveSpuInfo
  saveSpu(data) {
    return request({
      method: "POST",
      url: `${api_name}/saveSpuInfo`,
      data
    });
  },

  // 更新SPU信息 /admin/product/updateSpuInfo
  updateSpu(data) {
    return request({
      method: "POST",
      url: `${api_name}/updateSpuInfo`,
      data
    });
  },
  // 获取分页信息 /admin/product/{page}/{limit}
  getAttrValueList({ page, limit, category3Id }) {
    return request({
      method: "GET",
      url: `${api_name}/${page}/${limit}`,
      params: {
        category3Id
      }
    });
  },
  /*
  获取所有品牌数据
  */
  getTrademarkList() {
    return request({
      url: `${api_name}/baseTrademark/getTrademarkList`,
      method: "GET"
    });
  },
  /*
  获取SPU的图片列表
  */
  getSpuImageList(spuId) {
    return request({
      url: `${api_name}/spuImageList/${spuId}`,
      method: "GET"
    });
  },
  /*
  获取SPU的销售属性列表
  */
  getSpuSaleAttrList(spuId) {
    return request({
      url: `${api_name}/spuSaleAttrList/${spuId}`,
      method: "GET"
    });
  },

  /*
获取所有销售属性列表
*/
  getSaleAttrList() {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: "GET"
    });
  }
};
