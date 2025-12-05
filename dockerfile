FROM denoland/deno:latest AS builder
USER deno
WORKDIR /app
COPY . .
RUN deno cache main.ts --allow-scripts=npm:ffmpeg-static

FROM denoland/deno:latest
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "--allow-read", "--allow-env", "--allow-ffi", "--allow-net", "main.ts"]
