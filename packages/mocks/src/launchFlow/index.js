export const launchFlowActions = {
    error: data => ({
        type: 'error',
        ...data
    }),
    fulfilled: data => ({
        type: 'fulfilled',
        ...data
    }),
    pending: data => ({
        type: 'pending',
        ...data
    })
}
