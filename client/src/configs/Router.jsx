import { createBrowserRouter } from 'react-router-dom';
import Top from '../components/Top/index';
import ProfileComponent from '../components/Top/profile';
import UserTweetsPage from '../components/Top/tweets';

const router = createBrowserRouter([
  { path: "/", element: <Top /> },
  { path: "/profilelist", element: <ProfileComponent /> },
  //{ path: "/profile/:id/tweets", element: <UserTweetsPage />},
]);

export default router;
