import { store } from '../src/store';
import { setNewsList, appendNewsList, setCurrentPage, setHasMore, setError } from '../src/store/newsSlice';
import { showLoading, hideLoading } from '../src/store/loadingSlice';

describe('Redux Store', () => {
  beforeEach(() => {
    // 在每个测试前重置store状态
    store.dispatch({ type: 'RESET_STATE' });
  });

  test('should handle initial state', () => {
    const state = store.getState();
    expect(state.news.newsList).toEqual([]);
    expect(state.news.currentPage).toBe(1);
    expect(state.news.hasMore).toBe(true);
    expect(state.news.error).toBeNull();
    expect(state.loading.isLoading).toBe(false);
    expect(state.loading.message).toBe('加载中...');
  });

  test('should handle setNewsList', () => {
    const newsList = [
      {
        title: 'Test News',
        id: '1',
        cover: 'https://example.com/image.jpg',
        timestamp: Date.now(),
        hot: 100,
        url: 'https://example.com/news/1',
        mobileUrl: 'https://example.com/news/1'
      }
    ];

    store.dispatch(setNewsList(newsList));

    const state = store.getState();
    expect(state.news.newsList).toEqual(newsList);
  });

  test('should handle appendNewsList', () => {
    const initialNews = [
      {
        title: 'Initial News',
        id: '1',
        cover: 'https://example.com/image1.jpg',
        timestamp: Date.now(),
        hot: 100,
        url: 'https://example.com/news/1',
        mobileUrl: 'https://example.com/news/1'
      }
    ];

    const additionalNews = [
      {
        title: 'Additional News',
        id: '2',
        cover: 'https://example.com/image2.jpg',
        timestamp: Date.now(),
        hot: 200,
        url: 'https://example.com/news/2',
        mobileUrl: 'https://example.com/news/2'
      }
    ];

    store.dispatch(setNewsList(initialNews));
    store.dispatch(appendNewsList(additionalNews));

    const state = store.getState();
    expect(state.news.newsList).toEqual([...initialNews, ...additionalNews]);
  });

  test('should handle setCurrentPage', () => {
    store.dispatch(setCurrentPage(5));
    const state = store.getState();
    expect(state.news.currentPage).toBe(5);
  });

  test('should handle setHasMore', () => {
    store.dispatch(setHasMore(false));
    const state = store.getState();
    expect(state.news.hasMore).toBe(false);
  });

  test('should handle setError', () => {
    const errorMessage = 'Network error';
    store.dispatch(setError(errorMessage));
    const state = store.getState();
    expect(state.news.error).toBe(errorMessage);
  });

  test('should handle showLoading and hideLoading', () => {
    // 测试显示加载
    const loadingMessage = '正在加载新闻...';
    store.dispatch(showLoading(loadingMessage));
    let state = store.getState();
    expect(state.loading.isLoading).toBe(true);
    expect(state.loading.message).toBe(loadingMessage);

    // 测试隐藏加载
    store.dispatch(hideLoading());
    state = store.getState();
    expect(state.loading.isLoading).toBe(false);
    expect(state.loading.message).toBe('加载中...');
  });
});