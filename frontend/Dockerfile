FROM node:16.17 as build
ENV NODE_ENV=production
ENV LANG C.UTF-8

COPY package.json /opt/course-system-example/frontend/
COPY package-lock.json /opt/course-system-example/frontend/
WORKDIR /opt/course-system-example/frontend/
RUN npm install
ADD ./ /opt/course-system-example/frontend/
RUN npm run build
CMD ["npx", "serve", "-s", "build"]
EXPOSE 3000
