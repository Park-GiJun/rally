# rally backend 공통 멀티스테이지 빌드.
# 빌드 컨텍스트 = backend/ (gradlew·settings.gradle.kts 위치). 어떤 모듈을 담을지는
# --build-arg MODULE=<service> 로 결정한다(deploy/docker-compose.yml 가 서비스별로 주입).
#
#   docker build -f backend/Dockerfile --build-arg MODULE=user-service -t rally-user-service backend/

# ── build: JDK 25 toolchain 으로 해당 모듈의 실행 가능 jar 만 빌드 ──
FROM eclipse-temurin:25-jdk AS build
ARG MODULE
WORKDIR /workspace
COPY . .
# bootJar 만 호출 → plain(라이브러리) jar 는 생성되지 않아 아래 COPY 가 단일 jar 로 안전.
RUN sh ./gradlew :${MODULE}:bootJar -x test --no-daemon

# ── runtime: JRE 25 슬림 이미지 ──
FROM eclipse-temurin:25-jre AS runtime
ARG MODULE
WORKDIR /app
COPY --from=build /workspace/${MODULE}/build/libs/*.jar app.jar
# 실제 포트/프로파일/시크릿은 compose 환경변수로 주입(config-server 에서 설정 수신).
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
