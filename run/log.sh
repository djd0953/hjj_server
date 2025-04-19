#!/bin/bash

echo "📝 실시간 로그 출력 중 (Ctrl+C 로 종료 가능, 컨테이너는 계속 실행됩니다)"
docker compose logs -f
