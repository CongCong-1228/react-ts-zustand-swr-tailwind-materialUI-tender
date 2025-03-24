// import { Search } from '@/components/Search';
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
import useSWR from 'swr';
import { getTenderNoticeList } from '@/request/mes';
import { TenderNoticeItem } from './TenderNoticeItem';
import Skeleton from '@mui/material/Skeleton';
interface Data {
  total: number;
  list: any[];
}
export const TenderNotice = () => {
  const [page, setPage] = useState(1);
  // const [setQuery] = useState('');
  const limit = 10;
  const fetcher = async (url: string) => {
    const res = (await getTenderNoticeList(url)) as Data;
    return res;
  };

  const { data } = useSWR<Data>(
    `listInviteTender?pageIndex=${page}&pageSize=${limit}&status=5&orderBy=id desc`,
    fetcher,
  );
  const handlePageChange = (value: number) => {
    setPage(value);
  };

  // const handleSearch = (query: string) => {
  //   // setQuery(query);
  // };

  return (
    <section className="flex w-full flex-col items-center">
      <div className="flex h-16 w-full items-center justify-between border-b-[1px] border-[#cbcbcb] px-6 pb-6">
        <h1 className="text-2xl font-bold text-[#3a66fb]">招标公告列表</h1>
        {/* <Search onSearch={handleSearch} /> */}
      </div>
      <div className="flex w-full flex-col justify-center">
        {data ? (
          <>
            <ul className="flex w-full flex-col items-center justify-center">
              {data?.list.map((item) => (
                <TenderNoticeItem
                  key={item.id}
                  data={item}
                  isTenderNotice={true}
                />
              ))}
            </ul>
            <div className="mt-6 flex justify-end">
              <Pagination
                count={Math.ceil(data?.total / limit)} // 计算总页数
                shape="rounded"
                color="primary"
                page={page}
                onChange={(_, value) => handlePageChange(value)}
              />
            </div>
          </>
        ) : (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                animation="wave"
                width={'100%'}
                height={120}
                style={{ marginBottom: 6, marginTop: 6 }}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};
