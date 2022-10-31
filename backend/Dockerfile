FROM golang

WORKDIR '/app'

RUN go install github.com/cespare/reflex@latest

COPY ./go.mod ./
RUN go mod download

COPY . .

RUN go build -o ./run .

CMD ["./run"]