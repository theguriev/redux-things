import { objectHash } from '@/utils'
/* eslint-disable no-underscore-dangle */
/**
 * Add default predefined options to request.
 * @param {object} options Reqeust options.
 *
 * @returns {string}
 */
export const addDefaultOptions = options => {
    const newOptions = {
        redirect: 'follow',
        mode: 'cors',
        referrer: 'no-referrer',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        ...options
    }

    if (window.__MIND_MAPS__.nonce) {
        newOptions.headers['X-WP-Nonce'] = window.__MIND_MAPS__.nonce
        newOptions.headers.credentials = 'include'
    }
    return newOptions
}

/**
 * Add base URL to route.
 * @param {string} url Route.
 *
 * @returns {string}
 */
export const addBaseURL = (url, baseURL = window.__MIND_MAPS__.url) => {
    if (url.indexOf('http') === -1) {
        return baseURL + url
    }
    return url
}

/**
 * Handle HTTP request errors.
 * @param {object} response Response object.
 */
const handleErrors = response => {
    if (!response.ok) {
        throw response
    }
    return response
}

const fetchWithCache = (url, options) => {
    const hash = objectHash({ url, options })
    if (fetchWithCache.cache.has(hash)) {
        return fetchWithCache.cache.get(hash)
    }
    const promise = fetch(url, options)
    fetchWithCache.cache.set(hash, promise)
    return promise.then(res => {
        fetchWithCache.cache.delete(hash)
        return res
    })
}

fetchWithCache.cache = new Map()

/**
 * Make a request.
 * @param {string} url Route path.
 * @param {object} options Request options.
 *
 * @returns {Promise}
 */
export const request = (url, options) => fetchWithCache(addBaseURL(url), addDefaultOptions(options))
    .then(handleErrors)
    .then(res => res.clone().json())
    .then(res => res.data)

/**
 * Make a PUT request.
 *
 * @param {string} url Route path.
 * @param {object} options Request options.
 *
 * @returns {Promise}
 */
export const put = (url, options = Object.create(null)) => request(url, { ...options, method: 'PUT' })

/**
 * Make a POST request.
 *
 * @param {string} url Route path.
 * @param {object} options Request options.
 *
 * @returns {Promise}
 */
export const post = (url, options = Object.create(null)) => request(url, { ...options, method: 'POST' })

/**
 * Make a PATCH request.
 *
 * @param {string} url Route path.
 * @param {object} options Request options.
 *
 * @returns {Promise}
 */
export const patch = (url, options = Object.create(null)) => request(url, { ...options, method: 'PATCH' })

/**
 * Make a DELETE request.
 *
 * @param {string} url Route path.
 * @param {object} options Request options.
 *
 * @returns {Promise}
 */
export const del = (url, options = Object.create(null)) => request(url, { ...options, method: 'DELETE' })

/**
 * Make a GET request.
 *
 * @param {string} url Route path.
 * @param {object} options Request options.
 *
 * @returns {Promise}
 */
export const get = (url, options = Object.create(null)) => request(url, { ...options, method: 'GET' })
