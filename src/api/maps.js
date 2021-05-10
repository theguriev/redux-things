import {
    post,
    del as delMaps,
    get,
    patch
} from './request'

/**
 * Add one more map.
 *
 * @param {object} data Map data.
 *
 * @returns {Promise}
 */
export const add = data => post(
    'maps',
    {
        method: 'POST',
        body: JSON.stringify(data)
    }
)

/**
 * Delete Maps.
 *
 * @param {object} ids Maps id's.
 *
 * @returns {Promise}
 */
export const del = ids => delMaps(
    'maps',
    {
        method: 'DELETE',
        body: JSON.stringify(ids)
    }
)

/**
 * Get maps.
 *
 * @returns {Promise}
 */
export const all = (options) => {
    console.log("options", options)
    return get('maps')
}

/**
 * Get one map.
 *
 * @param {number} id Map id.
 *
 * @returns {Promise}
 */
export const one = id => get(`map/${id}`)

/**
 * Save map.
 *
 * @param {number} id Map id.
 * @param {object} map Map data.
 *
 * @returns {Promise}
 */
export const save = ({ id, ...rest }) => patch(
    `map/${id}`,
    {
        method: 'PATCH',
        body: JSON.stringify({ id, ...rest })
    }
)
