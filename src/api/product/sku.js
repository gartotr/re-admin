import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  //保存sku /admin/product/saveSkuInfo
  saveSku(data) {
    return request({
      method: "POST",
      url: `${api_name}/saveSkuInfo`,
      data
    });
  }
};
