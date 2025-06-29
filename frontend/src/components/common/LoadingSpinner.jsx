import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = ({ 
  size = 'default', 
  tip = 'Loading...', 
  spinning = true,
  children,
  style = {}
}) => {
  if (children) {
    return (
      <Spin spinning={spinning} tip={tip} size={size}>
        <div style={{ minHeight: '200px', ...style }}>
          {children}
        </div>
      </Spin>
    );
  }

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px',
        ...style 
      }}
    >
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default LoadingSpinner;