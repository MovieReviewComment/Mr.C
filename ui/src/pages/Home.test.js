import { MemoryRouter, Route, Routes } from 'react-router-dom';
import React, { render } from '@testing-library/react';
import Home from './Home';

describe('Home Page', () => {
  //test that the home page title has 'Home' in it
  it('should have a title that contains "Home"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    expect(global.window.document.title).toContain('Home');
  });
});
