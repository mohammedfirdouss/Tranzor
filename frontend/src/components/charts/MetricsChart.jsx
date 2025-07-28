import React, { useState } from 'react';
import { Line, Gauge, Liquid } from '@ant-design/charts';
import { Card, Select, Row, Col, Statistic, Typography, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export const SystemPerformanceChart = ({ data, loading = false }) => {
  const [metric, setMetric] = useState('tps');
  
  const config = {
    data: data[metric] || [],
    xField: 'time',
    yField: 'value',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: '#1890ff',
    point: {
      size: 3,
      shape: 'circle',
      style: {
        fill: '#1890ff',
        stroke: '#fff',
        lineWidth: 1,
      },
    },
    tooltip: {
      formatter: (datum) => {
        const unit = metric === 'tps' ? 'tx/s' : 
                    metric === 'latency' ? 'ms' : 
                    metric === 'memory' ? 'MB' : '%';
        return {
          name: metric.toUpperCase(),
          value: `${datum.value} ${unit}`,
        };
      },
    },
    yAxis: {
      label: {
        formatter: (value) => {
          const unit = metric === 'tps' ? 'tx/s' : 
                      metric === 'latency' ? 'ms' : 
                      metric === 'memory' ? 'MB' : '%';
          return `${value}${unit}`;
        },
      },
    },
  };

  return (
    <Card 
      title="System Performance" 
      loading={loading}
      extra={
        <Select 
          value={metric} 
          onChange={setMetric}
          style={{ width: 120 }}
        >
          <Option value="tps">TPS</Option>
          <Option value="latency">Latency</Option>
          <Option value="memory">Memory</Option>
          <Option value="cpu">CPU</Option>
        </Select>
      }
    >
      <Line {...config} height={250} />
    </Card>
  );
};

export const SystemHealthGauges = ({ metrics, loading = false }) => {
  const cpuConfig = {
    percent: (metrics?.cpuUsage || 0) / 100,
    range: {
      color: ['#30BF78', '#FAAD14', '#F4664A'],
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      content: {
        style: {
          fontSize: '24px',
          lineHeight: '24px',
          fontWeight: 600,
        },
        formatter: () => `${(metrics?.cpuUsage || 0).toFixed(1)}%`,
      },
    },
  };

  const memoryConfig = {
    percent: (metrics?.memoryUsage || 0) / 100,
    range: {
      color: ['#30BF78', '#FAAD14', '#F4664A'],
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      content: {
        style: {
          fontSize: '24px',
          lineHeight: '24px',
          fontWeight: 600,
        },
        formatter: () => `${(metrics?.memoryUsage || 0).toFixed(1)}%`,
      },
    },
  };

  const uptimeConfig = {
    percent: (metrics?.uptime || 0) / 100,
    outline: {
      border: 4,
      distance: 8,
    },
    wave: {
      length: 128,
    },
    statistic: {
      content: {
        style: {
          fontSize: '24px',
          lineHeight: '24px',
          fontWeight: 600,
          color: '#fff',
        },
        formatter: () => `${(metrics?.uptime || 0).toFixed(1)}%`,
      },
    },
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card title="CPU Usage" loading={loading}>
          <Gauge {...cpuConfig} height={200} />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card title="Memory Usage" loading={loading}>
          <Gauge {...memoryConfig} height={200} />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card title="System Uptime" loading={loading}>
          <Liquid {...uptimeConfig} height={200} />
        </Card>
      </Col>
    </Row>
  );
};

export const RealtimeMetrics = ({ metrics, loading = false }) => {
  const calculateTrend = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const tpsTrend = calculateTrend(metrics?.currentTps, metrics?.previousTps);
  const latencyTrend = calculateTrend(metrics?.averageLatency, metrics?.previousLatency);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading}>
          <Statistic
            title="Current TPS"
            value={metrics?.currentTps || 0}
            precision={1}
            valueStyle={{ 
              color: tpsTrend >= 0 ? '#3f8600' : '#cf1322',
              fontSize: '24px',
              fontWeight: 600
            }}
            prefix={tpsTrend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="tx/s"
          />
          {tpsTrend !== 0 && (
            <Text type={tpsTrend >= 0 ? 'success' : 'danger'} style={{ fontSize: '12px' }}>
              {tpsTrend >= 0 ? '+' : ''}{tpsTrend.toFixed(1)}% from last hour
            </Text>
          )}
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading}>
          <Statistic
            title="Avg Latency"
            value={metrics?.averageLatency || 0}
            precision={0}
            valueStyle={{ 
              color: latencyTrend <= 0 ? '#3f8600' : '#cf1322',
              fontSize: '24px',
              fontWeight: 600
            }}
            prefix={latencyTrend <= 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
            suffix="ms"
          />
          {latencyTrend !== 0 && (
            <Text type={latencyTrend <= 0 ? 'success' : 'danger'} style={{ fontSize: '12px' }}>
              {latencyTrend >= 0 ? '+' : ''}{latencyTrend.toFixed(1)}% from last hour
            </Text>
          )}
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading}>
          <Statistic
            title="Success Rate"
            value={metrics?.successRate || 0}
            precision={2}
            valueStyle={{ 
              color: (metrics?.successRate || 0) >= 95 ? '#3f8600' : '#cf1322',
              fontSize: '24px',
              fontWeight: 600
            }}
            suffix="%"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading}>
          <Statistic
            title="Active Alerts"
            value={metrics?.activeAlerts || 0}
            valueStyle={{ 
              color: (metrics?.activeAlerts || 0) === 0 ? '#3f8600' : '#cf1322',
              fontSize: '24px',
              fontWeight: 600
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};