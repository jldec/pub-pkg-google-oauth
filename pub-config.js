// pub-pkg-google-oauth pub-config.js

module.exports = {

  // prevent pub-pkg folders from misbehaving when opened using pub
  'pub-pkg':'pub-pkg-google-oauth',

  sources: { path:'./login', fragmentDelim:true },

  staticPaths: './static',

  serverPlugins: './google-oauth.js'

};
