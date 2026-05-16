import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../components/tasks/TaskForm';
import { vi } from 'vitest';

describe('TaskForm Component', () => {
  it('renders correctly with default fields', () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    
    expect(screen.getByPlaceholderText(/e.g. Finish chapter 5/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/optional notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('shows error if title is empty on submit', () => {
    const mockSubmit = vi.fn();
    render(<TaskForm onSubmit={mockSubmit} />);
    
    const submitBtn = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(submitBtn);
    
    const errorMessages = screen.getAllByText(/title is required/i);
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
