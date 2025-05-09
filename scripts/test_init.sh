#!/bin/bash
set -e
trap 'echo "[ERROR] 에러 발생! (Line: $LINENO, Command: $BASH_COMMAND)" >&2; exit 1' ERR

# 조용히 실행하는 함수
run_quiet() {
    echo "▶ $1"
    shift
    "$@" > /dev/null 2>&1 && echo "✅ 성공: $1" || { echo "❌ 실패: $1"; exit 1; }
}

# =================================================================================================
# CONFIG
# =================================================================================================

path_repo='/home/hjj0106/hjj_server'
path_nginx_vhost_file='/etc/nginx/sites-available'
nginx_vhost_filename='default'
path_robot_file='/var/www/'
env_app_list="api web"
github_email="skyzzang0106@naver.com"
github_pat="pat_key..."
github_ssh_url="git@github.com:djd0953/hjj_server.git"
github_use_branch="test_1"
use_node_version=("16.15.1" "22.14.0" "18.17.0")
node_version=${use_node_version[1]}

# =================================================================================================
# USER INPUT
# =================================================================================================

echo "Please enter name of test server:"
read test_server_name
echo "Test server name is: '$test_server_name'"

# =================================================================================================
# APPS 설치
# =================================================================================================

echo ""
echo "🔧 패키지 설치 중..."

run_quiet "패키지 업데이트" sudo apt update -y
run_quiet "패키지 업그레이드" sudo apt-get upgrade -y
run_quiet "기본 의존성 설치" sudo apt-get install -y unzip bzip2 ca-certificates fonts-liberation libasound2t64 \
libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 \
libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
lsb-release wget xdg-utils

run_quiet "Nginx 설치" sudo apt-get install -y nginx

# =================================================================================================
# NVM 설치
# =================================================================================================

echo ""
echo "🧰 NVM 설치 중..."

run_quiet "NVM 다운로드" bash -c "$(curl -s -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh)"

if ! grep -q 'NVM_DIR' "$HOME/.bashrc"; then
    echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.bashrc"
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$HOME/.bashrc"
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> "$HOME/.bashrc"
fi

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

for version in "${use_node_version[@]}"; do
    run_quiet "Node.js $version 설치" nvm install "$version"
done

# =================================================================================================
# SSH KEY
# =================================================================================================

echo ""
echo "🔑 SSH Key 생성 및 등록 중..."

if [ -f "$HOME/.ssh/id_ed25519" ]; then
    echo "✅ SSH 키가 이미 존재합니다."
else
    ssh-keygen -t ed25519 -C "$github_email" -f "$HOME/.ssh/id_ed25519" -N "" > /dev/null
fi

eval "$(ssh-agent -s)" > /dev/null
ssh-add $HOME/.ssh/id_ed25519 > /dev/null

pub_key=$(cat "$HOME/.ssh/id_ed25519.pub")
response_code=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST \
    -H "Authorization: token $github_pat" \
    -H "Accept: application/vnd.github+json" \
    https://api.github.com/user/keys \
    -d "{\"title\":\"$test_server_name-$(date +%Y%m%d%H%M%S)\",\"key\":\"$pub_key\"}")

if [ "$response_code" != "201" ]; then
    echo "❌ GitHub SSH Key 등록 실패 ($response_code)"
    exit 1
else
    echo "✅ SSH Key 등록 완료"
fi

# =================================================================================================
# 소스 클론 및 PM2 설치
# =================================================================================================

echo ""
echo "📁 Git 클론 및 PM2 설치 중..."

[ ! -d "$HOME/hjj_server" ] && sudo mkdir $HOME/hjj_server
sudo chown -R $USER:$USER $HOME/hjj_server

run_quiet "Git 클론" git clone --quiet $github_ssh_url $HOME/hjj_server
cd $HOME/hjj_server
run_quiet "브랜치 체크아웃" git checkout $github_use_branch
run_quiet "Git Pull" git pull --quiet
run_quiet "Node.js 버전 활성화" nvm use $node_version
run_quiet "PM2 전역 설치" npm install pm2 -g --silent

[ ! -f "package.json" ] && echo "❌ package.json 없음" && exit 1
run_quiet "npm install" npm install --legacy-peer-deps --silent

# =================================================================================================
# 스크립트 확인 및 실행
# =================================================================================================

[ ! -f "scripts/test_setup.sh" ] && echo "❌ test_setup.sh 없음" && exit 1
bash "scripts/test_setup.sh"

# =================================================================================================
# 폰트 설치
# =================================================================================================

echo ""
echo "🖋️ 폰트 설치 중..."

run_quiet "fontconfig 설치" sudo apt install -y fontconfig
fc-cache -f -v > /dev/null
if [ -d "truetype" ]; then
    sudo mv truetype/ /usr/share/fonts/truetype/
    sudo rm -rf /usr/share/fonts/truetype/dejavu
fi

# =================================================================================================
# ENV 설정
# =================================================================================================

echo ""
echo "⚙️ 앱 ENV 설정 중..."

for file in $env_app_list; do
    src="$path_repo/infra/test/envs/$file.env"
    dst="$path_repo/apps/$file/.env"
    if [ -f "$src" ]; then
        sed "s/alpha/$test_server_name/g" "$src" > "$dst" && echo "✅ ENV 복사 완료: $file" || exit 1
    else
        echo "❌ $src 파일 없음"
        exit 1
    fi
done

# =================================================================================================
# NGINX 설정
# =================================================================================================

echo ""
echo "🧩 NGINX 설정 중..."

[ ! -d "$path_nginx_vhost_file" ] && echo "❌ Nginx 설정 경로 없음" && exit 1
[ ! -w "$path_nginx_vhost_file" ] && echo "❌ 쓰기 권한 없음" && exit 1

sed "s/ABCDEFG/$test_server_name/g" "$path_repo/infra/test/nginx.config" > "$path_nginx_vhost_file/$nginx_vhost_filename" && \
echo "✅ nginx.config 복사 완료" || exit 1

# =================================================================================================
# CERTBOT & ROBOTS
# =================================================================================================

echo ""
echo "🔐 Certbot & robots 설정 중..."

run_quiet "Certbot 설치" sudo snap install --classic certbot
run_quiet "SSL 인증서 발급" sudo certbot --nginx

[ ! -d "$path_robot_file" ] && echo "❌ robot 파일 경로 없음" && exit 1
[ ! -w "$path_robot_file" ] && echo "❌ robot 쓰기 권한 없음" && exit 1

cp "$path_repo/infra/test/robots.txt" "$path_robot_file" && \
echo "✅ robots.txt 복사 완료" || exit 1

# =================================================================================================
# 서버 실행
# =================================================================================================

[ ! -f "scripts/test_cold_start.sh" ] && echo "❌ test_cold_start.sh 없음" && exit 1
bash "scripts/test_cold_start.sh"

echo ""
echo "🎉 서버 세팅 완료!"