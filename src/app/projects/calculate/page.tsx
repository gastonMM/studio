
"use client";

import { useState, useEffect, useRef } from "react";
import type { ProjectFormData, Material, Accessory, PrinterProfile, AccessoryInProject, Project } from "@/types";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2, Loader2, CalculatorIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { calculateProjectCost } from "@/lib/calculation";

// Import server actions
import { fetchMaterials } from "@/app/materials/actions";
import { fetchAccessories } from "@/app/accessories/actions";
import { saveProjectAction } from "../actions";

const hhmmToHours = (hhmm: string): number => {
    if (!hhmm || !hhmm.includes(':')) return 0;
    const [hours, minutes] = hhmm.split(':').map(Number);
    return (hours || 0) + ((minutes || 0) / 60);
};

export const projectSchema = z.object({
  nombreProyecto: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  imageUrls: z.array(z.string()).optional(),
  materialUsadoId: z.string().min(1, "Debe seleccionar un material."),
  configuracionImpresoraIdUsada: z.string().min(1, "Debe seleccionar un perfil de impresora."),
  inputsOriginales: z.object({
    pesoPiezaGramos: z.coerce.number().positive("El peso debe ser positivo."),
    tiempoImpresionHoras: z.string().regex(/^\d{1,3}:\d{2}$/, "El formato debe ser HH:MM.").min(1, "El tiempo es obligatorio."),
    tiempoLaborOperativaHoras: z.string().regex(/^\d{1,3}:\d{2}$/, "El formato debe ser HH:MM.").optional(),
    tiempoPostProcesadoHoras: z.string().regex(/^\d{1,3}:\d{2}$/, "El formato debe ser HH:MM.").optional(),
    cantidadPiezasLote: z.coerce.number().int().positive("La cantidad debe ser al menos 1.").default(1),
    margenGananciaDeseadoPorcentaje: z.coerce.number().min(0, "El margen debe ser cero o positivo."),
  }),
  accesoriosUsadosEnProyecto: z.array(z.object({
    accesorioId: z.string().min(1, "Debe seleccionar un accesorio."),
    cantidadUsadaPorPieza: z.coerce.number().int("La cantidad debe ser un número entero.").positive("La cantidad debe ser positiva."),
  })).optional(),
});

// Mock data - replace with actual fetched data
const mockPrinterProfiles: PrinterProfile[] = [
  { id: "pp1", nombrePerfilImpresora: "Ender 3 Pro - Standard", consumoEnergeticoImpresoraWatts: 200, costoKWhElectricidad: 40, costoAdquisicionImpresora: 1200000, vidaUtilEstimadaHorasImpresora: 4000, porcentajeFallasEstimado: 5, costoHoraLaborOperativa: 2500, costoHoraLaborPostProcesado: 2000, fechaUltimaActualizacionConfig: new Date() },
];

