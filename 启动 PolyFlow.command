#!/bin/bash
# PolyFlow 一键启动：双击本文件 → 启动本地服务 → 自动打开浏览器
# 关闭这个终端窗口即可停止服务。

cd "$(dirname "$0")" || exit 1
PORT=4173
URL="http://127.0.0.1:$PORT"

# 如果服务已经在运行，直接打开浏览器
if curl -s -m 1 "$URL/healthz" | grep -q PolyFlow; then
  echo "PolyFlow 已经在运行，直接打开 $URL"
  open "$URL"
  exit 0
fi

# 优先使用项目自带的 Node（.runtime 目录），否则用系统安装的 Node
NODE_BIN=""
for candidate in "./.runtime/node/bin/node" "$(command -v node 2>/dev/null)" "/opt/homebrew/bin/node" "/usr/local/bin/node"; do
  if [ -n "$candidate" ] && [ -x "$candidate" ] && "$candidate" -v >/dev/null 2>&1; then
    NODE_BIN="$candidate"
    break
  fi
done

if [ -z "$NODE_BIN" ]; then
  echo "没有找到可用的 Node.js（需要 20 以上）。"
  echo "请先安装 Node.js：https://nodejs.org/zh-cn"
  open "https://nodejs.org/zh-cn" 2>/dev/null
  read -r -p "按回车键关闭窗口..." _
  exit 1
fi

echo "使用 Node：$NODE_BIN ($("$NODE_BIN" -v))"
echo "正在启动 PolyFlow ..."
"$NODE_BIN" server.mjs &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null' EXIT INT TERM HUP

ready=""
i=0
while [ $i -lt 60 ]; do
  sleep 0.25
  i=$((i + 1))
  if curl -s -m 1 "$URL/healthz" | grep -q PolyFlow; then
    ready=1
    break
  fi
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    break
  fi
done

if [ -n "$ready" ]; then
  open "$URL"
  echo ""
  echo "PolyFlow 已启动：$URL"
  echo "关闭这个终端窗口即可停止服务。"
else
  echo ""
  echo "启动失败——请查看上面的日志信息。"
fi

wait "$SERVER_PID"
