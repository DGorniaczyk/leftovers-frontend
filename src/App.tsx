import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './layouts/Layout';
import HomePage from './pages/Home';
import AllRecipesPage from './pages/AllRecipes';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/recipes', element: <AllRecipesPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
