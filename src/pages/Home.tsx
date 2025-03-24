import { RegisterAndLogin } from '@/components/RegisterAndLogin';
import { TenderContainer } from '@/components/TenderContainer';
import useSWR from 'swr';
import { getTenderNoticeList, getBidRecord } from '@/request/mes';
interface Data {
  total: number;
  list: any[];
}
export const Home = () => {
  const fetcher = async (url: string) => {
    const res = (await getTenderNoticeList(url)) as Data;
    return res;
  };
  const winningBidFetcher = async (url: string) => {
    const res = (await getBidRecord(url)) as Data;
    return res;
  };
  const { data } = useSWR<Data>(
    `listInviteTender?pageIndex=1&pageSize=5&status=5&orderBy=id DESC`,
    fetcher,
  );
  const { data: winningBidData } = useSWR<Data>(
    `listTender?pageIndex=1&pageSize=5&status=10&orderBy=id DESC`,
    winningBidFetcher,
  );
  return (
    <section className="flex flex-col items-center justify-center">
      <div className="flex h-[450px] w-full items-center justify-between gap-10">
        <img
          src="https://img.axureshop.com/58/99/e0/5899e058a8a54fe6a34e20f05a532e0c/images/首页/u209.png"
          alt="logo"
          className="h-full w-auto max-w-[60%] flex-1"
        />
        <RegisterAndLogin />
      </div>
      <div className="mt-10 flex w-full gap-10 md:flex-row">
        <TenderContainer
          title="招标公告"
          buttonText="查看更多"
          buttonLink="/tender-notice"
          detailLink="/tender-notice-detail"
          list={data?.list || []}
        />
        <TenderContainer
          isWinningBid={true}
          title="中标公告"
          buttonText="查看更多"
          buttonLink="/winning-bid"
          detailLink="/winning-bid-detail"
          list={winningBidData?.list || []}
        />
      </div>
    </section>
  );
};
