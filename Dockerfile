FROM mhart/alpine-node:8

MAINTAINER Datawire <dev@datawire.io>
LABEL PROJECT_REPO_URL         = "git@github.com:datawire/ambassador-auth-service.git" \
      PROJECT_REPO_BROWSER_URL = "https://github.com/datawire/ambassador-auth-service" \
      DESCRIPTION              = "Example auth service for Ambassador" \
      VENDOR                   = "Datawire, Inc." \
      VENDOR_URL               = "https://datawire.io/"

WORKDIR /src
ADD . .
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
