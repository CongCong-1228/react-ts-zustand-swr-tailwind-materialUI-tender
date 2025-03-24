import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { MessageProvider } from './components/MessageProvider';
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <MessageProvider>
    <RouterProvider router={router} />
  </MessageProvider>,
);
