import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import NavBar from './NavBar';

test('renders the standard news section navigation without customization controls', () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>,
  );

  expect(screen.getByRole('navigation', {name: 'News sections'})).toHaveTextContent('Science');
  expect(screen.queryByText('Customize topic shortcuts')).not.toBeInTheDocument();
  expect(screen.queryByRole('navigation', {name: 'Your preferred topics'})).not.toBeInTheDocument();
});
