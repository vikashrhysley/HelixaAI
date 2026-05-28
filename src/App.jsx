import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './store/slices/authSlice';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ChatPage  from './components/chat/ChatPage';

export default function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [authView, setAuthView] = useState('login');
  const [loginNotice, setLoginNotice] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');

  if (isAuthenticated) return <ChatPage/>;

  return authView === 'signup'
    ? <SignupPage
        onShowLogin={() => setAuthView('login')}
        onSignupSuccess={(identifier) => {
          setLoginIdentifier(identifier);
          setLoginNotice('Account created successfully. Please sign in.');
          setAuthView('login');
        }}
      />
    : <LoginPage
        initialIdentifier={loginIdentifier}
        notice={loginNotice}
        onShowSignup={() => {
          setLoginNotice('');
          setLoginIdentifier('');
          setAuthView('signup');
        }}
      />;
}
