import { NextResponse } from 'next/server';
import { trace } from '@opentelemetry/api';

export async function GET() {
  const tracer = trace.getTracer('otel-app');

  return tracer.startActiveSpan('logs-endpoint', async (span) => {
    span.setAttribute('log.level', 'info');
    span.setAttribute('log.message', 'Log endpoint hit');
    span.setAttribute('service.name', 'otel-app');
    span.setAttribute('timestamp', new Date().toISOString());
    span.addEvent('log', {
      level: 'info',
      message: 'Log endpoint hit',
      timestamp: new Date().toISOString(),
    });
    span.end();

    return NextResponse.json({
      status: 'ok',
      message: 'Log written',
      timestamp: new Date().toISOString(),
    });
  });
}
