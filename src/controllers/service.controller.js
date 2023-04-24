import mongoose from 'mongoose';
import servicetDb from '../models/service.model.js';
import { validationResult } from 'express-validator';


//add a service
export function httpAddService(req, res) {
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ error: validationResult(req).array() });
    } else {
        servicetDb
            .findOne({})
            .or([
                { name: req.body.name },

            ])
            .then((exists) => {
                if (exists) {
                    res.status(409).json({ message: 'Service exists already!' });
                } else {
                    const newService = req.body;

                    // newService.name = newService.name.toLowerCase();


                    if (req.file) {
                        newService.img = req.file.path;
                    }
                    servicetDb
                        .create(newService)
                        .then((result) => {
                            findOneServiceByFilter(result._id)
                                .then((register) => res.status(201).json(serviceFormat(register)))
                                .catch((err) =>
                                    res.status(500).json({ error: err.message })
                                );
                        })
                        .catch((err) => res.status(500).json({ error: err.message }));
                }
            })
            .catch((err) => res.status(500).json({ error: err.message }));
    }
}
//get all services
export function httpGetAllServices(req, res) {
    servicetDb
        .find()
        .then((services) => {
            res.status(200).json(servicesListFormat(services));
        })
        .catch((err) => res.status(500).json({ error: err.message }));
}

//get one service
export function httpGetOneService(req, res) {
    findOneServiceByFilter(req.params.param)
        .then((foundService) => {
            if (!foundService) {
                res.status(404).json({ message: 'Service not found!' });
            } else {
                res.status(200).json(serviceFormat(foundService));
            }
        })
        .catch((err) => res.status(500).json({ error: err.message }));
}

//Update one appartment with filter
export function httpUpdateOneService(req, res) {
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ error: validationResult(req).array() });
    } else {
        const newValues = req.body;


        findOneServiceByFilter(req.params.param)
            .then((foundService) => {
                if (!foundService) {
                    res.status(404).json({ message: 'Service not found!' });
                } else {
                    //newValues.isVerified = foundService.isVerified;
                    //newValues.isBanned = foundService.isBanned;
                    servicetDb
                        .findByIdAndUpdate(foundService._id, newValues)
                        .then((result) => {
                            servicetDb
                                .findById(result._id)
                                .then((updated) => {
                                    res.status(200).json(serviceFormat(updated));
                                })
                                .catch((err) =>
                                    res.status(500).json({ error: err.message })
                                );
                        })
                        .catch((err) => res.status(500).json({ error: err.message }));
                }
            })
            .catch((err) => res.status(500).json({ error: err.message }));
    }
}
//delete one service with filter
export function httpDeleteOneService(req, res) {
    findOneServiceByFilter(req.params.param)
        .then((foundService) => {
            if (!foundService) {
                res.status(404).json({ error: 'Service not found!' });
            } else {
                servicetDb
                    .findByIdAndDelete(foundService._id)
                    .then((result) => {
                        res.status(200).json({
                            message: `${foundService.name} deleted successfully`,
                        });
                    })
                    .catch((err) => res.status(500).json({ error: err.message }));
            }
        })
        .catch((err) => res.status(500).json({ error: err.message }));
}


export async function findOneServiceByFilter(serviceFilter) {
    var serviceId = null;
    if (mongoose.Types.ObjectId.isValid(serviceFilter)) {
        serviceId = serviceFilter;
    }
    return await servicetDb.findOne({
        $or: [
            { _id: serviceId },

            { name: serviceFilter },
        ],
    });
}
//appartment object format to get all appartments
export function servicesListFormat(services) {
    let foundservices = [];
    services.forEach((service) => {
        foundservices.push(serviceFormat(service));
    });
    return foundservices;
}

//Appartment format
function serviceFormat(service) {
    return {
        id: service._id,
        name: service.name,
        description: service.description,
        pricePerNight: service.pricePerNight,

        img: service.img,

    };
}