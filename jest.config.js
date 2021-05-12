const path = require('path')

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    transform: {
        '\\.[jt]sx?$': 'babel-jest'
    },
    modulePaths: [
        path.resolve(process.cwd(), 'node_modules'),
        path.resolve(__dirname, '../../node_modules')
    ],
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
    bail: true,
    moduleNameMapper: {
        "^lodash-es$": "lodash"
    },
    testRegex: '\\.?(test|tests|spec|integration)\\.[jt]sx?$',
    collectCoverage: false,
    verbose: true,
    collectCoverageFrom: ['**/*.js'],
}
