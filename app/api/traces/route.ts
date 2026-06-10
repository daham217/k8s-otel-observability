import { NextResponse } from 'next/server';
import { trace } from '@opentelemetry/api';

export async function GET() {
  const tracer = trace.getTracer('otel-app');

  return tracer.startActiveSpan('traces-endpoint', async (parentSpan) => {
    parentSpan.setAttribute('http.method', 'GET');
    parentSpan.setAttribute('http.route', '/api/traces');

    await tracer.startActiveSpan('db-query-simulation', async (childSpan) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      childSpan.setAttribute('db.system', 'postgresql');
      childSpan.setAttribute('db.statement', 'SELECT * FROM tasks');
      childSpan.end();
    });

    await tracer.startActiveSpan('external-api-simulation', async (childSpan) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      childSpan.setAttribute('http.url', 'https://external-api.example.com');
      childSpan.end();
    });

    parentSpan.end();

    return NextResponse.json({
      status: 'ok',
      message: 'Trace recorded',
      spans: ['db-query-simulation', 'external-api-simulation'],
    });
  });
}
