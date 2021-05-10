/**
 * Generate random name for dummy responses or initial data.
 * Example: AAAAAAAAAAAAA
 */
export const generateRandomName = () => {
    const start = 5
    const end = 25
    const length = Math.floor(start + Math.random() * (end + 1 - start))

    return Array.from({ length })
        .map(() => 'A')
        .join('')
}
