import {
  CheckCircleIcon,
  ClockIcon,
  PhotoIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { categories, experiences, provinces } from "@/app/data/tourism";
import { Page } from "@/components/shared/Page";
import { Badge, Button, Card } from "@/components/ui";

const publicationTasks = [
  "Agregar al menos 5 fotos reales",
  "Definir cupos por horario",
  "Completar politica de cancelacion",
  "Activar contacto por WhatsApp",
];

export default function TravelOperations() {
  return (
    <Page title="Gestion de experiencias">
      <div className="transition-content px-(--margin-x) pb-8 pt-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
              Operacion de marca
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-dark-50">
              Experiencias, disponibilidad y contenido
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-gray-500 dark:text-dark-300">
              Espacio para crear tours, preparar publicaciones, administrar
              categorias, precios, horarios y material visual del feed.
            </p>
          </div>
          <Button color="primary" className="gap-2">
            <PlusIcon className="size-4" />
            Crear experiencia
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-4 lg:gap-6">
          <Card className="col-span-12 p-5 xl:col-span-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-dark-50">
                  Catalogo de la empresa
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Publicaciones listas para el marketplace y feed mobile.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Todas", "Publicadas", "Revision", "Borrador"].map((item) => (
                  <button
                    key={item}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-dark-600 dark:text-dark-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {experiences.map((experience) => (
                <article
                  key={experience.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-dark-600 dark:bg-dark-800"
                >
                  <div className="relative">
                    <img
                      src={experience.image}
                      alt=""
                      className="h-48 w-full object-cover"
                    />
                    {experience.promoted && (
                      <Badge
                        color="primary"
                        className="absolute left-3 top-3"
                      >
                        Promocionado
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-dark-50">
                          {experience.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                          {experience.province} - {experience.zone}
                        </p>
                      </div>
                      <Badge
                        color={
                          experience.status === "Published"
                            ? "success"
                            : "warning"
                        }
                        variant="soft"
                      >
                        {experience.status}
                      </Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">Precio</p>
                        <p className="font-semibold">${experience.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Cupos</p>
                        <p className="font-semibold">12</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Leads</p>
                        <p className="font-semibold">{experience.leads}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {experience.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-dark-700 dark:text-dark-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Card>

          <div className="col-span-12 grid gap-4 xl:col-span-4">
            <Card className="p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-dark-50">
                Crear tour rapido
              </h2>
              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium">Nombre</span>
                  <input
                    className="form-input mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-dark-500 dark:bg-dark-700"
                    placeholder="Ej. Tour de cataratas"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-medium">Provincia</span>
                    <select className="form-select mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-dark-500 dark:bg-dark-700">
                      {provinces.map((province) => (
                        <option key={province}>{province}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Categoria</span>
                    <select className="form-select mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-dark-500 dark:bg-dark-700">
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-medium">Precio desde</span>
                    <input
                      className="form-input mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-dark-500 dark:bg-dark-700"
                      placeholder="$"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Duracion</span>
                    <input
                      className="form-input mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-dark-500 dark:bg-dark-700"
                      placeholder="4 horas"
                    />
                  </label>
                </div>
                <Button color="primary" className="w-full">
                  Guardar borrador
                </Button>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-dark-50">
                Checklist de publicacion
              </h2>
              <div className="mt-5 space-y-3">
                {publicationTasks.map((task, index) => (
                  <div key={task} className="flex items-center gap-3 text-sm">
                    {index < 2 ? (
                      <CheckCircleIcon className="size-5 text-success" />
                    ) : (
                      <ClockIcon className="size-5 text-warning" />
                    )}
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-50 p-3 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                  <PhotoIcon className="size-6" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-dark-50">
                    Centro de contenido
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-dark-300">
                    43 fotos, 8 videos cortos y 5 banners listos.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}
