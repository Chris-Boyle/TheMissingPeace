import { render, screen } from '@testing-library/react';
import BlogPage from '../src/app/blog/page';

describe('Blog page', () => {
  it('renders a list of blog posts with headline, date, and excerpt', () => {
    render(<BlogPage />);
    expect(screen.getByRole('heading', { name: /blog/i })).toBeInTheDocument();
    expect(screen.getByText('Preparing for Birth: What to Expect')).toBeInTheDocument();
    expect(screen.getByText('The Benefits of Doula Support')).toBeInTheDocument();
    expect(screen.getByText('Postpartum Care: Nurturing Yourself')).toBeInTheDocument();
    expect(screen.getAllByText(/2026/).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText(/A guide to help you feel confident/)).toBeInTheDocument();
    expect(screen.getByText(/Discover how a doula can provide/)).toBeInTheDocument();
    expect(screen.getByText(/Tips and resources for new mothers/)).toBeInTheDocument();
  });
});
