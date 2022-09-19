import {Resource} from '@opentelemetry/resources';
import {SemanticResourceAttributes} from '@opentelemetry/semantic-conventions';
import {HttpInstrumentation} from "@opentelemetry/instrumentation-http";
import {ExpressInstrumentation} from "opentelemetry-instrumentation-express/dist/src";
import {getNodeAutoInstrumentations} from '@opentelemetry/auto-instrumentations-node'
import {JaegerExporter} from '@opentelemetry/exporter-jaeger';
import {PgInstrumentation} from '@opentelemetry/instrumentation-pg';
import {NodeTracerProvider} from "@opentelemetry/sdk-trace-node";
import {SimpleSpanProcessor} from '@opentelemetry/tracing'
import {registerInstrumentations} from '@opentelemetry/instrumentation';
import {trace} from '@opentelemetry/api';
import {SpanProcessor} from "@opentelemetry/sdk-trace-base";

const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

(async ()  => {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

    const jaegerExporter = new JaegerExporter({
        endpoint: `http://host.docker.internal:14268/api/traces`,
    });

    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: 'stockly',
            [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'testing',
        }),
    })

    trace.setGlobalTracerProvider(provider);

    provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter) as unknown as SpanProcessor)
    provider.register();


    registerInstrumentations({
        instrumentations: [
            getNodeAutoInstrumentations(),
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
            new PgInstrumentation(),
        ],
        tracerProvider: provider
    })


    // gracefully shut down the SDK on process exit
    process.on('SIGTERM', () => {
        provider.shutdown()
            .then(() => console.log('Tracing terminated'))
            .catch((error) => console.log('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });
})();
