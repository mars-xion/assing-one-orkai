# Step 1: Use a lightweight Node.js image as the base
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the entire app into the container
COPY . .

# Step 5: Expose the app port and start the React app
EXPOSE 3000
CMD ["npm", "start"]
