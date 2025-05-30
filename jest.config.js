import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
    transform: {
        ...tsJestTransformCfg,
    },
};
