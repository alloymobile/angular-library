# =============================================================================
# PLRA — Multi-Stage Dockerfile
# =============================================================================
# Stage 1: Build Angular frontend
# Stage 2: Build Spring Boot backend (with Angular dist embedded)
# Stage 3: Runtime image (slim JRE only)
#
# Usage:
#   docker build -t plra-api:latest .
#   docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=azure plra-api:latest
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Build Angular
# ---------------------------------------------------------------------------
FROM node:20-alpine AS angular-build

WORKDIR /app/plra-ui
COPY plra-ui/package.json plra-ui/package-lock.json ./
RUN npm ci --prefer-offline

COPY plra-ui/ ./
RUN npm run build -- --configuration production

# ---------------------------------------------------------------------------
# Stage 2: Build Spring Boot (with Angular dist)
# ---------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-17-alpine AS java-build

WORKDIR /app

# Cache Maven dependencies
COPY pom.xml ./
COPY plra-api/pom.xml ./plra-api/
COPY plra-ui/pom.xml ./plra-ui/
RUN mvn dependency:go-offline -pl plra-api -am -B -Pskip-ui 2>/dev/null || true

# Copy source
COPY plra-api/ ./plra-api/

# Copy Angular dist into Spring Boot static resources
COPY --from=angular-build /app/plra-ui/dist/td-angular/browser/ ./plra-api/src/main/resources/static/

# Build the JAR (skip UI module, Angular already built)
RUN mvn package -pl plra-api -am -B -DskipTests -Pskip-ui

# ---------------------------------------------------------------------------
# Stage 3: Runtime (slim)
# ---------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine AS runtime

# Security: run as non-root
RUN addgroup -S plra && adduser -S plra -G plra
USER plra

WORKDIR /app

# Copy the built JAR
COPY --from=java-build /app/plra-api/target/plra-api-*.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/plra/actuator/health || exit 1

# Expose port
EXPOSE 8080

# JVM tuning for containers
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]
