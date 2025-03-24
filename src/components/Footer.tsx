export const Footer = () => {
  return (
    <footer className="flex h-48 w-full items-center justify-around bg-[#3b455a] px-16 text-white">
      <div className="flex flex-col items-start  justify-start gap-2">
        <p>版权所有：杭州精晟新能源有限公司</p>
        <p>备案号：浙ICP备12345678号</p>
      </div>
      <div className="flex flex-col items-start  justify-start gap-2">
        <p>联系电话：0571-88888888</p>
        <p>联系地址：杭州市拱墅区</p>
      </div>
      <div className="flex flex-col items-start  justify-start gap-2">
        <p>扫描二维码</p>
        <p>关注官方微信</p>
      </div>
    </footer>
  );
};
