import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import { logout } from '../../store/authSlice';

export default function UserMenu() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {user && <span>Welcome, {user.name || user.username || 'User'}</span>}
      <Button onClick={handleLogout} size="small">Logout</Button>
    </div>
  );
}
