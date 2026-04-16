FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port 3000 to the outside once the container has launched
EXPOSE 3000

# Start the application
CMD [ "node", "app.js" ]
