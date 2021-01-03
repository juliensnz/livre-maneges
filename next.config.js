module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/livre-conference',
        permanent: true,
      },
    ]
  },
}
