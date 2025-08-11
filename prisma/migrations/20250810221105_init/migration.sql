-- CreateTable
CREATE TABLE "public"."Material" (
    "id" TEXT NOT NULL,
    "nombreMaterial" TEXT NOT NULL,
    "costoPorKg" DOUBLE PRECISION NOT NULL,
    "pesoSpoolCompradoGramos" INTEGER NOT NULL DEFAULT 1000,
    "urlProducto" TEXT,
    "selectorPrecioCSS" TEXT,
    "densidad" DOUBLE PRECISION,
    "diametro" DOUBLE PRECISION,
    "notasAdicionales" TEXT,
    "fechaUltimaActualizacionCosto" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Accessory" (
    "id" TEXT NOT NULL,
    "nombreAccesorio" TEXT NOT NULL,
    "precioPaqueteObtenido" DOUBLE PRECISION NOT NULL,
    "unidadesPorPaqueteEnLink" INTEGER NOT NULL,
    "costoPorUnidad" DOUBLE PRECISION NOT NULL,
    "urlProducto" TEXT,
    "notasAdicionales" TEXT,
    "fechaUltimaActualizacionCosto" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ElectricityProfile" (
    "id" TEXT NOT NULL,
    "nombrePerfil" TEXT NOT NULL,
    "consumoMensualKWh" DOUBLE PRECISION NOT NULL,
    "costoTotalFactura" DOUBLE PRECISION NOT NULL,
    "costoPorKWh" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ElectricityProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PrinterProfile" (
    "id" TEXT NOT NULL,
    "nombrePerfilImpresora" TEXT NOT NULL,
    "modeloImpresora" TEXT,
    "consumoEnergeticoImpresoraWatts" INTEGER,
    "costoAdquisicionImpresora" DOUBLE PRECISION,
    "vidaUtilEstimadaHorasImpresora" INTEGER,
    "porcentajeFallasEstimado" DOUBLE PRECISION,
    "costoHoraLaborOperativa" DOUBLE PRECISION,
    "costoHoraLaborPostProcesado" DOUBLE PRECISION,
    "fechaUltimaActualizacionConfig" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "electricityProfileId" TEXT NOT NULL,

    CONSTRAINT "PrinterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SalesProfile" (
    "id" TEXT NOT NULL,
    "nombrePerfil" TEXT NOT NULL,
    "margenGananciaDirecta" DOUBLE PRECISION NOT NULL,
    "comisionMercadoLibre" DOUBLE PRECISION NOT NULL,
    "costoFijoMercadoLibre" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SalesProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "nombreProyecto" TEXT NOT NULL,
    "descripcionProyecto" TEXT,
    "imageUrls" JSONB[],
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaUltimoCalculo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "materialUsadoId" TEXT NOT NULL,
    "configuracionImpresoraIdUsada" TEXT NOT NULL,
    "perfilVentaIdUsado" TEXT NOT NULL,
    "inputsOriginales" JSONB NOT NULL,
    "resultadosCalculados" JSONB,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccessoryInProject" (
    "id" TEXT NOT NULL,
    "cantidadUsadaPorPieza" INTEGER NOT NULL,
    "costoUnitarioAlMomentoDelCalculo" DOUBLE PRECISION,
    "projectId" TEXT NOT NULL,
    "accesorioId" TEXT NOT NULL,

    CONSTRAINT "AccessoryInProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ProjectTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_nombreMaterial_key" ON "public"."Material"("nombreMaterial");

-- CreateIndex
CREATE UNIQUE INDEX "Accessory_nombreAccesorio_key" ON "public"."Accessory"("nombreAccesorio");

-- CreateIndex
CREATE UNIQUE INDEX "ElectricityProfile_nombrePerfil_key" ON "public"."ElectricityProfile"("nombrePerfil");

-- CreateIndex
CREATE UNIQUE INDEX "PrinterProfile_nombrePerfilImpresora_key" ON "public"."PrinterProfile"("nombrePerfilImpresora");

-- CreateIndex
CREATE UNIQUE INDEX "SalesProfile_nombrePerfil_key" ON "public"."SalesProfile"("nombrePerfil");

-- CreateIndex
CREATE UNIQUE INDEX "AccessoryInProject_projectId_accesorioId_key" ON "public"."AccessoryInProject"("projectId", "accesorioId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE INDEX "_ProjectTags_B_index" ON "public"."_ProjectTags"("B");

-- AddForeignKey
ALTER TABLE "public"."PrinterProfile" ADD CONSTRAINT "PrinterProfile_electricityProfileId_fkey" FOREIGN KEY ("electricityProfileId") REFERENCES "public"."ElectricityProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_materialUsadoId_fkey" FOREIGN KEY ("materialUsadoId") REFERENCES "public"."Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_configuracionImpresoraIdUsada_fkey" FOREIGN KEY ("configuracionImpresoraIdUsada") REFERENCES "public"."PrinterProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_perfilVentaIdUsado_fkey" FOREIGN KEY ("perfilVentaIdUsado") REFERENCES "public"."SalesProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessoryInProject" ADD CONSTRAINT "AccessoryInProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessoryInProject" ADD CONSTRAINT "AccessoryInProject_accesorioId_fkey" FOREIGN KEY ("accesorioId") REFERENCES "public"."Accessory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProjectTags" ADD CONSTRAINT "_ProjectTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProjectTags" ADD CONSTRAINT "_ProjectTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
