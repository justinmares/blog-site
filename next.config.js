/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        // Redirect old WordPress URLs (justinmares.com/post-slug)
        // to new format (justinmares.com/posts/post-slug)
        source: '/:slug((?!posts|essays|admin|about|api|_next)[a-zA-Z0-9][a-zA-Z0-9_-]+)',
        destination: '/posts/:slug',
        permanent: true, // 301 redirect — tells Google to update its index
      },
    ]
  },
}
module.exports = nextConfig
