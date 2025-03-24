import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export const TenderContainer: React.FC<{
  title: string;
  buttonText: string;
  buttonLink: string;
  list: any[];
  isWinningBid?: boolean;
  detailLink: string;
}> = ({ title, buttonText, buttonLink, list, isWinningBid, detailLink }) => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[300px] max-w-[50%] flex-1 flex-col border-[1px] border-[#cbcbcb] p-6">
      <div className="flex items-center justify-between border-b-[1px] border-[#cbcbcb] pb-4">
        <h3 className="text-xl font-bold text-[#3a66fb]">{title}</h3>
        <button
          className="text-sm text-[#999999]"
          onClick={() => navigate(buttonLink)}
        >
          {buttonText}
        </button>
      </div>
      <ul className="mt-4 flex flex-col gap-6">
        {list.map((item) => (
          <li
            key={item.id}
            className="flex cursor-pointer items-center justify-between text-[#686868] hover:text-[#3a66fb]"
            onClick={() => navigate(`${detailLink}/${item.id}`)}
          >
            <span className="w-[80%] overflow-hidden text-ellipsis whitespace-nowrap text-sm">
              {isWinningBid ? item.inviteTender.title : item.title}
            </span>
            <span className="text-sm">
              {dayjs(isWinningBid ? item.createDate : item.modifyDate).format(
                'YYYY-MM-DD',
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
