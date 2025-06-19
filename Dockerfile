FROM maven:3.9.2 AS builder
WORKDIR /app
COPY . /app
RUN mvn clean package

FROM openjdk:17
WORKDIR /app
COPY --from=builder /app/target/PhotogalleryServer-0.0.1-SNAPSHOT.jar /app
CMD ["java", "-jar", "PhotogalleryServer-0.0.1-SNAPSHOT.jar"]
