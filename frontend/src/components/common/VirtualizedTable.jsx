import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Table, Spin } from 'antd';
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedTable = ({
  data,
  columns,
  loading = false,
  rowHeight = 54,
  containerHeight = 400,
  onRow,
  rowKey = 'id',
  pagination = false,
  scroll = { y: containerHeight },
  ...tableProps
}) => {
  const [tableWidth, setTableWidth] = useState(0);
  const containerRef = useRef(null);
  const tableRef = useRef(null);

  // Calculate table width
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setTableWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Create virtualizer
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  // Memoize virtual rows
  const virtualRows = useMemo(() => {
    return rowVirtualizer.getVirtualItems();
  }, [rowVirtualizer.getVirtualItems()]);

  // Calculate padding for virtual scrolling
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 
    ? rowVirtualizer.getTotalSize() - (virtualRows[virtualRows.length - 1].end || 0)
    : 0;

  // Transform data for virtual rendering
  const virtualData = useMemo(() => {
    return virtualRows.map((virtualRow) => data[virtualRow.index]);
  }, [virtualRows, data]);

  // Enhanced columns with fixed width for better performance
  const enhancedColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      width: column.width || 150,
      ellipsis: column.ellipsis !== false,
    }));
  }, [columns]);

  if (loading) {
    return (
      <div style={{ height: containerHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: containerHeight, overflow: 'auto' }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${paddingTop}px)`,
          }}
        >
          <Table
            ref={tableRef}
            columns={enhancedColumns}
            dataSource={virtualData}
            pagination={pagination}
            scroll={scroll}
            rowKey={rowKey}
            onRow={onRow}
            style={{ width: tableWidth }}
            {...tableProps}
          />
        </div>
      </div>
    </div>
  );
};

export default VirtualizedTable; 