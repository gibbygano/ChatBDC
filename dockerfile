FROM denoland/deno:latest AS builder
RUN apt update && apt install ffmpeg -y
WORKDIR /app
COPY . .
RUN deno cache main.ts --allow-scripts=npm:zlib-sync,npm:bufferutil

FROM denoland/deno:latest
USER deno
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "--allow-read", "--allow-env", "--allow-ffi", "--allow-net", "--allow-run", "--allow-write", "main.ts"]
