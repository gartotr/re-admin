import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  //一级
  getCategorys1() {
    return request({
      url: `${api_name}/getCategory1`,
      method: "GET"
    });
  },
  //二级
  getCategorys2(category1Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory2/${category1Id}`
    });
  },
  // 三级  /admin/product/getCategory3/{category2Id}
  getCategorys3(category2Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory3/${category2Id}`
    });
  },
  // 所有级 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getAttrList({ category1Id, category2Id, category3Id }) {
    return request({
      method: "GET",
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    });
  },

  // 删除 /admin/product/deleteAttr/{attrId}
  deleteAttr(attrId) {
    return request({
      method: "DELETE",
      url: `${api_name}/deleteAttr/${attrId}`
    });
  },
  // 获取属性列表 /admin/product/getAttrValueList/{attrId}
  getAttrValueList(attrId) {
    return request({
      method: "GET",
      url: `${api_name}/getAttrValueList/${attrId}`
    });
  },

  // 新增 /admin/product/saveAttrInfo
  saveAttrInfo(attr) {
    return request({
      method: "POST",
      url: `${api_name}/saveAttrInfo`,
      data: attr
    });
  }
};
