import { APIError } from '../shared/classes/api-error';
import { HttpStatusCode } from '../shared/types/http.model';
import { BaseError } from '../shared/classes/base-error';
import {knex} from "../core/postgres";

export const saveInDB = async (fail: boolean) => {
    const isValid = true;
    if (!isValid) {
        const errMessage = 'Could not save in DB, already exists';
        throw new APIError(errMessage, 'saveInDB', HttpStatusCode.ALREADY_EXISTS);
    }
    if (fail) {
        await knex('some_table_that_doesnt_exist');
    }
    try {
        await someAsyncOperation();
    } catch (err) {
        throw new BaseError('Could not perform async operation', err, 'saveInDB');
    }
    return true;
};

async function someAsyncOperation() {
    await knex.insert({name: 'Test-stock'}).into('stocks');
}
