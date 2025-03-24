import React from 'react';
import { Snackbar, Alert, AlertProps } from '@mui/material';
import { useMessageStore } from '@/stores/useMessageStore';

// 消息提供者组件属性接口
interface MessageProviderProps {
  children: React.ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({
  children,
}) => {
  // 从 store 中获取状态和方法
  const { open, message, severity, duration, hideMessage } = useMessageStore();

  // 处理关闭事件
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      event?.preventDefault();
      return;
    }
    hideMessage();
  };

  return (
    <>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity as AlertProps['severity']}
          sx={{ width: '100%' }}
          variant="filled"
          elevation={6}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
