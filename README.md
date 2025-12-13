### 도커라이징(이미지)

docker buildx build \
--platform linux/amd64 \
-t minwoojungdev/smartstore-v3:latest \
--push \
.

### 도커허브 이미지 풀 
docker pull minwoojungdev/smartstore-v3:latest
