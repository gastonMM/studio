'use server';
/**
 * @fileOverview Flujo de IA para generar detalles de un proyecto de impresión 3D.
 *
 * - generateProjectDetails - Genera un título, descripción y etiquetas a partir de imágenes y un título opcional.
 * - GenerateProjectDetailsInput - El tipo de entrada para la función.
 * - GenerateProjectDetailsOutput - El tipo de retorno de la función.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProjectDetailsInputSchema = z.object({
  title: z.string().optional().describe('El título actual o una idea inicial para el proyecto.'),
  images: z.array(z.string()).describe(
    "Un array de imágenes del proyecto, como data URIs en formato 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type GenerateProjectDetailsInput = z.infer<typeof GenerateProjectDetailsInputSchema>;

const GenerateProjectDetailsOutputSchema = z.object({
  title: z.string().describe('Un título creativo y descriptivo para el proyecto de impresión 3D.'),
  description: z.string().describe('Una descripción detallada y atractiva del producto para usar en un catálogo.'),
  tags: z.array(z.string()).describe('Una lista de 3 a 5 etiquetas (tags) relevantes para categorizar el producto.'),
});
export type GenerateProjectDetailsOutput = z.infer<typeof GenerateProjectDetailsOutputSchema>;


const prompt = ai.definePrompt({
  name: 'generateProjectDetailsPrompt',
  input: { schema: GenerateProjectDetailsInputSchema },
  output: { schema: GenerateProjectDetailsOutputSchema },
  prompt: `Eres un experto en marketing de productos de impresión 3D. Tu tarea es generar un título, una descripción y etiquetas para un nuevo producto basado en las imágenes proporcionadas y un título inicial.

Instrucciones:
1.  **Analiza las imágenes**: Observa cuidadosamente las imágenes para entender qué es el producto, su propósito y sus características principales.
2.  **Título**: Si se proporciona un título inicial, mejóralo para que sea más atractivo y descriptivo. Si no se proporciona, crea uno desde cero que sea pegadizo y claro.
3.  **Descripción**: Escribe una descripción de producto convincente. Destaca los detalles, posibles usos, materiales y cualquier característica especial visible en las imágenes. Debe ser útil para un catálogo de venta.
4.  **Etiquetas**: Genera entre 3 y 5 etiquetas (tags) que ayuden a clasificar el producto. Piensa en categorías, temas, y posibles búsquedas de clientes (ej: "Llavero", "Decoración", "Accesorio", "Utilidad", "Regalo").

Título inicial (si existe): {{{title}}}

Imágenes del producto:
{{#each images}}
- {{media url=this}}
{{/each}}
`,
});

const generateProjectDetailsFlow = ai.defineFlow(
  {
    name: 'generateProjectDetailsFlow',
    inputSchema: GenerateProjectDetailsInputSchema,
    outputSchema: GenerateProjectDetailsOutputSchema,
  },
  async (input) => {
    if (input.images.length === 0) {
      throw new Error("Se requiere al menos una imagen para generar los detalles.");
    }
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateProjectDetails(input: GenerateProjectDetailsInput): Promise<GenerateProjectDetailsOutput> {
  return generateProjectDetailsFlow(input);
}
