/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three', 'web-ifc', 'web-ifc-three'],
    webpack: (config, { isServer }) => {
        // Handle web-ifc critical dependency warning
        config.module.exprContextCritical = false;
        
        // Handle .wasm files
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
        };

        return config;
    },
};

module.exports = nextConfig;
