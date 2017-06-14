FROM mhart/alpine-node:8

WORKDIR /src
ADD . .
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
