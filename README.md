# k8s-otel-observability

A Next.js application instrumented with OpenTelemetry and deployed on Minikube. The AWS Distro for OpenTelemetry (ADOT) collector runs as a sidecar container routing telemetry to AWS observability services.

## Architecture

Browser → [otel-app-service :30300] → Pod
                                        ├── Next.js App (:3000)
                                        └── ADOT Collector (:4318)
                                                ├── Traces ──► AWS X-Ray
                                                ├── Logs ────► X-Ray trace metadata
                                                └── Metrics ─► CloudWatch Metrics

## Stack

- App — Next.js 16 + TypeScript
- Instrumentation — @vercel/otel, @opentelemetry/sdk-node
- Collector — AWS Distro for OpenTelemetry (ADOT) sidecar
- Tracing — AWS X-Ray
- Metrics — AWS CloudWatch (EMF)
- Orchestration — Kubernetes (Minikube)

## API Routes

| Route | Purpose | AWS Destination |
|---|---|---|
| /api/logs | Emits log via span event | X-Ray trace metadata |
| /api/traces | Creates parent + child spans | X-Ray trace map |
| /api/metrics | Increments custom counter | CloudWatch Metrics |

## Project Structure

app/api/
├── logs/route.ts
├── traces/route.ts
└── metrics/route.ts
instrumentation.ts
next.config.ts
Dockerfile
k8s/
├── namespace.yaml
├── configmap.yaml
├── deployment.yaml
└── service.yaml

## Running Locally

minikube start
eval $(minikube docker-env)
docker build -t otel-app:latest .
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
minikube service otel-app-service -n otel-app

Hit /api/logs, /api/traces, /api/metrics and check AWS Console for telemetry.
