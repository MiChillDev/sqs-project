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

# Copy the built JAR from builder stage
COPY --from=builder /build/target/sqs-project-*.jar app.jar

# Expose the port
EXPOSE 8080

# Environment variables
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/sqs_db
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=postgres

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
