#!/bin/bash
set -e
trap 'echo "[ERROR] 에러 발생! (Line: $LINENO, Command: $BASH_COMMAND)" >&2; exit 1' ERR

# =================================================================================================
# CONFIG
# =================================================================================================

# repo를 git 에서 풀 받은 절대 경로
path_repo='/home/hjj0106/hjj_server'

# nginx virtual host 설정 하는 기 위해 경로 존재 및 쓰기 권한 확인
path_nginx_vhost_file='/etc/nginx/sites-available'
nginx_vhost_filename='default'

# robots.txt 파일을 저장할 위치
# 주의!!!! 이 위치를 수정시 nginx 설정도 수정 해야 함. nginx 쪽에다가 하드 코딩 함 ㅋㅋ
path_robot_file='/var/www/'

# env apps to setup
env_app_list="api web"

# google ssh 연결을 위한 email 및 pat key
github_email="skyzzang0106@naver.com"
github_pat="pat_key..."

# github 연동을 위한 repo url
github_ssh_url="git@github.com:djd0953/hjj_server.git"
# 테스트 서버에서 사용할 branch name
github_use_branch="test_1"

# nvm 설치 할 node version (frontend node version, backend node version, ...기타 사용 버전)
use_node_version=("16.15.1" "22.14.0" "18.17.0")
node_version=${use_node_version[1]}

# =================================================================================================
# USER INPUT
# =================================================================================================

# 테스트 환경 이름 (예. sehee, beta, theta 등)
echo "Please enter name of test server:"
read test_server_name

echo "Test server name is: '$test_server_name'"




# #################################################################################################
#
#                                    진행 순서
# 1.
# 2.
#
#
#
#
#
#
#
# #################################################################################################


# =================================================================================================
# APPS
# =================================================================================================

echo ''
echo ''
echo 'APPS'

# apt update & upgrade
sudo apt update
sudo apt-get -y upgrade

# 의존성 라이브러리 다운로드
sudo apt-get install -y \
    unzip \
    bzip2 \
    ca-certificates \
    fonts-liberation \
    libasound2t64 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \

# NginX 다운로드
sudo apt-get install -y nginx

# NVM 다운로드 및 환경 변수 설정
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# ~/.bashrc에 등록
if ! grep -q 'NVM_DIR' "$HOME/.bashrc"; then
    echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.bashrc"
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$HOME/.bashrc"
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> "$HOME/.bashrc"
fi

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# Config에서 설정한 node version 다운로드
for version in "${use_node_version[@]}"; do
    nvm install "$version"
done

# -------------------------------------------------------------------------------------------------
# SSH keygen
# -------------------------------------------------------------------------------------------------

if [ -f "$HOME/.ssh/id_ed25519" ]; then
        echo "SSH KEY가 이미 존재함"
else
        ssh-keygen -t ed25519 -C "$github_email" -f "$HOME/.ssh/id_ed25519" -N ""
fi

eval "$(ssh-agent -s)"
ssh-add $HOME/.ssh/id_ed25519

pub_key=$(cat "$HOME/.ssh/id_ed25519.pub")

# -------------------------------------------------------------------------------------------------
# GITHUB ssh key 추가
# -------------------------------------------------------------------------------------------------

response_code=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST \
    -H "Authorization: token $github_pat" \
    -H "Accept: application/vnd.github+json" \
    https://api.github.com/user/keys \
    -d "{\"title\":\"$test_server_name-$(date +%Y%m%d%H%M%S)\",\"key\":\"$pub_key\"}")

# github ssh key 등록 실패
if [ "$response_code" != "201" ]; then
    echo "Error: GitHub SSH Key 등록 실패 ($response_code)"
    exit 1
fi

# -------------------------------------------------------------------------------------------------
# Source Clone 및 PM2, module 다운로드
# -------------------------------------------------------------------------------------------------

[ ! -d "$HOME/hjj_server" ] && sudo mkdir $HOME/hjj_server
sudo chown -R $USER:$USER $HOME/hjj_server
git clone $github_ssh_url $HOME/hjj_server/
cd $HOME/hjj_server
git checkout $github_use_branch
git fetch origin
git pull
nvm use $node_version
npm install pm2 -g

if [ ! -d "$HOME/hjj_server/package.json" ]; then
    echo "Error: package.json이 없음"
    exit 1
if

npm install --legacy-peer-deps

