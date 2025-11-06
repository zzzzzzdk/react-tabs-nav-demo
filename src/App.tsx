import { useState, createContext, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/AppRoutes'
import './App.css'

// 创建主题上下文
export const ThemeContext = createContext<{
  themeMode: 'light' | 'dark'
  toggleTheme: () => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
}>({
  themeMode: 'light',
  toggleTheme: () => {},
  primaryColor: '#1890ff',
  setPrimaryColor: () => {}
})

function App() {
  // 从localStorage中获取主题设置（如果有）
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    localStorage.getItem('themeMode') as 'light' | 'dark' || 'light'
  )
  const [primaryColor, setPrimaryColor] = useState<string>(
    localStorage.getItem('primaryColor') || '#1890ff'
  )

  // 切换主题模式
  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(newTheme)
    localStorage.setItem('themeMode', newTheme)
  }

  // 保存主题色到localStorage
  useEffect(() => {
    localStorage.setItem('primaryColor', primaryColor)
  }, [primaryColor])

  // 根据主题模式设置CSS变量
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // 设置主色调CSS变量
    document.documentElement.style.setProperty('--primary-color', primaryColor)
  }, [themeMode, primaryColor])

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, primaryColor, setPrimaryColor }}>
      <div className={`app-container ${themeMode === 'dark' ? 'dark' : ''}`}>
        <RouterProvider router={router} />
      </div>
    </ThemeContext.Provider>
  )
}

export default App
