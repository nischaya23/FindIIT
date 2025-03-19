#!/bin/bash

tmux new-session -d -s dev
tmux split-window -h
tmux send-keys -t dev:0.0 'cd client && npm run dev' C-m
tmux send-keys -t dev:0.1 'cd server && node index.js' C-m
tmux attach-session -t dev
