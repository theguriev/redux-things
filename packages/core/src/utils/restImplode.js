/**
 * It will create a type string for action from array.
 * Example:
 * restImplode('/', '@redux-things', 'success') === '@redux-things/success'
 *
 * @param {string} delimiter type delimiter
 * @param  {...any} rest type string parts.
 */
export const restImplode = (delimiter, ...rest) => rest.join(delimiter)
