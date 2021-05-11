export const fakeFetch = (data, delay = 300) => new Promise(
    resolve => setTimeout(() => resolve(data), delay)
)
