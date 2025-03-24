import { create } from 'zustand';

// 定义消息严重程度类型
type MessageSeverity = 'error' | 'warning' | 'info' | 'success';

// 定义消息状态接口
interface MessageState {
  open: boolean;
  message: string;
  severity: MessageSeverity;
  duration: number;
  showMessage: (params: {
    severity: MessageSeverity;
    message: string;
    duration?: number;
  }) => void;
  hideMessage: () => void;
}

// 创建消息状态管理 store
export const useMessageStore = create<MessageState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  duration: 3000,

  // 显示消息的方法
  showMessage: ({ severity, message, duration = 3000 }) =>
    set({ open: true, severity, message, duration }),

  // 隐藏消息的方法
  hideMessage: () => set({ open: false }),
}));
