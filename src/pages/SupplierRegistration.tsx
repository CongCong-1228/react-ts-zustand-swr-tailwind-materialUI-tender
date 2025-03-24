import { useState } from 'react';
import { TextField, Button, Snackbar, Alert, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { supplierRegister } from '@/request/xstage';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const SupplierRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    account: '',
    director: '',
    tel: '',
    address: '',
    mail: '',
    license: '',
    legalMan: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // 清除当前字段的错误信息
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 验证账号
    if (!formData.account.trim()) {
      newErrors.account = '请输入账号';
    }

    // 验证密码
    if (!formData.password.trim()) {
      newErrors.password = '请输入密码';
    }

    // 验证公司名称
    if (!formData.name.trim()) {
      newErrors.name = '请输入公司名称';
    }

    // 验证注册地址
    if (!formData.address.trim()) {
      newErrors.address = '请输入注册地址';
    }

    // 验证联系人
    if (!formData.director.trim()) {
      newErrors.director = '请输入联系人';
    }

    // 验证联系电话
    if (!formData.tel.trim()) {
      newErrors.tel = '请输入联系电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.tel)) {
      newErrors.tel = '请输入有效的联系电话';
    }

    // 验证邮箱
    if (!formData.mail.trim()) {
      newErrors.mail = '请输入邮箱';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.mail)) {
      newErrors.mail = '请输入有效的邮箱地址';
    }

    // 验证营业执照
    if (!formData.license.trim()) {
      newErrors.license = '请输入营业执照注册号';
    }

    // 验证法人代表
    if (!formData.legalMan.trim()) {
      newErrors.legalMan = '请输入法人代表';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await supplierRegister('insertSupplier', formData);
      if (response.data.code === 1) {
        setOpenDialog(true);
        // 清空表单
        setFormData({
          name: '',
          password: '',
          account: '',
          director: '',
          tel: '',
          address: '',
          mail: '',
          license: '',
          legalMan: '',
          });
      } else {
        setNotification({
          open: true,
          message: response.data.msg,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('注册失败:', error);
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : '注册失败，请稍后再试',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword); // 切换密码可见状态
  };

  const handleGoToLogin = () => {
    setOpenDialog(false);
    navigate('/'); // 确保这里的路径与你的登录页面路由匹配
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <section className="flex w-full flex-col items-center">
      <img
        src="https://img.axureshop.com/58/99/e0/5899e058a8a54fe6a34e20f05a532e0c/images/%E4%BC%9A%E5%91%98%E6%B3%A8%E5%86%8C/u474.png"
        alt=""
        className="h-[200px] w-full object-cover"
      />
      <div className="mt-6 flex h-16 w-full items-center justify-between border-b-[1px] border-[#cbcbcb] px-6 pb-2">
        <h1 className="text-2xl font-bold text-[#3a66fb]">供应商注册</h1>
      </div>
      <section className="w-full">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} className="p-4">
          <Grid size={6}>
              <TextField
                fullWidth
                label="账号"
                name="account"
                value={formData.account}
                onChange={handleChange}
                error={!!errors.account}
                helperText={errors.account}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                type={showPassword ? 'text' : 'password'}
                fullWidth
                label="密码"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                slotProps={{
                  input: {
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
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="公司名称"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            {/* <Grid size={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="w-full"
                  label="注册日期"
                  value={formData.registrationDate}
                  onChange={handleDateChange}
                  // renderInput={(params: any) => (
                  //   <TextField {...params} fullWidth required />
                  // )}
                />
              </LocalizationProvider>
            </Grid> */}
            <Grid size={6}>
              <TextField
                fullWidth
                label="注册地址"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="联系人"
                name="director"
                value={formData.director}
                onChange={handleChange}
                error={!!errors.director}
                helperText={errors.director}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="联系电话"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                error={!!errors.tel}
                helperText={errors.tel}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="邮箱"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                error={!!errors.mail}
                helperText={errors.mail}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="营业执照注册号"
                name="license"
                value={formData.license}
                onChange={handleChange}
                error={!!errors.license}
                helperText={errors.license}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="法人代表"
                name="legalMan"
                value={formData.legalMan}
                onChange={handleChange}
                error={!!errors.legalMan}
                helperText={errors.legalMan}
              />
            </Grid>
            <Grid size={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交注册'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </section>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: '400px',
            padding: '16px'
          }
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 600,
            color: '#2E7D32', // 使用绿色表示成功
            pb: 1
          }}
        >
          注册成功
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <div style={{
            textAlign: 'center',
            fontSize: '16px',
            color: '#555'
          }}>
            恭喜您完成注册！是否立即前往登录页面？
          </div>
        </DialogContent>
        <DialogActions sx={{
          justifyContent: 'center',
          gap: 2,
          pb: 2
        }}>
          <Button
            onClick={handleCloseDialog}
            color="inherit"
            variant="outlined"
            sx={{
              minWidth: '120px',
              borderRadius: '8px'
            }}
          >
            稍后登录
          </Button>
          <Button
            onClick={handleGoToLogin}
            color="primary"
            variant="contained"
            sx={{
              minWidth: '120px',
              borderRadius: '8px'
            }}
          >
            立即登录
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};
