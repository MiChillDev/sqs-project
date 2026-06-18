# Build stage
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy pom.xml and source
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Install curl for Docker healthcheck
RUN apt-get update \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

# Copy the built JAR from builder stage
COPY --from=builder /build/target/sqs-project-*.jar app.jar

# Expose the port and run application
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
