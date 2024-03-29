#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

Cur_Dir=$(pwd)
echo $Cur_Dir

# 进入生成的文件夹
cd docs/.vuepress/dist

Cur_Dir=$(pwd)
echo $Cur_Dir

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git config --global user.email 15035806407@163.com
git config --global user.name chaijinsong
git config --global user.password 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

git add .
git commit -m 'deploy'

git remote add origin https://github.com/chaijinsong/chaijinsong.github.io.git

# 如果发布到 https://<USERNAME>.github.io
git push --set-upstream origin master
# git push -f https://github.com/chaijinsong/chaijinsong.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -