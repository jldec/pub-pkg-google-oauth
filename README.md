# pub-pkg-google-oauth

### installation
This package is included with pub-server. It can be activated by including it as a theme on the command line or in `pub-config`.

```sh
pub -t google-oauth
```

### credentials
pub-pkg-google-oauth requires the client ID and a client secret to be specified as environment variables `GID` and `GCS` respectively.

```sh
export GID={client_ID}
export GCS={client_secret}
```

### configuring your app URL endpoint
oauth requires an endpoint for the protocol to redirect to after authenticating. In addition, google will not allow
a site to authenticate with oauth unless the site has been registered as a "javascript origin".

If you are using heroku, you can use your heroku app URL for this.

If you are running on your own machine over a local area network (or on wifi), you will need to configure a
tunnel service like [localtunnel.me](http://localtunnel.me/) so that your server can be reached from the Internet.

```sh
npm install -g localtunnel
lt --port 3001 --subdomain {yourname}
```

In either case, once you know your app URL, you can configure pub-server and pub-pkg-google-auth to use it by
setting the `APP` environment variable. E.g.

```sh
export APP=https://{yourname}.localtunnel.me
```

### oauth configuration on google
- use the [google developers console](https://console.developers.google.com/) and create project if you don't already have one
- under `APIs and auth` / `APIs`, make sure that the `Google+ API` is enabled
- under `APIs and auth` / `Credentials`, note or create your Client ID
- `Edit Settings` to access the form to set Javascript Origins and Redirect URIs
- configure a `Redirect URI` to `{your app url}/server/auth/google/callback`
- configure a `Javascript origin` to match your app URL
- if you like, you can also customize the consent screen under `APIs and auth` / `Consent screen`


### configuring google email addressses to access pub-server
ACLs are configured using environment variables `ACL_ADMIN`, `ACL_EDIT`, and `ACL_READ`. 
These contain comma-separated lists of users.

E.g. To grant yourself admin rights, and 3 other users read access:

```sh
export ACL_ADMIN={your-email}
export ACL_READ={email-1},{email-2},{email-3}
```

You can also open public/anonymous access to non-protected pages by running `pub -P` or setting `opts.publicPages`

### to test locally
- make sure you have set environment variables `GID`, `GCS`, `APP`, and `ACL_ADMIN` (or some other `ACL_`)
- start localtunnel or similar service
- start pub-server with google oauth

```sh
$ pub -t google-oauth
```

- now point your browser to https://{yourname}.localtunnel.me


### credits
- the heavy lifting in this package is done by
  [passport](http://passportjs.org/) and
  [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth)