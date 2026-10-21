import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import NavBar from './NavBar';

beforeEach(() => {
  window.localStorage.clear();
});

test('stores preferred topic shortcuts on this device', () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByText('Customize topic shortcuts'));
  fireEvent.click(screen.getByRole('checkbox', {name: 'Science'}));

  expect(screen.getByRole('navigation', {name: 'Your preferred topics'})).toHaveTextContent('Science');
  expect(JSON.parse(window.localStorage.getItem('india-speaks:preferred-topics'))).toEqual(['/science']);
});
