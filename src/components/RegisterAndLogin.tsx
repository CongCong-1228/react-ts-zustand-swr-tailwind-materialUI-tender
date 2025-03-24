import { useLocalStore } from '@/stores/useLocalStore';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { getVerificationCode, supplierLogin } from '@/request/xstage';

// 定义表单错误类型
interface FormErrors {
  account: string;
  password: string;
  verificationCode: string;
}

export const RegisterAndLogin = () => {
  const navigate = useNavigate();
  // 使用状态管理表单数据，替代useRef
  const [formValues, setFormValues] = useState({
    account: '',
    password: '',
    verificationCode: '',
  });
  // 表单错误信息
  const [errors, setErrors] = useState<FormErrors>({
    account: '',
    password: '',
    verificationCode: '',
  });
  // 跟踪字段是否被触摸过
  const [touched, setTouched] = useState({
    account: false,
    password: false,
    verificationCode: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info'>('info');
  const [alertOpen, setAlertOpen] = useState(false);
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const token = useLocalStore((state) => state.token);
  const customer = useLocalStore((state) => state.customer);
  const setToken = useLocalStore.getState().setToken;
  const setCustomer = useLocalStore.getState().setCustomer;


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword); // 切换密码可见状态
  };

  // 字段验证函数
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'account':
        if (!value.trim()) return '请输入账号';
        return '';
      case 'password':
        if (!value.trim()) return '请输入密码';
        return '';
      case 'verificationCode':
        if (!value.trim()) return '请输入验证码';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    const { value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));

    // 如果字段已经被触摸过，实时验证
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formValues[name as keyof typeof formValues])
    }));
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const showAlert = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 验证所有字段
    const newErrors = {
      account: validateField('account', formValues.account),
      password: validateField('password', formValues.password),
      verificationCode: validateField('verificationCode', formValues.verificationCode),
    };

    setErrors(newErrors);
    setTouched({
      account: true,
      password: true,
      verificationCode: true,
    });

    // 如果有错误，停止提交
    if (newErrors.account || newErrors.password || newErrors.verificationCode) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 获取验证码UUID
      const captchaUuid = useLocalStore.getState().captchaUuid;
      console.log('captchaUuid', captchaUuid);

      // 登录逻辑
      const response = await supplierLogin('loginSupplier', {
        account: formValues.account,
        password: formValues.password,
        verificationCode: formValues.verificationCode.toLocaleUpperCase(),
        Uuid: captchaUuid, // 添加验证码UUID
      });

      // 根据后端API的实际返回结构处理
      const responseData = response?.data || {};

      // 根据实际响应结构处理
      if (responseData.code === 1) {
        showAlert('登录成功', 'success');
        setToken(responseData.data?.token);
        setCustomer(responseData.data?.user);
        // 登录成功 清除表单
        setFormValues(prev => ({ ...prev, verificationCode: '', account: '', password: '' }));
        navigate('/');
      } else {
        // 处理登录失败
        showAlert(responseData.msg || '登录失败，请检查账号密码', 'error');
        // 如果是验证码错误，刷新验证码
        // if (responseData.msg.includes('验证码')) {
          fetchCaptcha();
          setFormValues(prev => ({ ...prev, verificationCode: '' }));
        // }
      }
    } catch (error:any) {
      console.error('登录出错:', error);
      showAlert('登录过程中出现错误，请稍后重试', 'error');
      fetchCaptcha();
      setFormValues(prev => ({ ...prev, verificationCode: '' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    useLocalStore .getState().logout();
    setOpen(false);
    setAlertOpen(false);
    setFormValues(prev => ({ ...prev, verificationCode: '', account: '', password: '' }));
    fetchCaptcha();
    // 刷新页面
    window.location.reload();
  };

  // 获取验证码的函数
  const fetchCaptcha = async () => {
    if (token) return;
    try {
      setLoadingCaptcha(true);
      const response = await getVerificationCode('getVerificationCode');
      const captchaUuid = response.headers['uuid']
      if (captchaUuid) {
        useLocalStore.getState().setCaptchaUuid(captchaUuid);
      } else {
        console.warn('未能从响应头中获取验证码UUID');
      }
      const imageUrl = URL.createObjectURL(response.data);
      setCaptchaImage(imageUrl);
    } catch (error) {
      showAlert('获取验证码失败，请点击刷新', 'error');
    } finally {
      setLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    // 如果已经登录，则不需要获取验证码
      fetchCaptcha();

    // 组件卸载时清理
    return () => {
      if (captchaImage) {
        URL.revokeObjectURL(captchaImage);
      }
    };
  }, []);

  if (token) {
    return (
      <div className="flex h-full max-w-[40%] flex-1 flex-col items-center justify-start border-[1px] border-[#cbcbcb] p-8 shadow-lg">
        <h1 className="w-full border-b-[1px] border-[#cbcbcb] pb-2 pl-4 text-xl font-bold text-[#3a66fb]">
          欢迎回来，{customer?.name || '用户'}!
        </h1>
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 py-4 ">
          {/* 供应商信息 */}
          <Card className=" w-full">
            <CardContent>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: 2,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                公司名称: {customer?.account}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: 2,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                邮箱: {customer?.mail}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: 2,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                电话: {customer?.tel}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: 2,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                地址: {customer?.address}
              </Typography>
            </CardContent>
          </Card>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-4 py-4">
          <button
            onClick={() => setOpen(true)}
            className="w-full rounded-md bg-[#3a66fb] p-4 text-lg text-white transition duration-200 hover:bg-[#4e87ea]"
          >
            登出
          </button>
        </div>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              minWidth: '400px',
              padding: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }
          }}
        >
          <DialogTitle sx={{
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 600,
            color: '#333',
            pb: 1
          }}>
            退出登录
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <DialogContentText sx={{
              textAlign: 'center',
              fontSize: '16px',
              color: '#666',
              margin: 0
            }}>
              退出登录后，您需要重新登录才能继续使用。
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{
            justifyContent: 'center',
            gap: 2,
            pb: 2,
            px: 3
          }}>
            <Button
              onClick={() => setOpen(false)}
              variant="outlined"
              color="inherit"
              sx={{
                minWidth: '100px',
                borderRadius: '8px',
                color: '#666',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              取消
            </Button>
            <Button
              onClick={handleLogout}
              variant="contained"
              color="error"
              sx={{
                minWidth: '100px',
                borderRadius: '8px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                  backgroundColor: '#d32f2f'
                }
              }}
            >
              确认退出
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  } else {
    return (
      <div className="flex h-full max-w-[40%] flex-1 flex-col items-center justify-start border-[1px] border-[#cbcbcb] p-8 shadow-lg">
        <h1 className="w-full border-b-[1px] border-[#cbcbcb] pb-2 pl-4 text-xl font-bold text-[#3a66fb]">
          供应商登录
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center gap-4 py-4"
        >
          <div className="flex w-full flex-col">
            <div className={`flex items-center rounded-md ${errors.account ? 'mb-1' : 'mb-4'}`}>
              <TextField
                placeholder="账号"
                name="account"
                required
                value={formValues.account}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e, 'account')
                }
                onBlur={() => handleBlur('account')}
                error={touched.account && !!errors.account}
                helperText={touched.account && errors.account}
                className="w-full rounded-md border-none p-4 text-lg focus:outline-none"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon
                          size="lg"
                          icon={faUser}
                          className="p-4 pl-0 pr-0 text-[#cbcbcb]"
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
            <div className={`mb-4 flex items-center rounded-md ${errors.password ? 'mb-1' : 'mb-4'}`}>
              <TextField
                placeholder="密码"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formValues.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e, 'password')
                }
                onBlur={() => handleBlur('password')}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                className="w-full rounded-md border-none p-4 text-lg focus:outline-none"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon
                          size="lg"
                          icon={faLock}
                          className="p-4 pl-0 pr-0 text-[#cbcbcb]"
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
            {/* 验证码区域 */}
            <div className={`mb-4 flex items-start gap-4 ${errors.verificationCode ? 'mb-1' : 'mb-4'}`}>
              <TextField
                placeholder="验证码"
                name="verificationCode"
                value={formValues.verificationCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e, 'verificationCode')
                }
                onBlur={() => handleBlur('verificationCode')}
                error={touched.verificationCode && !!errors.verificationCode}
                helperText={touched.verificationCode && errors.verificationCode}
                className="flex-1 rounded-md border-none p-4 text-lg focus:outline-none"
              />
              <Box
                className="h-[56px] w-[200px] cursor-pointer overflow-hidden rounded-md border border-[#cbcbcb]"
                onClick={() => {
                  if (!loadingCaptcha) {
                    fetchCaptcha();
                  }
                }}
              >
                {loadingCaptcha ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <CircularProgress size={24} />
                  </div>
                ) : captchaImage ? (
                  <img
                    src={captchaImage}
                    alt="验证码"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#999]">
                    点击获取
                  </div>
                )}
              </Box>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-md p-4 text-lg text-white transition duration-200 ${
                isSubmitting
                  ? 'bg-[#a0b4fa] cursor-not-allowed'
                  : 'bg-[#3a66fb] hover:bg-[#4e87ea]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <CircularProgress size={20} color="inherit" className="mr-2" />
                  登录中...
                </div>
              ) : (
                '登录'
              )}
            </button>
          </div>
        </form>
        <div className="flex items-center gap-2">
          <span>还没有账号？</span>
          <NavLink to="/supplier-registration" className="text-[#3a66fb]">
            立即注册
          </NavLink>
        </div>

        {/* 消息提示 */}
        <Snackbar
          open={alertOpen}
          autoHideDuration={2000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleAlertClose}
            severity={alertSeverity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    );
  }
};
