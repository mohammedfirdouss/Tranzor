import React from 'react';
import { Line, Column, Pie } from '@ant-design/charts';
import { Card, Select, Row, Col, Typography } from 'antd';

const { Title } = Typography;
const { Option } = Select;

export const TransactionTrendChart = ({ data, loading = false }) => {
  const config = {
    data,
    xField: 'date',
    yField: 'count',
    seriesField: 'status',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#52c41a', '#ff4d4f', '#fa8c16', '#1890ff'],
    legend: {
      position: 'top',
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.status,
          value: `${datum.count} transactions`,
        };
      },
    },
    theme: {
      geometries: {
        point: {
          circle: {
            active: {
              style: {
                r: 4,
                fillOpacity: 1,
                stroke: '#000',
                lineWidth: 1,
              },
            },
          },
        },
      },
    },
  };

  return (
    <Card title="Transaction Trends (Last 7 Days)" loading={loading}>
      <Line {...config} height={300} />
    </Card>
  );
};

export const TransactionVolumeChart = ({ data, loading = false }) => {
  const config = {
    data,
    xField: 'type',
    yField: 'amount',
    seriesField: 'currency',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1'],
    legend: {
      position: 'top',
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: `${datum.type} (${datum.currency})`,
          value: `$${datum.amount.toLocaleString()}`,
        };
      },
    },
    label: {
      position: 'top',
      formatter: (datum) => `$${(datum.amount / 1000).toFixed(0)}K`,
    },
  };

  return (
    <Card title="Transaction Volume by Type" loading={loading}>
      <Column {...config} height={300} />
    </Card>
  );
};

export const TransactionDistributionChart = ({ data, loading = false }) => {
  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.4,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    color: ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2'],
    legend: {
      position: 'bottom',
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.type,
          value: `${datum.value} transactions`,
        };
      },
    },
  };

  return (
    <Card title="Transaction Distribution" loading={loading}>
      <Pie {...config} height={300} />
    </Card>
  );
};

export const FraudScoreChart = ({ data, loading = false }) => {
  const config = {
    data,
    xField: 'scoreRange',
    yField: 'count',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: (datum) => {
      if (datum.scoreRange.includes('0-20')) return '#52c41a';
      if (datum.scoreRange.includes('21-40')) return '#1890ff';
      if (datum.scoreRange.includes('41-60')) return '#fa8c16';
      if (datum.scoreRange.includes('61-80')) return '#ff7875';
      return '#ff4d4f';
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: `Risk Score ${datum.scoreRange}`,
          value: `${datum.count} transactions`,
        };
      },
    },
    label: {
      position: 'top',
      formatter: (datum) => datum.count,
    },
  };

  return (
    <Card title="Fraud Score Distribution" loading={loading}>
      <Column {...config} height={300} />
    </Card>
  );
};