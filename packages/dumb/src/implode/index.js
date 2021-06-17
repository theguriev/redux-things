/**
 * It will create a type string for action from array.
 * Example:
 * implode('/', '@redux-things', 'success') === '@redux-things/success'
 *
 * @param {string} delimiter type delimiter
 * @param  {...any} rest type string parts.
 */
export const implode = (delimiter, ...rest) => rest.join(delimiter)
