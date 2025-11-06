import { configureStore } from '@reduxjs/toolkit'
import tabsReducer from './tabsSlice'

// 配置store
export const store = configureStore({
  reducer: {
    tabs: tabsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略特定action的序列化检查
        ignoredActions: ['tabs/addTab', 'tabs/removeTab'],
        // 忽略特定paths的序列化检查
        ignoredPaths: ['tabs.tabs']
      }
    })
})

// 导出RootState和AppDispatch类型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch