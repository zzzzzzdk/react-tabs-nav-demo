import { Form, Input, Switch, Select, Slider, Button, Card, Typography, Divider } from 'antd'
// SettingOutlined removed as it's not used

const { Title, Paragraph } = Typography
const { Option } = Select

function SettingsPage() {
  const [form] = Form.useForm()

  // 初始表单值
  const initialValues = {
    theme: 'light',
    notifications: true,
    language: 'zh-CN',
    fontSize: 14,
    autoSave: true,
    pageSize: 20
  }

  // 处理表单提交
  const handleSubmit = (values: any) => {
    console.log('Settings updated:', values)
    // 这里可以调用API保存设置
    // 实际项目中应该使用Redux action来更新设置
  }

  // 重置表单
  const handleReset = () => {
    form.resetFields()
  }

  return (
    <div>
      <Title level={2}>系统设置</Title>
      <Paragraph>配置您的系统偏好设置</Paragraph>
      
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSubmit}
        >
          <Divider orientation="left">界面设置</Divider>
          
          <Form.Item name="theme" label="主题模式">
            <Select>
              <Option value="light">浅色模式</Option>
              <Option value="dark">深色模式</Option>
              <Option value="auto">跟随系统</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="fontSize" label="字体大小">
            <Slider 
              min={12} 
              max={18} 
              marks={{
                12: '12px',
                14: '14px',
                16: '16px',
                18: '18px'
              }}
            />
          </Form.Item>
          
          <Form.Item name="language" label="语言">
            <Select>
              <Option value="zh-CN">简体中文</Option>
              <Option value="en-US">English</Option>
            </Select>
          </Form.Item>
          
          <Divider orientation="left">功能设置</Divider>
          
          <Form.Item name="notifications" label="启用通知">
            <Switch />
          </Form.Item>
          
          <Form.Item name="autoSave" label="自动保存">
            <Switch />
          </Form.Item>
          
          <Form.Item name="pageSize" label="每页显示条数">
            <Select>
              <Option value={10}>10条/页</Option>
              <Option value={20}>20条/页</Option>
              <Option value={50}>50条/页</Option>
              <Option value={100}>100条/页</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="apiKey" label="API密钥" tooltip="用于访问第三方服务的密钥">
            <Input.Password placeholder="请输入API密钥" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 16 }}>
              保存设置
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default SettingsPage