export default function CalculateProjectPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState<Project["resultadosCalculados"] | null>(null);
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [printerProfiles, setPrinterProfiles] = useState<PrinterProfile[]>(mockPrinterProfiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [materialsData, accessoriesData] = await Promise.all([
          fetchMaterials(),
          fetchAccessories()
        ]);
        setMaterials(materialsData || []);
        setAccessories(accessoriesData || []);
      } catch (error) {
        toast({ title: "Error", description: "No se pudieron cargar los datos maestros.", variant: "destructive" });
      }
    }
    loadData();
  }, [toast]);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      nombreProyecto: "",
      imageUrls: [],
      materialUsadoId: "",
      configuracionImpresoraIdUsada: "pp1", // Default to Ender 3
      inputsOriginales: {
        pesoPiezaGramos: 0,
        tiempoImpresionHoras: "00:00",
        tiempoLaborOperativaHoras: "00:00",
        tiempoPostProcesadoHoras: "00:00",
        cantidadPiezasLote: 1,
        margenGananciaDeseadoPorcentaje: 30,
      },
      accesoriosUsadosEnProyecto: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "accesoriosUsadosEnProyecto",
  });
  
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "imageUrls"
  });

  const imageUrls = form.watch("imageUrls");
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
          toast({ title: "Error", description: `La imagen ${file.name} pesa más de 2MB.`, variant: "destructive" });
          continue;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          appendImage({ value: reader.result as string } as any); // react-hook-form uses objects
        };
        reader.readAsDataURL(file);
      }
    }
     // Reset file input to allow re-uploading the same file
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processAndCalculate = (values: z.infer<typeof projectSchema>) => {
    const processedValues = {
        ...values,
        inputsOriginales: {
            ...values.inputsOriginales,
            tiempoImpresionHoras: hhmmToHours(values.inputsOriginales.tiempoImpresionHoras),
            tiempoLaborOperativaHoras: hhmmToHours(values.inputsOriginales.tiempoLaborOperativaHoras || "00:00"),
            tiempoPostProcesadoHoras: hhmmToHours(values.inputsOriginales.tiempoPostProcesadoHoras || "00:00"),
        }
    };
    return calculateProjectCost(processedValues, materials, printerProfiles, accessories);
  };

  async function onCalculate(values: z.infer<typeof projectSchema>) {
     const results = processAndCalculate(values);
     if (results) {
        setCalculatedResults(results);
        toast({ title: "Cálculo realizado", description: "Los costos han sido estimados." });
     } else {
        toast({ title: "Error de datos", description: "Material, perfil de impresora o accesorio no encontrado.", variant: "destructive" });
     }
  }

  async function onSave(values: z.infer<typeof projectSchema>) {
    setIsSubmitting(true);
    const results = processAndCalculate(values);
    if (!results) {
        toast({ title: "Error de datos", description: "No se puede guardar, verifique que los datos sean correctos (material, perfil, accesorios).", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    const projectToSave: Omit<Project, 'id' | 'fechaCreacion' | 'fechaUltimoCalculo'> & { id?: string } = {
      ...values,
      imageUrls: values.imageUrls,
      inputsOriginales: {
        ...values.inputsOriginales,
        tiempoImpresionHoras: hhmmToHours(values.inputsOriginales.tiempoImpresionHoras),
        tiempoLaborOperativaHoras: hhmmToHours(values.inputsOriginales.tiempoLaborOperativaHoras || "00:00"),
        tiempoPostProcesadoHoras: hhmmToHours(values.inputsOriginales.tiempoPostProcesadoHoras || "00:00"),
      },
      resultadosCalculados: results,
      accesoriosUsadosEnProyecto: values.accesoriosUsadosEnProyecto?.map(acc => {
        const accDetails = accessories.find(a => a.id === acc.accesorioId);
        return {
          ...acc,
          costoUnitarioAlMomentoDelCalculo: accDetails?.costoPorUnidad || 0,
        };
      }) || [],
    };

    try {
      const response = await saveProjectAction(projectToSave);
      if (response.success) {
        toast({ title: "Proyecto Guardado", description: "El cálculo ha sido guardado correctamente en tu catálogo." });
        router.push("/projects");
        router.refresh();
      } else {
        toast({ title: "Error al guardar", description: response.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Ocurrió un error inesperado.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Form {...form}>
        <form className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna de Inputs */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Proyecto y Parámetros</CardTitle>
                  <CardDescription>Completa los detalles para calcular los costos de impresión.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nombreProyecto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Proyecto</FormLabel>
                        <FormControl><Input placeholder="Ej: Llavero personalizado" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Imágenes del Proyecto</FormLabel>
                     <Card>
                        <CardContent className="p-4 space-y-4">
                           {imageUrls && imageUrls.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {imageUrls.map((url, index) => (
                                <div key={index} className="relative aspect-square group">
                                  <Image
                                    src={url}
                                    alt={`Vista previa del proyecto ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(index)}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Eliminar imagen</span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                               <div className="flex flex-col items-center justify-center h-32 bg-muted rounded-md text-center text-muted-foreground p-4">
                                   <Upload className="mx-auto h-10 w-10 mb-2"/>
                                   <p>Sube una o más imágenes</p>
                               </div>
                           )}
                           
                            <FormControl>
                                <Input 
                                  type="file" 
                                  accept="image/png, image/jpeg, image/webp" 
                                  className="hidden" 
                                  ref={fileInputRef} 
                                  onChange={handleImageUpload}
                                  multiple
                                />
                            </FormControl>
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                                <Upload className="mr-2 h-4 w-4" />
                                Seleccionar Imágenes
                            </Button>
                            <FormDescription>Puedes subir varias imágenes para el catálogo. Límite de 2MB por imagen.</FormDescription>
                        </CardContent>
                    </Card>
                    <FormMessage />
                  </FormItem>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="materialUsadoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material Utilizado</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar material" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {materials.map(m => <SelectItem key={m.id} value={m.id}>{m.nombreMaterial}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="configuracionImpresoraIdUsada"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Perfil de Impresora</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar perfil" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {printerProfiles.map(p => <SelectItem key={p.id} value={p.id}>{p.nombrePerfilImpresora}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="inputsOriginales.pesoPiezaGramos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peso de la Pieza (gramos)</FormLabel>
                          <FormControl><Input type="number" step="0.1" placeholder="Ej: 25.5" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inputsOriginales.tiempoImpresionHoras"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiempo de Impresión (HH:MM)</FormLabel>
                          <FormControl><Input type="text" placeholder="Ej: 03:30" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="inputsOriginales.tiempoLaborOperativaHoras"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiempo Labor Operativa (HH:MM)</FormLabel>
                          <FormControl><Input type="text" placeholder="Ej: 00:15" {...field} /></FormControl>
                           <FormDescription>Supervisión, carga, etc. Opcional.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inputsOriginales.tiempoPostProcesadoHoras"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiempo Post-Procesado (HH:MM)</FormLabel>
                          <FormControl><Input type="text" placeholder="Ej: 00:30" {...field} /></FormControl>
                          <FormDescription>Limpieza, montaje. Opcional.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="inputsOriginales.cantidadPiezasLote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad de Piezas por Lote</FormLabel>
                          <FormControl><Input type="number" step="1" placeholder="Ej: 10" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accesorios Utilizados</CardTitle>
                   <Button type="button" variant="outline" size="sm" onClick={() => append({ accesorioId: "", cantidadUsadaPorPieza: 1 })}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Agregar Accesorio
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex items-end gap-2 p-3 border rounded-md">
                      <FormField
                        control={form.control}
                        name={`accesoriosUsadosEnProyecto.${index}.accesorioId`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Accesorio</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar accesorio" /></SelectTrigger></FormControl>
                                <SelectContent>
                                {accessories.map(a => <SelectItem key={a.id} value={a.id}>{a.nombreAccesorio}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`accesoriosUsadosEnProyecto.${index}.cantidadUsadaPorPieza`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantidad</FormLabel>
                            <FormControl><Input type="number" step="1" placeholder="Ej: 1" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {fields.length === 0 && <p className="text-sm text-muted-foreground">No se han agregado accesorios.</p>}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader><CardTitle>Precio de Venta</CardTitle></CardHeader>
                <CardContent>
                    <FormField
                      control={form.control}
                      name="inputsOriginales.margenGananciaDeseadoPorcentaje"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Margen de Ganancia Deseado (%)</FormLabel>
                          <FormControl><Input type="number" step="1" placeholder="Ej: 50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </CardContent>
              </Card>

            </div>

            {/* Columna de Resultados */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center"><CalculatorIcon className="mr-2 h-6 w-6 text-primary" />Resultados del Cálculo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {calculatedResults ? (
                    <>
                      <ResultRow label="Costo Material:" value={calculatedResults.costoMaterialPieza} />
                      <ResultRow label="Costo Electricidad:" value={calculatedResults.costoElectricidadPieza} />
                      <ResultRow label="Costo Amortización:" value={calculatedResults.costoAmortizacionPieza} />
                      <ResultRow label="Costo Labor Operativa:" value={calculatedResults.costoLaborOperativaPieza} />
                      <ResultRow label="Costo Labor Post-Procesado:" value={calculatedResults.costoLaborPostProcesadoPieza} />
                      <ResultRow label="Costo Total Accesorios:" value={calculatedResults.costoTotalAccesoriosPieza} />
                      <hr className="my-2"/>
                      <ResultRow label="Subtotal Costo Directo:" value={calculatedResults.subTotalCostoDirectoPieza} bold />
                      <ResultRow label="Costo Contingencia/Fallas:" value={calculatedResults.costoContingenciaFallasPieza} />
                      <hr className="my-2"/>
                      <ResultRow label="Costo Total por Pieza:" value={calculatedResults.costoTotalPieza} bold primary />
                      <ResultRow label={`Costo Total Lote (${form.getValues("inputsOriginales.cantidadPiezasLote")}u):`} value={calculatedResults.costoTotalLote} bold />
                      <hr className="my-2"/>
                      <ResultRow label="Precio Venta Sugerido (Pieza):" value={calculatedResults.precioVentaSugeridoPieza} bold accent />
                      <ResultRow label="Precio Venta Sugerido (Lote):" value={calculatedResults.precioVentaSugeridoLote} bold accent />
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Image 
                        src="https://placehold.co/300x200.png"
                        alt="Waiting for calculation" 
                        width={300}
                        height={200}
                        data-ai-hint="calculator chart"
                        className="rounded-md mb-4 inline-block opacity-50"
                      />
                      <p className="text-muted-foreground">Ingrese los datos y presione "Calcular Costos" para ver los resultados.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex-col space-y-2 items-stretch">
                  <Button type="button" onClick={form.handleSubmit(onCalculate)} className="w-full" variant="outline" size="lg">
                    Calcular Costos
                  </Button>
                  <Button type="button" onClick={form.handleSubmit(onSave)} disabled={isSubmitting || !calculatedResults} className="w-full" size="lg">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Cálculo
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface ResultRowProps {
    label: string;
    value?: number;
    bold?: boolean;
    primary?: boolean;
    accent?: boolean;
}

function ResultRow({ label, value, bold, primary, accent }: ResultRowProps) {
    const valueString = typeof value === 'number' ? value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : '-';
    let className = "flex justify-between";
    if (bold) className += " font-semibold";
    if (primary) className += " text-primary text-lg";
    if (accent) className += " text-accent text-lg";

    return (
        <div className={className}>
            <span>{label}</span>
            <span>{valueString}</span>
        </div>
    );
}
