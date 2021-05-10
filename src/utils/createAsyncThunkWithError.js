import { createAsyncThunk } from '@reduxjs/toolkit'

/**
 * Unwrap error from thunk.
 *
 * @param payloadCreator Payload.
 */
const unwrapError = payloadCreator => async (args, thunkApi) => {
    try {
        return await payloadCreator(args, thunkApi)
    } catch (error) {
        return thunkApi.rejectWithValue(error)
    }
}

/**
 * Create async thunk with unwrapped error.
 * It means that if you will use that instead of createAsyncThunk
 * then u can catch your error object by simple .catch method.
 *
 * @param type Action type.
 * @param payloadCreator Payload.
 * @param options Thunk options.
 */
const createAsyncThunkWithError = (
    type,
    payloadCreator,
    options
) => createAsyncThunk(type, unwrapError(payloadCreator), options)

export default createAsyncThunkWithError
