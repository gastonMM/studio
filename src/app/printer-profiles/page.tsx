import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Printer } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PrinterProfilesPage() {
  // Default Creality Ender 3 Pro values
  const defaultProfile = {
    nombrePerfilImpresora: "Creality Ender 3 Pro (Default)",
    modeloImpresora: "Creality Ender 3 Pro",
    consumoEnergeticoImpresoraWatts: 200,
    costoKWhElectricidad: 40, // ARS/kWh
    costoAdquisicionImpresora: 1200000, // ARS
    vidaUtilEstimadaHorasImpresora: 4000, // horas
    tasaAmortizacionImpresoraPorHoraUso: (1200000 / 4000).toFixed(2), // ARS/hora
    porcentajeFallasEstimado: 5, // %
    costoHoraLaborOperativa: 2500, // ARS
    costoHoraLaborPostProcesado: 2000, // ARS
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Perfiles de Impresora</h1>
        <Button asChild disabled>
          <Link href="/printer-profiles/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nuevo Perfil (Próximamente)
          </Link>
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Printer className="mr-2 h-6 w-6 text-primary" />
            Perfil por Defecto: {defaultProfile.nombrePerfilImpresora}
          </CardTitle>
          <CardDescription>
            Configuración base para una {defaultProfile.modeloImpresora}. Puedes crear nuevos perfiles o editar este en el futuro.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Image 
                src="https://picsum.photos/seed/diagram/600/350" 
                alt="3D printer settings" 
                width={600}
                height={350}
                data-ai-hint="3D printer diagram"
                className="rounded-md mb-6 mx-auto w-full h-auto"
            />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Modelo:</span> {defaultProfile.modeloImpresora}</div>
            <div><span className="font-semibold">Consumo:</span> {defaultProfile.consumoEnergeticoImpresoraWatts}W</div>
            <div><span className="font-semibold">Costo Electricidad:</span> ${defaultProfile.costoKWhElectricidad}/kWh</div>
            <div><span className="font-semibold">Costo Adquisición:</span> ${defaultProfile.costoAdquisicionImpresora.toLocaleString('es-AR')}</div>
            <div><span className="font-semibold">Vida Útil:</span> {defaultProfile.vidaUtilEstimadaHorasImpresora} horas</div>
            <div><span className="font-semibold">Tasa Amortización:</span> ${defaultProfile.tasaAmortizacionImpresoraPorHoraUso}/hora</div>
            <div><span className="font-semibold">Tasa Fallas:</span> {defaultProfile.porcentajeFallasEstimado}%</div>
            <div><span className="font-semibold">Costo Labor Operativa:</span> ${defaultProfile.costoHoraLaborOperativa}/hora</div>
            <div><span className="font-semibold">Costo Labor Post-Procesado:</span> ${defaultProfile.costoHoraLaborPostProcesado}/hora</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Módulo de Perfiles de Impresora</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <h2 className="text-2xl font-semibold text-muted-foreground">Próximamente</h2>
          <p className="mt-2 text-muted-foreground">
            La funcionalidad completa para la gestión de perfiles de impresora estará disponible pronto.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
