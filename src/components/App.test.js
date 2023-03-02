import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hello world in our app', () => {
    // Create the virtual DOM by rendering our application.
    render(<App />);

    const h1 = screen.getByText(/hello world/i);
    expect(h1).toBeInTheDocument();
})

