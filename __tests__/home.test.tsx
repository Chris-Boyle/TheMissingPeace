import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home page', () => {
  it('renders the streamlined conversion-first homepage', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        name: /calm care, clear guidance, and a peaceful presence for your growing family/i,
      })
    ).toBeVisible();
    expect(
      screen.getByAltText(/welcoming portrait illustration of a doula holding a newborn/i)
    ).toBeVisible();

    expect(
      screen.getByRole('heading', {
        name: /support that feels steady, personal, and deeply informed/i,
      })
    ).toBeVisible();

    expect(
      screen.getByRole('heading', {
        name: /start with your pregnancy timeline and get your bearings/i,
      })
    ).toBeVisible();

    const consultationLinks = screen.getAllByRole('link', {
      name: /book a consultation/i,
    });
    expect(consultationLinks).toHaveLength(4);
    consultationLinks.forEach((link) => expect(link).toBeVisible());

    expect(
      screen.getAllByRole('link', { name: /build your birth plan/i }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: /view your pregnancy timeline/i })
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: /take the quiz/i })
    ).toBeVisible();
  });
});
