#!/bin/bash
set -e

# =================================================================================================
# FUNCTION
# =================================================================================================
# 조용히 실행시키는 함수
run_quiet() {
    echo "▶ $1"
    shift
    "$@" > /dev/null 2>&1 && echo "Success" || { echo "Falid"; exit 1; }
}

# 2GB 스왑 파일 생성
setup_swap() {
    echo ""
    echo "▶ 스왑 파일 설정 중..."

    # 기존 스왑 비활성화 및 삭제
    if [ -f /swapfile ]; then
        swap_size=$(sudo du -m /swapfile | cut -f1)
        if [ "$swap_size" -ge 2048 ]; then
            echo "2GB 이상의 스와프 파일이 이미 존재합니다. 생성 생략."
            return
        else
            echo "기존 스와프파일 크기가 충분하지 않음. 재설정 중..."
            sudo swapoff /swapfile 2>/dev/null || true
            sudo rm -f /swapfile
        fi
    fi

    echo "2GB 스와프파일 생성 중..."
    sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile

    echo "스왑 활성화 완료"
    free -h
}


# =================================================================================================
# CONFIG
# =================================================================================================

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
env_file="$script_dir/.env"

if [ -f "$env_file" ]; then
    while IFS='=' read -r key value; do
	[[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
	value="${value%\"}"
	value="${value#\"}"
	if [[ "$key" == "use_node_version" ]]; then
	    IFS=' ' read -r -a use_node_version <<< "$value"
	else
	    eval "declare $key=\"$value\""
	fi
    done < "$env_file"
else
    echo "❌ .env 파일이 존재하지 않습니다: $env_file"
    exit 1
fi

required_vars=(
    front_path_repo
    back_path_repo
    path_nginx_vhost_file
    nginx_vhost_filename
    path_robot_file
    front_env_app_list
    back_env_app_list
    github_email
    github_pat
    gitgub_front_repo_url
    github_back_repo_url
    github_use_branch
    use_node_version
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
	echo "필수 환경 변수 '$var'가 설정되지 않았습니다."
	exit 1
    fi
done

front_node_version=${use_node_version[0]}
back_node_version=${use_node_version[1]}

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
echo '패키지 설치 중...'

run_quiet "패키지 업데이트" sudo apt update -y
run_quiet "패키지 업그레이드" sudo apt-get upgrade -y
run_quiet "기본 의존성 설치" sudo apt-get install -y unzip bzip2 ca-certificates fonts-liberation libasound2t64 \
libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 \
libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
lsb-release wget xdg-utils

run_quiet "Nginx 설치" sudo apt-get install -y nginx

setup_swap


# =================================================================================================
# NVM
# =================================================================================================

echo ''
echo ''
echo "NVM 설치 중..."

# NVM 다운로드 및 환경 변수 설정
run_quiet "NVM 다운로드" bash -c "$(curl -s -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh)"

if ! grep -q 'NVM_DIR' "$HOME/.bashrc"; then
    echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.bashrc"
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> "$HOME/.bashrc"
    echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> "$HOME/.bashrc"
fi

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# Config에서 설정한 node version 다운로드
for version in "${use_node_version[@]}"; do
    run_quiet "Node.js $version 설치" nvm install "$version"
done

# -------------------------------------------------------------------------------------------------
# SSH KEY
# -------------------------------------------------------------------------------------------------

echo ''
echo ''
echo "SSH Key 생성 및 등록 중..."

if [ -f "$HOME/.ssh/id_ed25519" ]; then
    echo "SSH 키가 이미 존재합니다."
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

if [ "$response_code" = "201" ]; then
    echo "SSH Key 등록 완료"
elif [ "$response_code" = "422" ]; then
    echo "이미 등록된 SSH Key입니다 (422)"
else
    echo "GitHub SSH Key 등록 실패 (HTTP $response_code)"
    exit 1
fi

# =================================================================================================
# FRONT 소스 클론 및 PM2 설치
# =================================================================================================

echo ""
echo "FRONT Git 클론 및 PM2 설치 중..."

[ ! -d "$front_path_repo" ] && sudo mkdir $front_path_repo
sudo chown -R $USER:$USER $front_path_repo

if [ -d "$front_path_repo/.git" ]; then
    cd "$front_path_repo"
    current_remote=$(git config --get remote.origin.url || echo "")

    if [ ! "$current_remote" == "$github_front_repo_url" ]; then
        echo "경고: 이미 존재하는 저장소의 원격 주소가 다릅니다."
        echo "     현재: $current_remote"
        echo "     기대: $github_front_repo_url"
        echo "     계속하려면 디렉토리를 비우거나 수동 정리 후 실행하세요."
        exit 1
    fi
else
    run_quiet "Git 클론" git clone --quiet "$github_front_repo_url" "$front_path_repo"
fi

cd $front_path_repo
run_quiet "브랜치 체크아웃" git checkout $github_use_branch
run_quiet "Git Pull" git pull --quiet
run_quiet "Node.js 버전 활성화" nvm use $front_node_version
run_quiet "PM2 전역 설치" npm install pm2 -g --silent

[ ! -f "package.json" ] && echo "package.json 없음" && exit 1
run_quiet "npm install" npm install --legacy-peer-deps --silent

# =================================================================================================
# FRONT TEST SETUP 스크립트 확인 및 실행
# =================================================================================================

[ ! -f "$front_path_repo/scripts/test_setup.sh" ] && echo "test_setup.sh 없음" && exit 1
bash "$front_path_repo/scripts/test_setup.sh"

# =================================================================================================
# FRONT ENV 설정
# =================================================================================================

echo ""
echo "FRONT ENV 설정 중..."

for file in $front_env_app_list; do
    src="$front_path_repo/infra/test/envs/$file.env"
    dst="$front_path_repo/apps/$file/.env"

    if [ -f "$src" ]; then
        sed "s/alpha/$test_server_name/g" "$src" > "$dst" && echo "ENV 복사 완료: $file" || exit 1
    else
        echo "$src 파일 없음"
        exit 1
    fi
done

# =================================================================================================
# BACK 소스 클론 및 PM2 설치
# =================================================================================================

echo ""
echo "BACK Git 클론 및 PM2 설치 중..."

[ ! -d "$back_path_repo" ] && sudo mkdir $back_path_repo
sudo chown -R $USER:$USER $back_path_repo

if [ -d "$back_path_repo/.git" ]; then
    cd "$back_path_repo"
    current_remote=$(git config --get remote.origin.url || echo "")

    if [ ! "$current_remote" == "$github_back_repo_url" ]; then
        echo "경고: 이미 존재하는 저장소의 원격 주소가 다릅니다."
        echo "     현재: $current_remote"
        echo "     기대: $github_back_repo_url"
        echo "     계속하려면 디렉토리를 비우거나 수동 정리 후 실행하세요."
        exit 1
    fi
else
    run_quiet "Git 클론" git clone --quiet "$github_back_repo_url" "$back_path_repo"
fi

cd $back_path_repo
run_quiet "브랜치 체크아웃" git checkout $github_use_branch
run_quiet "Git Pull" git pull --quiet
run_quiet "Node.js 버전 활성화" nvm use $back_node_version

[ ! -f "package.json" ] && echo "package.json 없음" && exit 1
run_quiet "npm install" npm install --legacy-peer-deps --silent

# =================================================================================================
# BACK TEST SETUP 스크립트 확인 및 실행
# =================================================================================================

[ ! -f "$back_path_repo/scripts/test_setup.sh" ] && echo "test_setup.sh 없음" && exit 1
bash "$back_path_repo/scripts/test_setup.sh"

# =================================================================================================
# BACK ENV 설정
# =================================================================================================

echo ""
echo "FRONT ENV 설정 중..."

for file in $back_env_app_list; do
    src="$back_path_repo/infra/test/envs/$file.env"
    dst="$back_path_repo/apps/$file/.env"

    if [ -f "$src" ]; then
        sed "s/alpha/$test_server_name/g" "$src" > "$dst" && echo "ENV 복사 완료: $file" || exit 1
    else
        echo "$src 파일 없음"
        exit 1
    fi
done

# =================================================================================================
# 폰트 설치
# =================================================================================================

echo ""
echo "폰트 설치 중..."

run_quiet "fontconfig 설치" sudo apt install -y fontconfig
fc-cache -f -v > /dev/null
if [ -d "truetype" ]; then
    sudo mv truetype/ /usr/share/fonts/truetype/
    sudo rm -rf /usr/share/fonts/truetype/dejavu
fi

# =================================================================================================
# NGINX 설정
# =================================================================================================

echo ""
echo "NGINX 설정 중..."

[ ! -d "$path_nginx_vhost_file" ] && echo "Nginx 설정 경로 없음" && exit 1

if [ ! -w "$path_nginx_vhost_file" ]; then
    echo "쓰기 권한 없음. 권한 보관 및 주는 중..." 
    sudo chown -R $USER:$USER "$path_nginx_vhost_file" && chmod u+w "$path_nginx_vhost_file"
    if [ ! -w "$path_nginx_vhost_file" ]; then
	echo "$path_nginx_vhost_file 쓰기 권한 주기 실패. 작업 중단." 
	exit 1
    fi
fi

sed "s/ABCDEFG/$test_server_name/g" "$back_path_repo/infra/test/nginx.config" > "$path_nginx_vhost_file/$nginx_vhost_filename" && \
echo "nginx.config 복사 완료" || exit 1

# =================================================================================================
# CERTBOT & ROBOTS
# =================================================================================================

echo ""
echo "Certbot & robots 설정 중..."

run_quiet "Certbot 설치" sudo snap install --classic certbot

certbot_status=$(sudo certbot certificates 2>/dev/null | grep -i 'Certificate Name' || true)
if [ -n "$certbot_status" ]; then
    echo "이미 인증서가 발급되어 있음 → certbot 실행 생략"
else
    echo "SSL 인증서 발급 시도 중..."
    retry_count=0
    max_retries=3
    until timeout 20 sudo certbot --nginx; do
        retry_count=$((retry_count + 1))
        echo "인증서 발급 실패 (시도 $retry_count/$max_retries)"
        if [ $retry_count -ge $max_retries ]; then
            echo "최대 재시도 횟수 초과. 인증서 발급 건너뜀."
            break
        fi
        sleep 2
    done
fi

[ ! -d "$path_robot_file" ] && echo "robot 파일 경로 없음" && exit 1

if [ ! -w "$path_robot_file" ]; then
    echo "'$path_robot_file' 경로에 쓰기 권한이 없습니다. 권한 보관 및 주는 중..."
    sudo chown -R $USER:$USER "$path_robot_file" && chmod u+w "$path_robot_file"
    if [ ! -w "$path_robot_file" ]; then
        echo "$path_robot_file 쓰기 권한 주기 실패. 작업 중단"
        exit 1
    fi
fi

cp "$back_path_repo/infra/test/robots.txt" "$path_robot_file" && \
echo "robots.txt 복사 완료" || exit 1

# =================================================================================================
# 서버 실행
# =================================================================================================

[ ! -f "$front_path_repo/scripts/test_cold_start.sh" ] && echo "test_cold_start.sh 없음" && exit 1
bash "$front_path_repo/scripts/test_cold_start.sh"

[ ! -f "$back_path_repo/apps/api/main.js" ] && echo "backend source 없음" && exit 1
cd $back_path_repo/apps/api
run_quiet "Back api 시작" pm2 start node --name "api" -- main.js

echo "서버 설정 완료!"