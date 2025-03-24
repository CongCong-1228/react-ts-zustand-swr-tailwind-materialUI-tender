import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { parseBBCodeToHTML } from '@/utils/parse';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import {
  getMyBid,
  getTenderNoticeDetail,
  tenderNoticeBid,
} from '@/request/mes';
import { useState, useRef } from 'react';
import { Editor } from '@/components/Editor';
import { useLocalStore } from '@/stores/useLocalStore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';

export const TenderNoticeDetail = () => {
  const { id } = useParams<{ id: string }>(); // 获取路由参数
  const documentURL = import.meta.env.VITE_DOCUMENT_URL || '';
  const uploadURL = import.meta.env.VITE_UPLOAD_URL || '';
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // 保存已上传文件的服务器路径
  const [uploadedFilePaths, setUploadedFilePaths] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editorContent, setEditorContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 添加新的状态和对话框
  const [myBidDialog, setMyBidDialog] = useState(false);
  const [myBidRecord, setMyBidRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const customer = useLocalStore((state) => state.customer);

  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  // 添加 Snackbar 状态
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleOpenBidDialog = () => {
    // 检查 customer 是否为空
    if (!customer || Object.keys(customer).length === 0) {
      setOpenLoginDialog(true);
      return;
    }
    setOpenBidDialog(true);
  };

  const handleGoToLogin = () => {
    navigate('/'); // 或者你的登录页面路径
  };

  const handleCloseBidDialog = () => {
    setOpenBidDialog(false);
    setEditorContent('');
    setUploadedFiles([]);
    setUploadedFilePaths([]);
  };

  const uploadFileToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(uploadURL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`上传失败: ${response.statusText}`);
      }

      const data = await response.json();

      // 根据你的API响应结构进行解析
      if (data.code === 1) {
        const findIndex = data.msg.indexOf('|');
        const attachment = data.msg.substring(0, findIndex);
        return Promise.resolve(attachment); // 返回文件路径
      } else {
        return Promise.reject(data.msg || '上传失败');
      }
    } catch (error) {
      console.error('上传文件错误:', error);
      return Promise.reject(error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setIsUploading(true);

      try {
        // 上传所有新文件
        for (let i = 0; i < newFiles.length; i++) {
          const file = newFiles[i];
          const filePath = await uploadFileToServer(file);
          console.log('filePath', filePath);
          setUploadedFilePaths((prev) => [...prev, filePath]);
        }
      } catch (error) {
        // 移除上传失败的文件
        setUploadedFiles((prevFiles) =>
          prevFiles.filter((f) => !newFiles.includes(f)),
        );
      } finally {
        setIsUploading(false);
        // 清空文件输入，以便用户可以再次上传相同的文件
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove),
    );
    setUploadedFilePaths((prevPaths) =>
      prevPaths.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleBidSubmit = async () => {
    console.log('editorContent', editorContent);
    console.log('uploadedFilePaths', uploadedFilePaths);
    if (!editorContent || uploadedFilePaths.length === 0) {
      setNotification({
        open: true,
        message: '请填写投标内容并且上传附件',
        severity: 'error',
      });
      return;
    }
    try {
      const response = await tenderNoticeBid(`insertTender`, {
        supplierId: customer.id,
        supplierName: customer.name,
        inviteTenderId: id,
        content: editorContent,
        attachment: uploadedFilePaths.join(','),
      });

      if (response.data.code === 1) {
        setNotification({
          open: true,
          message: '投标提交成功！',
          severity: 'success',
        });
        handleCloseBidDialog();
      } else {
        setNotification({
          open: true,
          message: response.data.msg || '投标提交失败，请重试',
          severity: 'error',
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message:
          error instanceof Error ? error.message : '投标提交失败，请稍后再试',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const fetcher = async (url: string) => {
    const response: any = await getTenderNoticeDetail(url, {
      id,
    });
    if (response.attachment) {
      response.attachment = response.attachment.split(',');
    }
    console.log('response', response);
    return response;
  };

  const isDeadlinePassed = (closeDate: string) =>
    dayjs(closeDate).isBefore(dayjs());

  // 添加获取我的投标记录的函数
  const handleCheckMyBid = async () => {
    if (!customer || Object.keys(customer).length === 0) {
      setOpenLoginDialog(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await getMyBid('listTender', {
        inviteTenderId: id,
        supplierId: customer.id,
      });
      if (response.data.code === 1) {
        const dataRecord = response.data.data.data[0];
        dataRecord.attachment = dataRecord.attachment.split(',');
        if (dataRecord) {
          setMyBidRecord(dataRecord);
        } else {
          setMyBidRecord(null);
        }
      } else {
        setMyBidRecord(null);
      }
    } catch (error) {
      console.error('获取投标记录失败:', error);
      setNotification({
        open: true,
        message: '获取投标记录失败，请稍后重试',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
      setMyBidDialog(true);
    }
  };

  const { data } = useSWR(`getInviteTender`, fetcher);

  if (!data) {
    return (
      <section className="flex min-h-screen flex-col items-center">
        <div className="min-h-screen w-full items-center justify-center border-[1px] border-[#ccc] p-4">
          <div className="flex min-h-screen w-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-[#ccc]"></div>
          </div>
        </div>
      </section>
    ); // 加载状态
  }

  return (
    <section className="flex flex-col items-center">
      <BreadcrumbNavigation
        subTitle={data.title}
        title="招标公告"
        path="/tender-notice"
      />
      <div className="w-full border-[1px] border-[#ccc] p-4">
        <h1 className="text-center text-[16px] font-bold text-[#000]">
          {data.title}
        </h1>
        <div className="border-b-[1px] border-dotted border-[#ccc] py-4 text-center">
          <span className="p-2 text-[#333]">
            投标开始日期：
            <span className="text-[#999]">
              {dayjs(data.bidOpenDate).format('YYYY-MM-DD')}
            </span>
          </span>
          <span className="p-2 text-[#333]">
            投标截止日期：
            <span className="text-[#c62f24]">
              {dayjs(data.closeDate).format('YYYY-MM-DD')}
            </span>
          </span>
          <span className="p-2 text-[#333]">
            发布者：<span className="text-[#999]">{data.makeBillMan}</span>
          </span>
        </div>
        <div
          className="min-h-[500px] p-4"
          dangerouslySetInnerHTML={{
            __html: parseBBCodeToHTML(data.content, false),
          }}
        ></div>

        {/* 附件列表区域 */}
        {data.attachment && data.attachment.length > 0 && (
          <div className="border-t border-[#eee] p-4">
            <Typography variant="h6" className="mb-4 font-bold">
              附件列表
            </Typography>
            <List>
              {data.attachment.map((attachment: any, index: number) => (
                <ListItem
                  key={index}
                  component="div"
                  onClick={() =>
                    window.open(`${documentURL}${attachment}`, '_blank')
                  }
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <ListItemIcon>
                    <AttachFileIcon />
                  </ListItemIcon>
                  <ListItemText primary={attachment} />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </div>
      <div className="flex w-full items-center justify-center gap-4 border-[1px] border-[#ccc] p-4">
        <Button
          variant="contained"
          size="large"
          className="border-[1px] border-[#ccc] p-4"
          onClick={handleOpenBidDialog}
          disabled={isDeadlinePassed(data.closeDate)}
          sx={{
            backgroundColor: isDeadlinePassed(data.closeDate)
              ? '#e0e0e0'
              : undefined,
            color: isDeadlinePassed(data.closeDate) ? '#666' : undefined,
            '&:hover': {
              backgroundColor: isDeadlinePassed(data.closeDate)
                ? '#e0e0e0'
                : undefined,
            },
            '&.Mui-disabled': {
              backgroundColor: '#e0e0e0',
              color: '#666',
            },
            minWidth: '160px',
          }}
        >
          {isDeadlinePassed(data.closeDate)
            ? '截止日期已过，无法投标'
            : '我要投标'}
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={handleCheckMyBid}
          sx={{
            minWidth: '160px',
            borderColor: '#3a66fb',
            color: '#3a66fb',
            '&:hover': {
              borderColor: '#1939b7',
              backgroundColor: 'rgba(58, 102, 251, 0.04)',
            },
          }}
        >
          投标记录
        </Button>
      </div>

      {/* 投标弹窗 */}
      <Dialog
        open={openBidDialog}
        onClose={handleCloseBidDialog}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          投标 - {data.title}
          <IconButton
            aria-label="close"
            onClick={handleCloseBidDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 2 }}>
            {/* 编辑器区域 */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              投标内容
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Editor value={editorContent} onChange={handleEditorChange} />
            </Box>

            {/* 文件上传区域 */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              上传附件
            </Typography>
            <input
              type="file"
              multiple
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button
              variant="outlined"
              startIcon={
                isUploading ? (
                  <CircularProgress size={20} />
                ) : (
                  <CloudUploadIcon />
                )
              }
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? '上传中' : '选择文件'}
            </Button>

            {/* 已上传文件列表 */}
            {uploadedFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  已上传文件 ({uploadedFiles.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {uploadedFiles.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => handleRemoveFile(index)}
                      icon={<AttachFileIcon />}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBidDialog}>取消</Button>
          <Button
            onClick={handleBidSubmit}
            variant="contained"
            disabled={isUploading}
          >
            提交投标
          </Button>
        </DialogActions>
      </Dialog>
      {/* 消息提示 */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{
            width: '100%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            '& .MuiAlert-message': {
              fontSize: '16px',
            },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      {/* 登录弹窗 */}
      <Dialog
        open={openLoginDialog}
        onClose={() => setOpenLoginDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: '400px',
            padding: '16px',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 600,
            color: '#333',
            pb: 1,
          }}
        >
          提示
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <div
            style={{
              textAlign: 'center',
              fontSize: '16px',
              color: '#666',
            }}
          >
            请先登录后再进行操作
          </div>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            gap: 2,
            pb: 2,
          }}
        >
          <Button
            onClick={() => setOpenLoginDialog(false)}
            color="inherit"
            variant="outlined"
            sx={{
              minWidth: '120px',
              borderRadius: '8px',
            }}
          >
            取消
          </Button>
          <Button
            onClick={handleGoToLogin}
            color="primary"
            variant="contained"
            sx={{
              minWidth: '120px',
              borderRadius: '8px',
            }}
          >
            去登录
          </Button>
        </DialogActions>
      </Dialog>
      {/* 添加我的投标记录对话框 */}
      <Dialog
        open={myBidDialog}
        onClose={() => setMyBidDialog(false)}
        maxWidth="lg" // 设置更大的宽度
        fullWidth // 使用全宽
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minHeight: '60vh', // 设置最小高度
            padding: '20px',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 600,
            color: '#333',
            pb: 1,
          }}
        >
          我的投标记录
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {isLoading ? (
            <div className="flex justify-center">
              <CircularProgress size={24} />
            </div>
          ) : myBidRecord ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-600">投标时间：</span>
                <span className="text-[#3a66fb]">
                  {dayjs(myBidRecord.createDate).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>
              <div className="border-b pb-2">
                <div className="mb-2 text-gray-600">投标内容：</div>
                <div className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4">
                  <div
                    className="min-h-[500px] p-4"
                    dangerouslySetInnerHTML={{
                      __html: parseBBCodeToHTML(myBidRecord.content, false),
                    }}
                  ></div>
                </div>
              </div>
              {myBidRecord.attachment && myBidRecord.attachment.length > 0 && (
                <div>
                  <div className="mb-2 text-gray-600">附件：</div>
                  <div className="space-y-2">
                    {myBidRecord.attachment.map(
                      (file: string, index: number) => (
                        <div
                          key={index}
                          className="flex cursor-pointer items-center gap-2 hover:text-[#3a66fb]"
                          onClick={() =>
                            window.open(`${documentURL}${file}`, '_blank')
                          }
                        >
                          <InsertDriveFileIcon sx={{ color: '#3a66fb' }} />
                          <span>{file}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-[500px] flex-col items-center justify-center py-8">
              {/* <NoDataIcon sx={{ fontSize: 64, color: '#ccc' }} /> */}
              <p className="mt-4 text-gray-500">暂无投标记录</p>
            </div>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            pb: 2,
          }}
        >
          <Button
            onClick={() => setMyBidDialog(false)}
            variant="contained"
            sx={{
              minWidth: '120px',
              borderRadius: '8px',
            }}
          >
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};
