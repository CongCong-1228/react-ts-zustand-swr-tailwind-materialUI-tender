import { parseBBCodeToHTML } from '@/utils/parse';
import { useNavigate } from 'react-router-dom';

interface ItemProps {
  data: any;
  isTenderNotice: boolean;
}

export const TenderNoticeItem = (props: ItemProps) => {
  const { data, isTenderNotice } = props;
  const navigate = useNavigate();

  const getDate = (date: string) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.toLocaleString('en-US', { month: 'long' });
    const day = dateObj.getDate();
    return { year, month, day };
  };

  return (
    <>
      <li
        className="relative my-2 flex w-full cursor-pointer items-start border-b-[1px] border-[#cbcbcb] p-4"
        onClick={() => {
          if (isTenderNotice) {
            navigate(`/tender-notice-detail/${data.id}`);
          } else {
            navigate(`/winning-bid-detail/${data.id}`);
          }
        }}
      >
        {isTenderNotice && (
          <div className="absolute right-2 top-2 flex">
            <div className="flex items-center justify-center">招标状态：</div>
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center">
                <span className="text-sm text-[#c62f24]">
                  {data.status === 5 ? '招标中' : '已结束'}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="flex h-24 w-24 flex-col items-start justify-start bg-[#e0e0e0] p-2">
          <span className="text-4xl font-bold text-[#c62f24]">
            {getDate(isTenderNotice ? data.createDate : data.modifyDate).day}
          </span>
          <span className="text-md">
            {getDate(isTenderNotice ? data.createDate : data.modifyDate).month}
          </span>
          <span className="text-sm">
            {getDate(isTenderNotice ? data.createDate : data.modifyDate).year}
          </span>
        </div>
        <div className="ml-4 flex h-full min-h-24 flex-1 flex-col items-start justify-center gap-1">
          <h2 className="text-lg font-semibold">
            {isTenderNotice
              ? data.title
              : `${data.inviteTender.title}（中标公示）`}
          </h2>
          <div className="flex justify-between gap-4 text-sm text-gray-600">
            <span>
              {isTenderNotice ? (
                <span className="text-[#dd0d0d]">
                  发布者: {data.makeBillMan}
                </span>
              ) : (
                <span className="font-bold text-[#3a66fb]">
                  中标供应商: {data.supplierName}
                </span>
              )}
            </span>
            {/* <span>
              浏览次数: <span className="text-[#dd0d0d]">100</span>
            </span> */}
          </div>
          <p
            className="line-clamp-2 overflow-hidden text-sm text-gray-500"
            dangerouslySetInnerHTML={{
              __html: parseBBCodeToHTML(data.content, false),
            }}
          ></p>
        </div>
      </li>
    </>
  );
};
