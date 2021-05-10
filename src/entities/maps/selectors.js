export const selector = (state, options, key) => {
    const entities = state?.[key]?.data
    if (entities) {
        return Object.values(entities)
    }
    return null
}

export const oneSelector = (state, options, key) => {
    const entities = state?.[key]?.data || {}
    return entities[options] || null
}
