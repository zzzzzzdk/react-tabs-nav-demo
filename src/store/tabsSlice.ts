import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// 定义标签页的接口
export interface TabItem {
  key: string
  label: string
  path: string
  closable?: boolean
  pinned?: boolean
  params?: Record<string, string | number>
}

// 定义tabs state的接口
interface TabsState {
  tabs: TabItem[]
  activeKey: string
}

// 初始状态
const initialState: TabsState = {
  tabs: [],
  activeKey: ''
}

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    // 添加标签页
    addTab: (state, action: PayloadAction<TabItem>) => {
      const { key, path, label, closable = true, pinned = false, params } = action.payload
      
      // 检查是否已存在相同key的标签页
      const existingTabIndex = state.tabs.findIndex(tab => tab.key === key)
      
      if (existingTabIndex === -1) {
        state.tabs.push({ key, path, label, closable, pinned, params })
      } else {
        // 更新现有标签页的信息
        state.tabs[existingTabIndex] = { ...state.tabs[existingTabIndex], path, label, params }
      }
      
      // 设置为激活标签页
      state.activeKey = key
    },
    
    // 移除标签页
    removeTab: (state, action: PayloadAction<string>) => {
      const key = action.payload
      const tabIndex = state.tabs.findIndex(tab => tab.key === key)
      
      // 如果找不到标签页，直接返回
      if (tabIndex === -1) return
      
      // 不允许移除固定标签页
      if (state.tabs[tabIndex].pinned) return
      
      // 检查是否是激活标签页
      const isActiveTab = key === state.activeKey
      
      // 在删除前确定新的激活标签页索引
      let newActiveKey: string = state.activeKey
      if (isActiveTab && state.tabs.length > 1) {
        // 如果要删除的是激活标签页，需要确定新的激活标签页
        if (tabIndex > 0) {
          // 优先选择前一个标签页作为新的激活标签页
          newActiveKey = state.tabs[tabIndex - 1].key
        } else {
          // 如果是第一个标签页，则选择下一个
          newActiveKey = state.tabs[1].key
        }
      }
      
      // 移除标签页
      state.tabs.splice(tabIndex, 1)
      
      // 更新激活标签页
      if (isActiveTab) {
        if (state.tabs.length > 0) {
          state.activeKey = newActiveKey
        } else {
          state.activeKey = ''
        }
      } else if (state.tabs.length === 0) {
        state.activeKey = ''
      }
    },
    
    // 设置激活的标签页
    setActiveTab: (state, action: PayloadAction<string>) => {
      const key = action.payload
      const tabExists = state.tabs.some(tab => tab.key === key)
      
      if (tabExists) {
        state.activeKey = key
      }
    },
    
    // 移除所有标签页（除了固定的）
    removeAllTabs: (state) => {
      state.tabs = state.tabs.filter(tab => tab.pinned)
      
      if (state.tabs.length > 0) {
        state.activeKey = state.tabs[0].key
      } else {
        state.activeKey = ''
      }
    },
    
    // 移除其他标签页（除了当前激活和固定的）
    removeOtherTabs: (state) => {
      state.tabs = state.tabs.filter(tab => tab.key === state.activeKey || tab.pinned)
    },
    
    // 切换标签页固定状态
    togglePinTab: (state, action: PayloadAction<string>) => {
      const key = action.payload
      const tabIndex = state.tabs.findIndex(tab => tab.key === key)
      
      if (tabIndex !== -1) {
        state.tabs[tabIndex].pinned = !state.tabs[tabIndex].pinned
      }
    }
  }
})

// 导出actions
export const { 
  addTab, 
  removeTab, 
  setActiveTab, 
  removeAllTabs, 
  removeOtherTabs, 
  togglePinTab 
} = tabsSlice.actions

// 导出selectors
export const selectTabs = (state: RootState) => state.tabs.tabs
export const selectActiveTab = (state: RootState) => state.tabs.activeKey

// 导出reducer
export default tabsSlice.reducer