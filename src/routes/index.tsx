import { createHashRouter } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { SupplierRegistration } from '@/pages/SupplierRegistration';
import { TenderNotice } from '@/pages/TenderNotice';
import { WinningBid } from '@/pages/WinningBid';
import { Layout } from '@/pages/Layout';
import { TenderNoticeDetail } from '@/pages/TenderNotice/TenderNoticeDetail';
import { WinningBidDetail } from '@/pages/WinningBid/detail';

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/tender-notice',
        element: <TenderNotice />,
      },
      {
        path: '/tender-notice-detail/:id',
        element: <TenderNoticeDetail />,
      },
      {
        path: '/winning-bid',
        element: <WinningBid />,
      },
      {
        path: '/winning-bid-detail/:id',
        element: <WinningBidDetail />,
      },

      {
        path: '/supplier-registration',
        element: <SupplierRegistration />,
      },
    ],
  },
]);
