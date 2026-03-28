import { render, screen } from '@testing-library/react';
import AboutPage from '../src/app/about/page';

describe('About page', () => {
  it('renders the About page and bio', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
    expect(
      screen.getByText(
        /As a Birth and VBAC certified doula, my greatest joy is providing compassionate support to every mother I have the honor of serving\./
      )
    ).toBeInTheDocument();
    expect(screen.getByAltText(/portrait of meagan/i)).toBeInTheDocument();
  });
});
