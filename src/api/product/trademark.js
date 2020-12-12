import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark";

export default {
  /*
  获取订单分页列表(带搜索)
  */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET"
    });
  },
  //添加
  addTrademark(data) {
    return request({
      method: "POST",
      url: `${api_name}/save`,
      data
    });
  },
  // 修改
  updataTrademark(data) {
    return request({
      method: "PUT",
      url: `${api_name}/update`,
      data
    });
  }
};
