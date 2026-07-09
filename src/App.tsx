import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './layouts/Layout';
import HomePage from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{ index: true, element: <HomePage /> }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
