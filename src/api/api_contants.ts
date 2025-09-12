// API 常量定义
export const API_ENDPOINTS = {
  HOT_NEWS: 'https://api-hot.imsyy.top/toutiao',
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
