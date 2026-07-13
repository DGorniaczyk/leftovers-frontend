import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

function renderFooter() {
  return render(<Footer />);
}

describe('Footer — content', () => {
  it('renders the contact email', () => {
    renderFooter();
    expect(screen.getByText('contact@leftovers.com')).toBeInTheDocument();
  });

  it('renders Terms of Services text', () => {
    renderFooter();
    expect(screen.getByText('Terms of Services')).toBeInTheDocument();
  });

  it('renders Privacy Policy text', () => {
    renderFooter();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('renders the "powered by BotAI" text', () => {
    renderFooter();
    expect(screen.getByText(/powered by/i)).toBeInTheDocument();
    expect(screen.getByText('BotAI')).toBeInTheDocument();
  });
});

// ── Social links ───────────────────────────────────────────────────────────────

describe('Footer — social links', () => {
  it('renders the Instagram link pointing to instagram.com', () => {
    renderFooter();
    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com');
  });

  it('renders the Facebook link pointing to facebook.com', () => {
    renderFooter();
    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com');
  });

  it('opens social links in a new tab', () => {
    renderFooter();
    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    expect(instagramLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('target', '_blank');
  });

  it('has rel="noopener noreferrer" on social links for security', () => {
    renderFooter();
    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

describe('Footer — non-navigating links', () => {
  it('Terms of Services is not an anchor element', () => {
    renderFooter();
    const terms = screen.getByText('Terms of Services');
    expect(terms.tagName).not.toBe('A');
  });

  it('Privacy Policy is not an anchor element', () => {
    renderFooter();
    const privacy = screen.getByText('Privacy Policy');
    expect(privacy.tagName).not.toBe('A');
  });
});

describe('Footer — BotAI link', () => {
  it('renders BotAI as an external link', () => {
    renderFooter();
    const botaiLink = screen.getByRole('link', { name: /botai/i });
    expect(botaiLink).toHaveAttribute('href', 'https://botai.com');
    expect(botaiLink).toHaveAttribute('target', '_blank');
  });
});
