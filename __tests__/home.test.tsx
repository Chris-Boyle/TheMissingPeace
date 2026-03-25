import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home page', () => {
  it('renders all primary sections and key elements', () => {
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
        name: /support that feels informed, grounded, and personal/i,
      })
    ).toBeVisible();

    expect(
      screen.getByRole('heading', {
        name: /practical offerings designed to bring steadiness to your journey/i,
      })
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: /birth doula support/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /postpartum guidance/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /childbirth education/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /bereavement care/i })).toBeVisible();

    expect(
      screen.getByRole('heading', {
        name: /gather, learn, and prepare in a warm community setting/i,
      })
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /comfort measures workshop/i })
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: /birth planning circle/i })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /postpartum preparation chat/i })
    ).toBeVisible();

    const consultationLinks = screen.getAllByRole('link', {
      name: /book a consultation/i,
    });
    expect(consultationLinks).toHaveLength(2);
    consultationLinks.forEach((link) => expect(link).toBeVisible());
    expect(
      screen.getByRole('link', { name: /explore services/i })
    ).toBeVisible();
    expect(screen.getByRole('link', { name: /view resources/i })).toBeVisible();
  });
});
