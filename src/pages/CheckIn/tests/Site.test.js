import { render, screen } from '@testing-library/react';

import Site from '../components/Site';

const goodSite = {
    _id: "jkafdkjfadkafdj;k",
    program: 'Clark County',
    site: 'Cecile Walnut',
    location: {
        address: "3820 Cecile Avenue",
        city: "Las Vegas",
        state: "NV",
        zip: "89115",
        coords: {
            type: "Point",
            coordinates: [-115.0912188, 36.2147686]
        }
    },
    distance: {
        miles: 0.02,
        feet: 500,
    }
}

const badSite = {
    _id: "kdjafjkafkjdfka",
    program: 'Clark County',
    site: 'Henderson',
    location: {
        address: "180 Westminster Way",
        city: "Henderson",
        state: "NV",
        zip: "89105",
        coords: {
            type: "Point",
            coordinates: [-114.9694387, 36.036937]
        }
    },
    distance: {
        miles: 1.93,
        feet: 10328,
    }
}

test('A site with a distance of 500 feet or less displays in feet and allows a user to check-in', () => {
    render(<Site site={goodSite} />);

    const distanceHeading = screen.getByRole('heading', { name: /ft$/i });
    expect(distanceHeading).toBeInTheDocument();

    const checkInButton = screen.getByRole('button', { name: /check-in/i });
    expect(checkInButton).toBeEnabled();
});

test('A site with a distance greater than 500ft displays in miles and will not allow a user to check-in', () => {
    render(<Site site={badSite} />);

    const distanceHeading = screen.getByRole('heading', { name: /mi$/i });
    expect(distanceHeading).toBeInTheDocument();

    const checkInButton = screen.getByRole('button', { name: /check-in/i });
    expect(checkInButton).toBeDisabled();
})