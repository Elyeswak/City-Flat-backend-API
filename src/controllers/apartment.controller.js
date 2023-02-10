import mongoose from 'mongoose';
import apartmentDb from '../models/appartment.model.js';
import { validationResult } from 'express-validator';


//add apartment
export function httpAddAppartment(req, res) {
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ error: validationResult(req).array() });
    } else {
        apartmentDb
            .findOne({})
            .or([
                { name: req.body.name },

            ])
            .then((exists) => {
                if (exists) {
                    res.status(409).json({ message: 'Appartment exists already!' });
                } else {
                    const newAppartment = req.body;

                    // newAppartment.name = newAppartment.name.toLowerCase();


                    if (req.file) {
                        newAppartment.img = req.file.path;
                    }
                    apartmentDb
                        .create(newAppartment)
                        .then((result) => {
                            findOneAppartByFilter(result._id)
                                .then((register) => res.status(201).json(appartFormat(register)))
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
//get all appartments
export function httpGetAllApparts(req, res) {
    apartmentDb
       .find()
       .then((apparts) => {
          res.status(200).json(appartsListFormat(apparts));
       })
       .catch((err) => res.status(500).json({ error: err.message }));
 }

 //get one appartment
 export function httpGetOneAppartment(req, res) {
    findOneAppartByFilter(req.params.param)
       .then((foundAppart) => {
          if (!foundAppart) {
             res.status(404).json({ message: 'Appartment not found!' });
          } else {
             res.status(200).json(appartFormat(foundAppart));
          }
       })
       .catch((err) => res.status(500).json({ error: err.message }));
 }

//Update one appartment with filter
 export function httpUpdateOneAppartment(req, res) {
    if (!validationResult(req).isEmpty()) {
       res.status(400).json({ error: validationResult(req).array() });
    } else {
       const newValues = req.body;
       
 
       findOneAppartByFilter(req.params.param)
          .then((foundAppart) => {
             if (!foundAppart) {
                res.status(404).json({ message: 'Appartment not found!' });
             } else {
                //newValues.isVerified = foundAppart.isVerified;
                //newValues.isBanned = foundAppart.isBanned;
                apartmentDb
                   .findByIdAndUpdate(foundAppart._id, newValues)
                   .then((result) => {
                    apartmentDb
                         .findById(result._id)
                         .then((updated) => {
                            res.status(200).json(appartFormat(updated));
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
//delete one appartment with filter
 export function httpDeleteOneAppart(req, res) {
    findOneAppartByFilter(req.params.param)
       .then((foundAppart) => {
          if (!foundAppart) {
             res.status(404).json({ error: 'Appartment not found!' });
          } else {
            apartmentDb
                .findByIdAndDelete(foundAppart._id)
                .then((result) => {
                   res.status(200).json({
                      message: `${foundAppart.name} deleted successfully`,
                   });
                })
                .catch((err) => res.status(500).json({ error: err.message }));
          }
       })
       .catch((err) => res.status(500).json({ error: err.message }));
 }

 
export async function findOneAppartByFilter(appartFilter) {
    var appartId = null;
    if (mongoose.Types.ObjectId.isValid(appartFilter)) {
        appartId = appartFilter;
    }
    return await apartmentDb.findOne({
        $or: [
            { _id: appartId },

            { name: appartFilter },
        ],
    });
}
//appartment object format to get all appartments
export function appartsListFormat(apparts) {
    let foundApparts = [];
    apparts.forEach((appartment) => {
        foundApparts.push(appartFormat(appartment));
    });
    return foundApparts;
 }

 //Appartment format
function appartFormat(appartment) {
    return {
       id: appartment._id,
       name: appartment.name,
       description: appartment.description,
       pricePerNight: appartment.pricePerNight,
       FromDate: appartment.FromDate,
       ToDate: appartment.ToDate,
       location: appartment.location,
       rooms: appartment.rooms,
       reviews: appartment.reviews,
       services: appartment.services,
       img: appartment.img,
 
    };
 }