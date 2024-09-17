import path from 'path';
import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Resolve the directory name for ES Modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Set up alias for '@/'
    config.resolve.alias['@'] = path.resolve(__dirname, 'src'); // Adjust if you're not using src folder
    return config;
  },
};

export default nextConfig;
