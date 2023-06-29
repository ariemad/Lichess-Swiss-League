FROM node

WORKDIR /app
COPY . .
RUN npm i

CMD ["node", "Usage_Examples/NoStopSwiss.js"]