import { Card, Statistic, Row, Col, Progress } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'

function DashboardPage() {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic
            title="总访问量"
            value={2781}
            precision={0}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
            suffix="次"
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="今日访问"
            value={128}
            precision={0}
            valueStyle={{ color: '#cf1322' }}
            prefix={<ArrowUpOutlined />}
            suffix="次"
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="平均停留时间"
            value={180}
            precision={0}
            valueStyle={{ color: '#1890ff' }}
            suffix="秒"
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="系统资源使用情况">
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: 'inline-block', marginBottom: 10 }}>CPU 使用率</span>
            <Progress percent={65} status="active" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: 'inline-block', marginBottom: 10 }}>内存使用率</span>
            <Progress percent={45} status="active" />
          </div>
          <div>
            <span style={{ display: 'inline-block', marginBottom: 10 }}>磁盘使用率</span>
            <Progress percent={80} status="exception" />
          </div>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="业务指标">
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: 'inline-block', marginBottom: 10 }}>转化率</span>
            <Progress percent={30} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={{ display: 'inline-block', marginBottom: 10 }}>完成率</span>
            <Progress percent={75} />
          </div>
          <div>
            <span style={{ display: 'inline-block', marginBottom: 10 }}>满意度</span>
            <Progress percent={92} status="success" />
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default DashboardPage