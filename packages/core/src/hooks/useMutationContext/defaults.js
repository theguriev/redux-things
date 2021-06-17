import { objectHash as objectToHashFn } from '@redux-things/dumb'

export const mutationDefaults = {
    mutationKey: 'global',
    onStart: () => {},
    onSuccess: () => {},
    onError: () => {},
    namespace: '@redux-things/mutation',
    delimiter: '/',
    objectToHashFn
}
