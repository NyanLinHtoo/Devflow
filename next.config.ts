import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL;

if (!backendUrl) {
	throw new Error("BACKEND_URL is not defined");
}

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	rewrites: async () => [
		{
			source: "/api/:path*",
			destination: `${backendUrl}/:path*`,
		},
	],
};

export default nextConfig;
