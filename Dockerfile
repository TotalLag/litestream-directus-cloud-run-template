# Use the alpine image to build our application.
FROM alpine as builder

# Download the static build of Litestream directly into the path & make it executable.
ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.9/litestream-v0.3.9-linux-amd64-static.tar.gz /tmp/litestream.tar.gz
RUN tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz

# Run any other builders here

# This starts our final image
FROM directus/directus

# Copy executable & Litestream from builder.
COPY --from=builder /usr/local/bin/litestream /usr/local/bin/litestream

# Notify Docker that the container wants to expose a port.
EXPOSE 8055

# Copy Litestream configuration file & startup script.
COPY etc/litestream.yml etc/snapshot.yml* /etc/
COPY scripts/run.sh /scripts/run.sh

# CMD npx directus bootstrap && npx directus start
CMD [ "/bin/sh", "/scripts/run.sh" ]
