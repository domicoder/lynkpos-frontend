const envVars = [
  'VITE_APP_NAME',
  'VITE_APP_TITLE',
  'VITE_ENV',
  'VITE_BASE_API',
  'VITE_DEV_BACKEND_URL',
  'VITE_PRIVATE_TOKEN_NPM',
  'VITE_CACHE_DIR',
];

export const validateEnvironmentVariables = () => {
  envVars.forEach((envVar) => {
    if (import.meta.env[envVar] == null) {
      throw new Error(
        `Environment variable '${envVar}' not found. Please refer to the README for more instructions and ensure your '.env' file is up to date with '.env.example'.`,
      );
    }

    if (import.meta.env[envVar] === `<${envVar}>`) {
      throw new Error(
        `Placeholder environment variable for '${envVar}' detected. Please refer to the README for more instructions.`,
      );
    }
  });
};
