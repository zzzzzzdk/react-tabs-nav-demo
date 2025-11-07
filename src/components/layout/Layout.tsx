import { useEffect, useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Layout as AntLayout, Menu, Button, Dropdown, Modal, ConfigProvider } from 'antd'
import {
  HomeOutlined, 
  DashboardOutlined, 
  UserOutlined, 
  SettingOutlined, 
  CloseOutlined,
  ReloadOutlined,
  PushpinOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  TableOutlined
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
import { theme } from 'antd'
import type { ThemeConfig } from 'antd'
import './Layout.css'
import { ThemeContext } from '../../App'

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
    key: '/data-table',
    icon: <TableOutlined />,
    label: '数据表格'
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
  const [colorPaletteVisible, setColorPaletteVisible] = useState(false)
  
  // 从全局主题上下文获取主题设置
  const { themeMode, toggleTheme, primaryColor, setPrimaryColor } = useContext(ThemeContext)

  // 颜色选项
  const colorOptions = [
    { name: '蓝色', value: '#1890ff' },
    { name: '紫色', value: '#722ed1' },
    { name: '青色', value: '#13c2c2' },
    { name: '绿色', value: '#52c41a' },
    { name: '橙色', value: '#fa8c16' },
    { name: '红色', value: '#f5222d' },
  ]

  // 主题配置
  const themeConfig: ThemeConfig = {
    algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor,
    },
  }

  // 处理颜色变化
  const handleColorChange = (color: string) => {
    setPrimaryColor(color)
  }

  // 处理路由变化，同步到标签页
  useEffect(() => {
    const currentPath = location.pathname
    
    if (menuItems && Array.isArray(menuItems)) {
      const menuItem = menuItems.find(item => item && typeof item === 'object' && 'key' in item && item.key === currentPath)
      
      if (menuItem && typeof menuItem === 'object' && 'label' in menuItem) {
        const state = store.getState()
        const existingTab = state.tabs.tabs.find(tab => tab.key === currentPath)
        
        if (!existingTab) {
          dispatch(addTab({
            key: currentPath,
            label: menuItem.label as string,
            path: currentPath
          }))
        } else {
          if (state.tabs.activeTab !== currentPath) {
            dispatch(setActiveTab(currentPath))
          }
        }
      }
    }
  }, [location.pathname, dispatch, menuItems])

  // 当激活标签页变化时，更新路由
  useEffect(() => {
    if (activeTabKey && activeTabKey !== location.pathname) {
      const timer = setTimeout(() => {
        navigate(activeTabKey)
      }, 0)
      
      return () => clearTimeout(timer)
    }
  }, [activeTabKey, location.pathname, navigate])

  // 处理标签页关闭
  const handleTabClose = (key: string) => {
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
    <ConfigProvider theme={themeConfig}>
      <AntLayout className={`app-layout ${layoutType === 'top' ? 'top-layout' : 'side-layout'} ${themeMode === 'dark' ? 'dark' : ''}`}>
        {/* 侧边导航布局 */}
        {layoutType === 'side' && (
          <>
            <Header className="app-header">
              <div className="logo">React Tabs Nav Demo</div>
              <div className="header-actions">
                <Button 
                  type="text" 
                  icon={themeMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                  onClick={toggleTheme}
                  className="theme-toggle-btn"
                />
                <Button 
                  type="text" 
                  icon={<SettingOutlined />}
                  onClick={() => setColorPaletteVisible(true)}
                  className="theme-setting-btn"
                />
              </div>
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
              <div className="header-actions">
                <Button 
                  type="text" 
                  icon={themeMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                  onClick={toggleTheme}
                  className="theme-toggle-btn"
                />
                <Button 
                  type="text" 
                  icon={<SettingOutlined />}
                  onClick={() => setColorPaletteVisible(true)}
                  className="theme-setting-btn"
                />
              </div>
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
      <Modal
        title="主题设置"
        open={colorPaletteVisible}
        onCancel={() => setColorPaletteVisible(false)}
        footer={null}
        width={350}
      >
        <div className="theme-settings">
          <div className="setting-item">
            <div className="setting-label">主题色彩</div>
            <div className="color-dropdown">
              {colorOptions.map(color => (
                <div
                  key={color.value}
                  className={`color-item ${primaryColor === color.value ? 'selected' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorChange(color.value)}
                >
                  <span className="color-label">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="setting-item">
            <div className="setting-label">主题模式</div>
            <Button.Group>
                <Button 
                  type={themeMode === 'light' ? 'primary' : 'default'} 
                  onClick={() => {
                    if (themeMode !== 'light') {
                      toggleTheme();
                    }
                  }}
                  icon={<SunOutlined />}
                >
                  浅色
                </Button>
                <Button 
                  type={themeMode === 'dark' ? 'primary' : 'default'} 
                  onClick={() => {
                    if (themeMode !== 'dark') {
                      toggleTheme();
                    }
                  }}
                  icon={<MoonOutlined />}
                >
                  深色
                </Button>
              </Button.Group>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  )
}

export default Layout