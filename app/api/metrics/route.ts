import { NextResponse } from 'next/server';
import { trace, metrics } from '@opentelemetry/api';

export async function GET() {
  const tracer = trace.getTracer('otel-app');
  const meter = metrics.getMeter('otel-app');

  const requestCounter = meter.createCounter('api_requests_total', {
    description: 'Total number of API requests',
  });

  return tracer.startActiveSpan('metrics-endpoint', async (span) => {
    requestCounter.add(1, {
      endpoint: '/api/metrics',
      method: 'GET',
    });

    span.setAttribute('metric.name', 'api_requests_total');
    span.setAttribute('metric.value', 1);
    span.end();

    return NextResponse.json({
      status: 'ok',
      message: 'Metric recorded',
      metric: 'api_requests_total incremented',
    });
  });
}
