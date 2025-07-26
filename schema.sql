-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "nombreMaterial" TEXT NOT NULL,
    "costoPorKg" DOUBLE PRECISION NOT NULL,
    "pesoSpoolCompradoGramos" INTEGER NOT NULL DEFAULT 1000,
    "urlProducto" TEXT,
    "selectorPrecioCSS" TEXT,
    "densidad" DOUBLE PRECISION,
    "diametro" DOUBLE PRECISION,
    "fechaUltimaActualizacionCosto" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notasAdicionales" TEXT,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accessory" (
    "id" TEXT NOT NULL,
    "nombreAccesorio" TEXT NOT NULL,
    "costoPorUnidad" DOUBLE PRECISION NOT NULL,
    "urlProducto" TEXT,
    "unidadesPorPaqueteEnLink" INTEGER NOT NULL DEFAULT 1,
    "precioPaqueteObtenido" DOUBLE PRECISION NOT NULL,
    "selectorPrecioCSS" TEXT,
    "fechaUltimaActualizacionCosto" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notasAdicionales" TEXT,

    CONSTRAINT "Accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityProfile" (
    "id" TEXT NOT NULL,
    "nombrePerfil" TEXT NOT NULL,
    "consumoMensualKWh" DOUBLE PRECISION NOT NULL,
    "costoTotalFactura" DOUBLE PRECISION NOT NULL,
    "costoPorKWh" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ElectricityProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrinterProfile" (
    "id" TEXT NOT NULL,
    "nombrePerfilImpresora" TEXT NOT NULL,
    "modeloImpresora" TEXT,
    "consumoEnergeticoImpresoraWatts" INTEGER,
    "electricityProfileId" TEXT NOT NULL,
    "costoAdquisicionImpresora" DOUBLE PRECISION,
    "vidaUtilEstimadaHorasImpresora" INTEGER,
    "tasaAmortizacionImpresoraPorHoraUso" DOUBLE PRECISION,
    "porcentajeFallasEstimado" DOUBLE PRECISION,
    "costoHoraLaborOperativa" DOUBLE PRECISION,
    "costoHoraLaborPostProcesado" DOUBLE PRECISION,
    "fechaUltimaActualizacionConfig" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrinterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesProfile" (
    "id" TEXT NOT NULL,
    "nombrePerfil" TEXT NOT NULL,
    "margenGananciaDirecta" DOUBLE PRECISION NOT NULL,
    "comisionMercadoLibre" DOUBLE PRECISION NOT NULL,
    "costoFijoMercadoLibre" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SalesProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "nombreProyecto" TEXT NOT NULL,
    "descripcionProyecto" TEXT,
    "imageUrls" JSONB NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaUltimoCalculo" TIMESTAMP(3) NOT NULL,
    "materialUsadoId" TEXT NOT NULL,
    "configuracionImpresoraIdUsada" TEXT NOT NULL,
    "perfilVentaIdUsado" TEXT NOT NULL,
    "inputsOriginales" JSONB NOT NULL,
    "resultadosCalculados" JSONB,
    "notasProyecto" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessoryInProject" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "accesorioId" TEXT NOT NULL,
    "cantidadUsadaPorPieza" INTEGER NOT NULL,
    "costoUnitarioAlMomentoDelCalculo" DOUBLE PRECISION,

    CONSTRAINT "AccessoryInProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AccessoryInProject_projectId_accesorioId_key" ON "AccessoryInProject"("projectId", "accesorioId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectTags_AB_unique" ON "_ProjectTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectTags_B_index" ON "_ProjectTags"("B");

-- AddForeignKey
ALTER TABLE "PrinterProfile" ADD CONSTRAINT "PrinterProfile_electricityProfileId_fkey" FOREIGN KEY ("electricityProfileId") REFERENCES "ElectricityProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_materialUsadoId_fkey" FOREIGN KEY ("materialUsadoId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_configuracionImpresoraIdUsada_fkey" FOREIGN KEY ("configuracionImpresoraIdUsada") REFERENCES "PrinterProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_perfilVentaIdUsado_fkey" FOREIGN KEY ("perfilVentaIdUsado") REFERENCES "SalesProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessoryInProject" ADD CONSTRAINT "AccessoryInProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessoryInProject" ADD CONSTRAINT "AccessoryInProject_accesorioId_fkey" FOREIGN KEY ("accesorioId") REFERENCES "Accessory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTags" ADD CONSTRAINT "_ProjectTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTags" ADD CONSTRAINT "_ProjectTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
