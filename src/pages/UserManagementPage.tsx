import { Table, Button, Space, Modal, Form, Input, Select, Tag } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { ColumnsType } from 'antd/es/table'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createTime: string
}

// 模拟用户数据
const mockUsers: User[] = [
  { id: '1', name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active', createTime: '2024-01-01' },
  { id: '2', name: '李四', email: 'lisi@example.com', role: 'user', status: 'active', createTime: '2024-01-02' },
  { id: '3', name: '王五', email: 'wangwu@example.com', role: 'user', status: 'inactive', createTime: '2024-01-03' },
  { id: '4', name: '赵六', email: 'zhaoliu@example.com', role: 'editor', status: 'active', createTime: '2024-01-04' },
  { id: '5', name: '钱七', email: 'qianqi@example.com', role: 'user', status: 'active', createTime: '2024-01-05' }
]

function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()

  // 打开新增/编辑模态框
  const showModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      form.setFieldsValue(user)
    } else {
      setEditingUser(null)
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // 编辑用户
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ))
      } else {
        // 新增用户
        const newUser: User = {
          id: String(users.length + 1),
          ...values,
          createTime: new Date().toISOString().split('T')[0],
          status: 'active'
        }
        setUsers([...users, newUser])
      }
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  // 删除用户
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      onOk: () => setUsers(users.filter(user => user.id !== id))
    })
  }

  // 表格列配置
  const columns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = ''
        switch (role) {
          case 'admin': color = 'red'; break
          case 'editor': color = 'blue'; break
          default: color = 'green'
        }
        return <Tag color={color}>{role}</Tag>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>{status}</Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      )
    }
  ]

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            新增用户
          </Button>
        </Space>
        <Input.Search placeholder="搜索用户" style={{ width: 240 }} prefix={<SearchOutlined />} />
      </div>
      <Table columns={columns} dataSource={users} rowKey="id" />
      
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select options={[
              { label: '管理员', value: 'admin' },
              { label: '编辑', value: 'editor' },
              { label: '用户', value: 'user' }
            ]} />
          </Form.Item>
          {editingUser && (
            <Form.Item name="status" label="状态">
              <Select options={[
                { label: '激活', value: 'active' },
                { label: '禁用', value: 'inactive' }
              ]} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default UserManagementPage