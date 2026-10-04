import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	rewrites: async () => [
		{
			source: "/api/:path*",
			destination: `${process.env.BACKEND_URL}/:path*`,
		},
	],
};

export default nextConfig;
