import * as express from 'express';
import * as joi from 'joi';
import validate from 'validate';

const router = express.Router();

export default router;

export class HttpStatus<T> {
    constructor(public statusCode: number, public body?: T) {
    }
}

function sendResponse<T>(result: T | HttpStatus<any>, res: express.Response) {
    if (result instanceof HttpStatus) {
        const httpStatus = <HttpStatus<any>>result;
        if (httpStatus.body)
            res.status(httpStatus.statusCode).send(httpStatus.body);
        else
            res.sendStatus(httpStatus.statusCode);
    } else {
        res.json(result);
    }
}

export function Delete<T>(
    path: string,
    schemas: { params?: joi.SchemaMap, query?: joi.SchemaMap, body?: joi.SchemaMap },
    func: (params?: any, query?: any, body?: any) => Promise<T | HttpStatus<any>>) {

    router.delete(path, validate(schemas), (req, res, next) => {
        func(req.params, req.query, req.body)
            .then(result => sendResponse(result, res))
            .catch(err => next(err));
    });
}

export function Get<T>(
    path: string,
    schemas: { params?: joi.SchemaMap, query?: joi.SchemaMap },
    func: (params?: any, query?: any) => Promise<T | HttpStatus<any>>) {

    router.get(path, validate(schemas), (req, res, next) => {
        func(req.params, req.query)
            .then(result => sendResponse(result, res))
            .catch(err => next(err));
    });
}

export function Post<T>(
    path: string,
    schemas: { params?: joi.SchemaMap, query?: joi.SchemaMap, body?: joi.SchemaMap },
    func: (params?: any, query?: any, body?: any) => Promise<T | HttpStatus<any>>) {

    router.post(path, validate(schemas), (req, res, next) => {
        func(req.params, req.query, req.body)
            .then(result => sendResponse(result, res))
            .catch(err => next(err));
    });
}

export function Put<T>(
    path: string,
    schemas: { params?: joi.SchemaMap, query?: joi.SchemaMap, body?: joi.SchemaMap },
    func: (params?: any, query?: any, body?: any) => Promise<T | HttpStatus<any>>) {

    router.put(path, validate(schemas), (req, res, next) => {
        func(req.params, req.query, req.body)
            .then(result => sendResponse(result, res))
            .catch(err => next(err));
    });
}
