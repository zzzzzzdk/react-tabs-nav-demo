"use client"

import * as React from "react"
import { useReactTable, getCoreRowModel } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 定义表格数据类型
interface UserData {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "pending"
  lastLogin: string
}

// 模拟数据
const data: UserData[] = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    role: "管理员",
    status: "active",
    lastLogin: "2024-01-15 10:30",
  },
  {
    id: "2",
    name: "李四",
    email: "lisi@example.com",
    role: "编辑",
    status: "active",
    lastLogin: "2024-01-14 14:20",
  },
  {
    id: "3",
    name: "王五",
    email: "wangwu@example.com",
    role: "用户",
    status: "inactive",
    lastLogin: "2024-01-10 09:15",
  },
  {
    id: "4",
    name: "赵六",
    email: "zhaoliu@example.com",
    role: "用户",
    status: "pending",
    lastLogin: "2024-01-08 16:45",
  },
  {
    id: "5",
    name: "钱七",
    email: "qianqi@example.com",
    role: "编辑",
    status: "active",
    lastLogin: "2024-01-15 08:50",
  },
  {
    id: "6",
    name: "孙八",
    email: "sunba@example.com",
    role: "管理员",
    status: "active",
    lastLogin: "2024-01-15 11:15",
  },
  {
    id: "7",
    name: "周九",
    email: "zhoujiu@example.com",
    role: "用户",
    status: "inactive",
    lastLogin: "2024-01-05 13:20",
  },
  {
    id: "8",
    name: "吴十",
    email: "wushi@example.com",
    role: "用户",
    status: "active",
    lastLogin: "2024-01-14 15:30",
  },
]

// 定义表格列
const columns = [
  {
    id: "name",
    header: () => <span>姓名</span>,
    cell: (info) => info.getValue(),
  },
  {
    id: "email",
    header: () => <span>邮箱</span>,
    cell: (info) => info.getValue(),
  },
  {
    id: "role",
    header: () => <span>角色</span>,
    cell: (info) => info.getValue(),
  },
  {
    id: "status",
    header: () => <span>状态</span>,
    cell: (info) => {
      const status = info.getValue()
      let bgColor = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      let label = "未知"
      
      if (status === "active") {
        bgColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
        label = "活跃"
      } else if (status === "inactive") {
        bgColor = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
        label = "禁用"
      } else if (status === "pending") {
        bgColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
        label = "待审核"
      }
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
          {label}
        </span>
      )
    },
  },
  {
    id: "lastLogin",
    header: () => <span>最后登录</span>,
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    header: () => <span>操作</span>,
    cell: (info) => {
      const user = info.row.original
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">打开菜单</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>查看详情</DropdownMenuItem>
            <DropdownMenuItem>编辑</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">删除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function DataTablePage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // 过滤数据
  const filteredData = searchQuery
    ? data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data
  
  // 创建表格实例
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">用户数据表格</h1>
          <Button>添加用户</Button>
        </div>
        
        {/* 搜索框 */}
        <div className="flex justify-end">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索用户..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* 表格容器 */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : header.column.columnDef.header()}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    没有找到数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default DataTablePage