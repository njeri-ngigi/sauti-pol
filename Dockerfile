FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the NestJS application (if using a build step)
# RUN npm run build

# Expose the port that your app runs on
EXPOSE 3000

# Command to run your application
CMD [ "npm", "run", "start:dev" ]
