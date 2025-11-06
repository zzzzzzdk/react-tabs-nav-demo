import { Card, Typography, Space } from 'antd'

const { Title, Paragraph } = Typography

function HomePage() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card>
        <Title level={2}>欢迎使用双重导航系统</Title>
        <Paragraph>
          这是一个基于React、Redux Toolkit和Ant Design实现的双重导航系统示例。
          左侧为主导航菜单，顶部为内标签页导航。
        </Paragraph>
        <Paragraph>
          您可以通过点击左侧菜单切换页面，系统会自动在顶部标签栏添加对应的标签页。
          标签页支持关闭、固定、刷新等操作。
        </Paragraph>
      </Card>
    </Space>
  )
}

export default HomePage