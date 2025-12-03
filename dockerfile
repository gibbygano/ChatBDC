FROM denoland/deno:latest AS builder
WORKDIR /app
COPY . .
RUN deno cache main.ts --allow-scripts=npm:ffmpeg-static

FROM denoland/deno:latest
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "--allow-all", "main.ts"]