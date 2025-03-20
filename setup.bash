#!/bin/bash

tmux new-session -d -s dev
tmux split-window -h
tmux split-window -v -t dev:0.1

tmux send-keys -t dev:0.0 'cd client && npm install' C-m
tmux send-keys -t dev:0.1 'cd server && npm install' C-m
tmux send-keys -t dev:0.2 'wait-for-install() { while pgrep -f "npm install" > /dev/null; do sleep 1; done; }; wait-for-install && tmux kill-session -t dev' C-m

tmux attach-session -t dev
