import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Layout as AntLayout, Menu, Dropdown, Button } from 'antd'
import { 
  HomeOutlined, 
  DashboardOutlined, 
  UserOutlined, 
  SettingOutlined, 
  CloseOutlined,
  ReloadOutlined,
  PushpinOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import {
  addTab,
  removeTab,
  removeAllTabs,
  removeOtherTabs,
  togglePinTab,
  setActiveTab,
  selectTabs,
  selectActiveTab
} from '../../store/tabsSlice'
import type { AppDispatch } from '../../store/store'
import { store } from '../../store/store'
import './Layout.css'

const { Header, Sider, Content } = AntLayout

// 菜单项配置
const menuItems: MenuProps['items'] = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: '首页'
  },
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘'
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: '用户管理'
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: '设置'
  }
]

function Layout() {
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const navigate = useNavigate()
  const tabs = useSelector(selectTabs)
  const activeTabKey = useSelector(selectActiveTab)
  const [reloadKey, setReloadKey] = useState(0)
  const [layoutType, setLayoutType] = useState<'side' | 'top'>('side')
  const [collapsed, setCollapsed] = useState(false)

  // 处理路由变化，同步到标签页
  useEffect(() => {
    const currentPath = location.pathname
    
    // 只有当用户通过侧边栏或导航链接主动访问页面时，才添加标签页
    if (menuItems && Array.isArray(menuItems)) {
      const menuItem = menuItems.find(item => item && typeof item === 'object' && 'key' in item && item.key === currentPath)
      
      if (menuItem && typeof menuItem === 'object' && 'label' in menuItem) {
        // 检查标签是否已存在，只在不存在时添加
        // 我们使用getState获取最新的tabs状态，而不是通过依赖项传入
        const state = store.getState()
        const existingTab = state.tabs.tabs.find(tab => tab.key === currentPath)
        
        if (!existingTab) {
          dispatch(addTab({
            key: currentPath,
            label: menuItem.label as string,
            path: currentPath
          }))
        } else {
          // 确保当前路由对应的标签是激活状态
          if (state.tabs.activeTab !== currentPath) {
            dispatch(setActiveTab(currentPath))
          }
        }
      }
    }
  }, [location.pathname, dispatch, menuItems])


  // 当激活标签页变化时，更新路由
  useEffect(() => {
    // 只有当activeTabKey有效且不等于当前路由时才导航
    if (activeTabKey && activeTabKey !== location.pathname) {
      // 使用setTimeout创建一个宏任务，避免微任务队列中的状态更新冲突
      // 设置一个小延迟，确保Redux状态完全更新
      const timer = setTimeout(() => {
        navigate(activeTabKey)
      }, 0)
      
      return () => clearTimeout(timer)
    }
  }, [activeTabKey, location.pathname, navigate])



  // 处理标签页关闭
  const handleTabClose = (key: string) => {
    // 直接移除标签页，让Redux reducer处理激活标签的切换逻辑
    // 这样可以避免所有状态更新和UI渲染的时序问题
    dispatch(removeTab(key))
  }

  // 刷新当前标签页内容
  const handleReloadCurrentTab = () => {
    setReloadKey(prev => prev + 1)
  }

  // 标签页右键菜单配置
  const getTabMenu = (tabKey: string) => {
    const tab = tabs.find(t => t.key === tabKey)
    if (!tab) return []

    return [
      {
        key: 'reload',
        label: '刷新',
        icon: <ReloadOutlined />,
        onClick: () => handleReloadCurrentTab()
      },
      {
        key: 'pin',
        label: tab.pinned ? '取消固定' : '固定',
        icon: <PushpinOutlined />,
        onClick: () => dispatch(togglePinTab(tabKey))
      },
      {
        key: 'close',
        label: '关闭',
        icon: <CloseOutlined />,
        disabled: tab.pinned,
        onClick: () => dispatch(removeTab(tabKey))
      },
      {
        key: 'closeOther',
        label: '关闭其他标签页',
        onClick: () => dispatch(removeOtherTabs())
      },
      {
        key: 'closeAll',
        label: '关闭全部标签页',
        onClick: () => dispatch(removeAllTabs())
      }
    ]
  }

  // 渲染标签页内容
  const renderTabContent = () => {
    return (
      <Content className="page-content" key={reloadKey}>
        <Outlet />
      </Content>
    )
  }

  // 处理菜单项点击
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  // 切换布局类型
  const toggleLayout = () => {
    setLayoutType(prev => prev === 'side' ? 'top' : 'side')
  }

  // 切换侧边栏折叠状态
  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <AntLayout className={`app-layout ${layoutType === 'top' ? 'top-layout' : 'side-layout'}`}>
      {/* 侧边导航布局 */}
      {layoutType === 'side' && (
        <>
          <Header className="app-header">
            <div className="logo">React Tabs Nav Demo</div>
            <Button 
              type="text" 
              icon={layoutType === 'side' ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
              onClick={toggleLayout}
              className="layout-toggle-btn"
            />
          </Header>
          <AntLayout>
            <Sider 
              width={collapsed ? 80 : 200} 
              theme="light" 
              className="app-sider"
              collapsible
              collapsed={collapsed}
              onCollapse={setCollapsed}
            >
              <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={handleMenuClick}
                items={menuItems}
                className="app-menu"
                inlineCollapsed={collapsed}
              />
            </Sider>
            <AntLayout className="app-content">
              <div className="custom-tab-bar">
                <div className="tab-list">
                  {tabs.map(tab => {
                    const isActive = activeTabKey === tab.key
                    
                    return (
                      <Dropdown 
                        key={tab.key}
                        menu={{ items: getTabMenu(tab.key) }}
                        trigger={['contextMenu']}
                      >
                        <div
                          className={`custom-tab ${isActive ? 'active' : ''} ${tab.pinned ? 'pinned' : ''}`}
                          onClick={(e) => {
                            // 检查点击目标是否是关闭按钮或其内部元素
                            // 如果不是，则执行导航
                            const isCloseButton = e.target.closest('.tab-close-btn')
                            if (!isCloseButton) {
                              navigate(tab.key)
                            }
                          }}
                        >
                          <span>{tab.label}</span>
                          {tabs.length > 1 && tab.closable !== false && !tab.pinned && (
                            <Button
                              type="text"
                              size="small"
                              icon={<CloseOutlined />}
                              className="tab-close-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTabClose(tab.key)
                              }}
                            />
                          )}
                          {tab.pinned && <PushpinOutlined className="pin-icon" />}
                        </div>
                      </Dropdown>
                    )
                  })}
                </div>
              </div>
              {renderTabContent()}
            </AntLayout>
          </AntLayout>
        </>
      )}
      
      {/* 顶部导航布局 */}
      {layoutType === 'top' && (
        <>
          <Header className="app-header top-header">
            <div className="logo">React Tabs Nav Demo</div>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              onClick={handleMenuClick}
              items={menuItems}
              className="app-menu top-menu"
            />
            <Button 
              type="text" 
              icon={<MenuFoldOutlined />} 
              onClick={toggleLayout}
              className="layout-toggle-btn"
            />
          </Header>
          <AntLayout className="app-content">
            <div className="custom-tab-bar">
              <div className="tab-list">
                {tabs.map(tab => {
                  const isActive = activeTabKey === tab.key
                  
                  return (
                    <Dropdown 
                      key={tab.key}
                      menu={{ items: getTabMenu(tab.key) }}
                      trigger={['contextMenu']}
                    >
                      <div
                        className={`custom-tab ${isActive ? 'active' : ''} ${tab.pinned ? 'pinned' : ''}`}
                        onClick={(e) => {
                          // 检查点击目标是否是关闭按钮或其内部元素
                          // 如果不是，则执行导航
                          const isCloseButton = e.target.closest('.tab-close-btn')
                          if (!isCloseButton) {
                            navigate(tab.key)
                          }
                        }}
                      >
                        <span>{tab.label}</span>
                        {tabs.length > 1 && tab.closable !== false && !tab.pinned && (
                          <Button
                            type="text"
                            size="small"
                            icon={<CloseOutlined />}
                            className="tab-close-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTabClose(tab.key)
                            }}
                          />
                        )}
                        {tab.pinned && <PushpinOutlined className="pin-icon" />}
                      </div>
                    </Dropdown>
                  )
                })}
              </div>
            </div>
            {renderTabContent()}
          </AntLayout>
        </>
      )}
    </AntLayout>
  )
}

export default Layout