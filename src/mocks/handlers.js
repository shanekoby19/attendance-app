import { rest } from 'msw';

const nearbySites = [{
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
        feet: 100,
    }
}, {
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
}, {
    _id: "kadjfkajkdfjkjakv",
    program: 'Clark County',
    site: 'Strong Start Lorenzi',
    location: {
        address: "700 Twin Lakes Dr.",
        city: "Las Vegas",
        state: "NV",
        zip: "89107",
        coords: {
            type: "Point",
            coordinates: [-115.1868317, 36.1777258]
        }
    }, 
    distance: {
        miles: 8.36,
        feet: 40523,
    }
}]

export const handlers = [
    // Handle get sites
    rest.get('http://localhost:3000/api/v1/sites', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(nearbySites)
        )
    })
]