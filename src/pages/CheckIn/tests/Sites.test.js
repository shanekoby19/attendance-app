import { render, screen } from '@testing-library/react';
import Sites from '../components/Sites';

test('Sites are loaded from the server when a get response is sent.', async () => {
    render(<Sites />);

    // Confirm our mock server sent back three sites as per spec.
    const buttons = await screen.findAllByRole('button', /check-in/i );
    expect(buttons).toHaveLength(3);
});