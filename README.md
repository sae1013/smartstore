### 도커라이징(이미지)

docker buildx build \
--platform linux/amd64,linux/arm64 \
-t minwoojungdev/smartstore:latest \
--push \
.

### 도커허브 이미지 풀 
docker pull minwoojungdev/smartstore:latest
