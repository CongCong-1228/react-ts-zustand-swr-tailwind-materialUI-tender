import { NavLink } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

export const NavBar = () => {
  const navigate = useNavigate();
  return (
    <header className="flex h-24 items-center justify-between px-16">
      <div
        className="flex cursor-pointer items-center gap-4"
        onClick={() => navigate('/')}
      >
        <img src={logo} alt="logo" className="h-10 w-10" />
        <h3 className="text-2xl font-bold">杭州精晟新能源有限公司</h3>
      </div>
      <div className="flex items-center gap-10">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `pb-1 text-xl text-[#363645] hover:text-[#4e87ea] ${
              isActive ? 'border-b-[3px] border-[#4e87ea] text-[#000000]' : ''
            }`
          }
        >
          首&nbsp;&nbsp;页
        </NavLink>
        <NavLink
          to="/tender-notice"
          className={({ isActive }) =>
            `pb-1 text-xl text-[#363645] hover:text-[#4e87ea] ${
              isActive ? 'border-b-[3px] border-[#4e87ea] text-[#000000]' : ''
            }`
          }
        >
          招标公告
        </NavLink>
        <NavLink
          to="/winning-bid"
          className={({ isActive }) =>
            `pb-1 text-xl text-[#363645] hover:text-[#4e87ea] ${
              isActive ? 'border-b-[3px] border-[#4e87ea] text-[#000000]' : ''
            }`
          }
        >
          中标公告
        </NavLink>
        <NavLink
          to="/supplier-registration"
          className={({ isActive }) =>
            `pb-1 text-xl text-[#363645] hover:text-[#4e87ea] ${
              isActive ? 'border-b-[3px] border-[#4e87ea] text-[#000000]' : ''
            }`
          }
        >
          供应商注册
        </NavLink>
      </div>
    </header>
  );
};
