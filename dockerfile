FROM denoland/deno:2.6.7 AS builder
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \    
  apt-get install -y \
  nodejs \
  node-gyp \
  python3 \
  libtool \
  make && \ 
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
RUN deno cache main.ts --allow-scripts=npm:zlib-sync,npm:bufferutil,npm:sodium,npm:ffmpeg-static

FROM denoland/deno:2.6.7
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \    
  apt-get install -y \
  ca-certificates && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
USER deno
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "--allow-read", "--allow-env", "--allow-ffi", "--allow-net", "--allow-run", "--allow-write", "--unstable-kv", "--unstable-cron", "main.ts"]
