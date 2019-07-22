module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'vue', 'json'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(gql|graphql|css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub'
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testURL: 'http://localhost/'
  // collectCoverage: true,
  // collectCoverageFrom: [
  //  '<rootDir>/components/**/*.{vue,js,ts}',
  //  '<rootDir>/pages/**/*.{vue,js,ts}'
  // ],
}