if [ ! -d "$HOME/hjj_server/scripts" ]; then
    echo "Error: scripts 디렉토리가 존재하지 않음"
    exit 1
if

if [ ! -d "$HOME/hjj_server/scripts/test_setup.sh" ]; then
    echo "Error: Test setup shell script 파일이 존재하지 않음"
    exit 1
if

bash "$HOME/hjj_server/scripts/test_setup.sh"

# -------------------------------------------------------------------------------------------------
# font 다운로드
# -------------------------------------------------------------------------------------------------

sudo apt install fontconfig
fc-cache -f -v
if [ -d "truetype" ]; then
    sudo mv truetype/ /usr/share/fonts/truetype/
    sudo rm -rf /usr/share/fonts/truetype/dejavu
fi

# -------------------------------------------------------------------------------------------------
# env file setup
# -------------------------------------------------------------------------------------------------

echo ''
echo ''
echo 'APPS env'

# apps 배열 loop 하기
for file in $env_app_list; do
    if [ -f "$path_repo/infra/test/envs/$file.env" ]; then

                sed "s/alpha/$test_server_name/g" "$path_repo/infra/test/envs/$file.env" > "$path_repo/apps/$file/.env"

                if [ $? -eq 0 ]; then
                        echo "Successfully copied : $path_repo/infra/test/envs/$file.env => $path_repo/apps/$file/.env"
                else
                        echo "Error: $path_repo/infra/test/envs/$file.env => $path_repo/apps/$file/.env"
                        exit 1
                fi
    else
        echo "Error: $file does not exist or is not a regular file."
                exit 1
    fi
done


# =================================================================================================
# NGINX
# =================================================================================================

echo ''
echo ''
echo 'NGINX'

# -------------------------------------------------------------------------------------------------
# virutal host
# -------------------------------------------------------------------------------------------------

echo ''
echo ''
echo 'NGINX Virtual Host'

# virtual host 파일 저장 경로 존재 여부
if [ ! -d "$path_nginx_vhost_file" ]; then
    echo "Error: nginx 파일 을 저장 경로 존재하지 않음 '$path_nginx_vhost_file'"
    exit 1
fi

# virutal host 파일 저장 경로 쓰는 권한 여부 확인
if [ ! -w "$path_nginx_vhost_file" ]; then
    echo "Error: '$path_nginx_vhost_file' 경로에 쓰기 권한이 없음."
    exit 1
fi

# Replace all occurrences of "ABCDEFG" with "sehee" and save to the destination
sed "s/ABCDEFG/$test_server_name/g" "$path_repo/infra/test/nginx.config" > "$path_nginx_vhost_file/$nginx_vhost_filename"

# robot 파일 복사 해보기
if [ $? -eq 0 ]; then
    echo "nginx.confing -> default 파일 복사 성공 '$path_nginx_vhost_file/$nginx_vhost_filename'"
else
    echo "Error: nginx.config 파일 복사 실패."
    exit 1
fi


# -------------------------------------------------------------------------------------------------
# certbot & robots
# -------------------------------------------------------------------------------------------------

echo ''
echo ''
echo 'NGINX certbot & robots'

sudo snap install --classic certbot
sudo certbot --nginx

# robot 파일 저장 경로 존재 여부
if [ ! -d "$path_robot_file" ]; then
    echo "Error: robot 파일 을 저장 경로 존재하지 않음 '$path_robot_file'"
    exit 1
fi

# robot 파일 저장 경로 쓰는 권한 여부 확인
if [ ! -w "$path_robot_file" ]; then
    echo "Error: '$path_robot_file' 경로에 쓰기 권한이 없음."
    exit 1
fi

# robot 파일 복사 해보기
cp "$path_repo/infra/test/robots.txt" "$path_robot_file"
if [ $? -eq 0 ]; then
    echo "robots.txt 파일 복사 성공 '$path_robot_file'"
else
    echo "Error: robots.txt 파일 복사 실패."
    exit 1
fi

# -------------------------------------------------------------------------------------------------
# server start
# -------------------------------------------------------------------------------------------------

# test_cold_start.sh에 pm2 stop all이 껴있어서 front end에서 한번만 실행 후 back end 별도로 실행
# Front End 실행

if [ ! -d "$HOME/hjj_server/scripts/test_cold_start.sh" ]; then
    echo "Error: Test cold start shell script 파일이 존재하지 않음"
    exit 1
if

bash "$HOME/hjj_server/scripts/test_cold_start.sh"

