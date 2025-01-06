# Use official Node.js image as a base
FROM node:18-alpine

WORKDIR /app

COPY . .


# Add executable permissions for entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["./entrypoint.sh"]