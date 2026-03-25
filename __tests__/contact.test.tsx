import { render, screen, fireEvent } from '@testing-library/react';
import ContactPage from '../src/app/contact/page';

describe('Contact page', () => {
  it('renders all form fields and allows interaction', () => {
    render(<ContactPage />);
    // Check all fields
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred contact method/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expected due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/personal message/i)).toBeInTheDocument();

    // Interact with fields
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/preferred contact method/i), { target: { value: 'phone' } });
    fireEvent.change(screen.getByLabelText(/expected due date/i), { target: { value: '2026-07-01' } });
    fireEvent.change(screen.getByLabelText(/personal message/i), { target: { value: 'Looking forward to working with you!' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText(/thank you! your message has been received/i)).toBeInTheDocument();
  });
});
