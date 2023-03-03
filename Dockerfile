# FROM node:16

# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci


# COPY . .

# RUN npm run build && npm prune --production
# ENV PORT 3001
# EXPOSE 3001

# CMD [ "npm", "run", "dev"]

FROM node:lts-slim AS builder
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app/
RUN npm run build && npm prune --production

FROM node:lts-slim
USER node:node
WORKDIR /app
COPY --from=builder --chown=node:node /app/build  /app/build
COPY --from=builder --chown=node:node /app/node_modules /app/node_modules
COPY --chown=node:node package.json .
ENV PORT 8001
EXPOSE 8001
CMD ["node", "build"]