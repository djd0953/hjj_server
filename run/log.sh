#!/bin/bash

# 프로젝트 디렉토리로 이동
cd /home/hjj0106/hjj-0106 || {
  echo "❌ 프로젝트 디렉토리로 이동 실패: /home/hjj0106/hjj-0106"
  exit 1
}

# 로그 출력
echo "📝 실시간 로그 출력 중 (Ctrl+C 로 종료 가능, 컨테이너는 계속 실행됩니다)"
docker compose logs -f

