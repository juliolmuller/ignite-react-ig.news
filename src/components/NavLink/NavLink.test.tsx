import { render } from '@testing-library/react';

import NavLink from '.';

describe('component NavLink', () => {
  it('renders correctly', () => {
    const { getByText } = render(<NavLink href="/">Home</NavLink>);

    expect(getByText('Home')).toBeInTheDocument();
  });

  it('adds className "active" when link is active', () => {
    const { getByText } = render(
      <NavLink href="/" activeClassName="active">
        Home
      </NavLink>,
    );

    expect(getByText('Home')).toHaveAttribute('class', 'active');
  });
});
