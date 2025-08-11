import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

// NOTA: El plugin de Firebase se utiliza para la telemetría y el tracing de
// los flujos de Genkit (IA). NO se utiliza para la base de datos principal de
// la aplicación (proyectos, materiales, etc.), que se gestiona a través de
// los servicios en /src/services.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  enableTracingAndMetrics: true,
});

enableFirebaseTelemetry();
