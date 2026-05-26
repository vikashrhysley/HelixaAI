import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './store/slices/authSlice';
import LoginPage from './components/auth/LoginPage';
import ChatPage  from './components/chat/ChatPage';

export default function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <ChatPage/> : <LoginPage/>;
}
