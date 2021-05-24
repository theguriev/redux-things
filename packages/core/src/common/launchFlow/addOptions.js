export default ({ launchOptions, key }) => {
    if (typeof launchOptions === 'object') {
        return {
            options: { ...launchOptions, __THING_KEY__: key }
        }
    }
    return {
        options: launchOptions
    }
}
