FROM denoland/deno:latest AS builder
WORKDIR /app
COPY . .
RUN deno cache main.ts --allow-scripts=npm:ffmpeg-static 

FROM denoland/deno:latest
USER deno
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "--allow-read", "--allow-env", "--allow-ffi", "--allow-net", "--allow-run", "--allow-write", "main.ts"]
