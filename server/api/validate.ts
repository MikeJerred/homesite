import * as express from 'express';
import * as joi from 'joi';
///<reference path='../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable = require('immutable');

interface IFieldError {
    field: string;
    errors: string[];
}

export class ValidationError extends Error {
    constructor(private errors: { [key: string]: IFieldError[] }, public status?: number) {
        super('Validation Error');

        if (status === undefined)
            this.status = 400;
    }

    toString(): string {
        return JSON.stringify(this.errors);
    }
}

function validate(data: any, schema: joi.SchemaMap): Promise<any> {
    return new Promise((resolve, reject) => {
        const options = {
            context: data,
            allowUnknown: false,
            abortEarly: false
        };

        joi.validate(data, schema, options, (errors, value) => {
            if (!errors || errors.details.length === 0) {
                resolve(value);
            } else {
                const fieldErrors: IFieldError[] = Immutable.Seq(errors.details)
                    .groupBy(error => error.path)
                    .map(group => ({
                        field: group.first().path,
                        errors: group.map(error => error.message).toArray()
                    }))
                    .toArray();

                reject(fieldErrors);
            }
        });
    });
}

export default function(schemas: { params?: joi.SchemaMap, query?: joi.SchemaMap, body?: joi.SchemaMap }) {
    return (req: express.Request, res: express.Response, next: Function) => {
        let errors: { [key: string]: IFieldError[] } = {};

        let promises: Promise<any>[] = [];

        if (schemas.params) {
            promises.push(validate(req.params, schemas.params)
                .catch(fieldErrors => { errors['params'] = fieldErrors; })
                .then(value => { req.params = value; }));
        }

        if (schemas.query) {
            promises.push(validate(req.query, schemas.query)
                .catch(fieldErrors => { errors['query'] = fieldErrors; })
                .then(value => { req.query = value; }));
        }

        if (schemas.body) {
            promises.push(validate(req.body, schemas.body)
                .catch(fieldErrors => { errors['body'] = fieldErrors; })
                .then(value => { req.body = value; }));
        }

        Promise.all(promises).then(() => {
            if (errors['params'] || errors['query'] || errors['body']) {
                next(new ValidationError(errors));
            } else {
                next();
            }
        });
    }
}
