import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export const Layout = () => {
  useScrollToTop();

  return (
    <div className=" flex min-h-screen flex-col">
      <NavBar />
      <main className="container mx-auto my-10 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
