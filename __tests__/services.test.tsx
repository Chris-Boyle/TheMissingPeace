import { render, screen } from '@testing-library/react';
import ServicesPage from '../src/app/services/page';

describe('Services page', () => {
  it('renders without crashing', () => {
    render(<ServicesPage />);
  });

  it('renders the peaceful offerings heading and package titles', () => {
    render(<ServicesPage />);

    expect(
      screen.getByRole('heading', { name: /peaceful offerings/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /foundational peace package/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /total peace package/i })
    ).toBeInTheDocument();
  });

  it('renders the bereavement support section', () => {
    render(<ServicesPage />);

    expect(
      screen.getByRole('heading', { name: /bereavement support/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/all bereavement services are offered completely free of charge/i)
    ).toBeInTheDocument();
  });
});
