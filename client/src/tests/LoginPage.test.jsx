import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

// Mock the AuthContext since LoginPage depends on it
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    loading: false,
    error: null,
  })
}));

describe('LoginPage Component', () => {
  it('renders login form with email and password fields', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
