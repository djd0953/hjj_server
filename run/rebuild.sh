#!/bin/bash

echo "♻️ 컨테이너 재빌드 후 백그라운드 실행 중..."
docker compose down
docker compose up --build -d

