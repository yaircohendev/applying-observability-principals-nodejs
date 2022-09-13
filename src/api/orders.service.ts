
export const saveInDB = async () => {
    const isValid = true;
    if (!isValid) {
        const errMessage = 'Could not save in DB, already exists';
        throw new Error(errMessage);
    }
    try {
        await someAsyncOperation();
    } catch (err) {
        throw new Error('Could not perform async operation');
    }
    return true;
};

async function someAsyncOperation() {
    return Promise.resolve();
}
