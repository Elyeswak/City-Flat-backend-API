import jwt from 'jsonwebtoken';
import { ROLE } from '../models/user.enums.js';

export function ensureUser(req, res, next) {
    try {
        //console.log(req.headers.authorization);

        const token = req.headers.authorization.split(' ')[1];
        //console.log(req);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decodedToken.user.id,
            name: decodedToken.user.name,
            email: decodedToken.user.email,
            role: decodedToken.user.role,
        };
        next();
    } catch (err) {
        res.status(401).json({
            //message: 'Auth failed',
            message: err.message,
        });
    }
}
export function ensureLoggedIn(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const id = decodedToken.user.id;
        const name = decodedToken.user.name;
        const email = decodedToken.user.email;
       const role = decodedToken.user.role;
        var user = req.params.param;
        if (
            user.toString() !== name.toString() &&
            user.toString() !== email.toString() &&
            user.toString() !== id.toString() &&
            user.toString() !== role.toString()

        ) {
            return res.status(401).json({
                message: 'Invalid token',
            });
        } else {
            next();
        }
    } catch (err) {
        return res.status(500).json({
            error: new Error('Invalid request!'),
        });
    }
}

export function ensureAdmin(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken.user.role !== ROLE.ADMIN) {
            return res.status(401).json({
                message: 'You are not an admin to perform this action',
            });
        } else {
            next();
        }
    } catch (err) {
        return res.status(500).json({
            error: new Error('Invalid request!'),
        });
    }
}
