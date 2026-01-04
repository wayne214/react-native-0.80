// 聚合API网站数据--基本参数配置
export const apiUrl = 'http://v.juhe.cn/toutiao/index';  // 接口请求URL
export const apiKey = '30c0a90f8a2475db8d589bd30e6f02f9';  // 在个人中心->我的数据,接口名称上方查看

// API 常量定义
export const API_ENDPOINTS = {
  // HOT_NEWS: 'https://api-hot.imsyy.top/toutiao',
  HOT_NEWS: apiUrl,
  EVERY_DAY_NEWS: 'https://api.03c3.cn/api/zb?type=jsonImg',
} as const;

// 保持向后兼容
class ApiContants {
  static hot_news = API_ENDPOINTS.HOT_NEWS;
  static every_day_news = API_ENDPOINTS.EVERY_DAY_NEWS;
}

export default ApiContants;

// 新的推荐用法
export const { HOT_NEWS, EVERY_DAY_NEWS } = API_ENDPOINTS;
