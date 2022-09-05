FROM node:16.17 as build
ENV NODE_ENV=production
ENV LANG C.UTF-8

COPY package.json /opt/course-system-example/backend/
COPY package-lock.json /opt/course-system-example/backend/
WORKDIR /opt/course-system-example/backend/
RUN npm install
ADD ./ /opt/course-system-example/backend/
CMD ["npm", "run", "build"]
EXPOSE 8000
