import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

function Hello() {
  return <div>Hola Vitest</div>;
}

describe('Sanity test', () => {
  it('renders a hello message', () => {
    render(<Hello />);
    expect(screen.getByText('Hola Vitest')).toBeInTheDocument();
  });
});
