import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { parseBBCodeToHTML } from '@/utils/parse';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { getWinningBidDetail } from '@/request/mes';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';

export const WinningBidDetail = () => {
  const { id } = useParams<{ id: string }>(); // 获取路由参数
  const documentURL = import.meta.env.VITE_DOCUMENT_URL || '';

  const fetcher = async (url: string) => {
    const response: any = await getWinningBidDetail(url, {
      id,
    });
    if (response.attachment) {
      response.attachment = response.attachment.split(',');
    }
    console.log('response', response);
    return response;
  };

  const { data } = useSWR(`getTender`, fetcher);

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
        subTitle={`${data.inviteTender.title}（中标公示）`}
        title="中标公告"
        path="/winning-bid"
      />
      <div className="w-full border-[1px] border-[#ccc] p-4">
        <h1 className="text-center text-[16px] font-bold text-[#000]">
          {`${data.inviteTender.title}（中标公示）`}
        </h1>
        <div className="border-b-[1px] border-dotted border-[#ccc] py-4 text-center">
          <span className="p-2 text-[#333]">
            中标供应商：
            <span className="text-[#c62f24]">{data.makeBillMan}</span>
          </span>
          <span className="p-2 text-[#333]">
            中标评分：
            <span className="text-[#c62f24]">{data.score}</span>
          </span>
          <span className="p-2 text-[#333]">
            中标审核人：
            <span className="text-[#c62f24]">{data.modifier}</span>
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
    </section>
  );
};
