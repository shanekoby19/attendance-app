const sites = [
    { 
        program: 'Clark County',
        site: 'Henderson',
        longitude: -114.9716274,
        latitude: 36.0369413
    },
    { 
        program: 'Clark County',
        site: 'Head Quarters',
        longitude: -115.1990074,
        latitude: 36.2189159
    },
    { 
        program: 'Clark County',
        site: 'Cecile Walnut',
        longitude: -115.0934075,
        latitude: 36.2147729,
    }
]

const getAllSites = (req, res) => {
    
    res.status(200).json({
        status: 'success',
        data: {
            sites: sites,
        }
    });
};

const getSiteById = (req, res) => {
    const { id: siteId } = req.params;

    res.status(200).json({
        status: 'success',
        data: {
            site: sites[siteId]
        }
    });
};

const createSite = (req, res) => {
    const newSite = req.body;
    sites.push(newSite);

    res.status(201).json({
        status: 201,
        data: {
            sites: sites
        }
    })
}

const updateSite = (req, res) => {
    const updatedSite = req.body;
    const siteToUpdateId = Number(req.params.id);

    const updatedSites = [...sites.filter((_, index) => index !== siteToUpdateId), {...updatedSite}]

    res.status(200).json({
        status: 200,
        data: {
            sites: updatedSites,
            updatedSite: updatedSite
        }
    });
}

const checkId = (req, res, next, id) => {
    // TODO

    // Check to see if id is valid in mongodb.

    // Find and store the site object on the request.
    
    console.log('Id is good!')

    next();
};

module.exports = {
    getAllSites,
    getSiteById,
    createSite,
    updateSite,
    checkId
}