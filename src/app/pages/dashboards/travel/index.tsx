import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import { campaigns, experiences, leads } from "@/app/data/tourism";
import { Page } from "@/components/shared/Page";
import { Badge, Button, Card } from "@/components/ui";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const overview = [
  {
    label: "Ingresos estimados",
    value: "$18,420",
    change: "+18%",
    icon: BanknotesIcon,
  },
  {
    label: "Leads del mes",
    value: "126",
    change: "+31%",
    icon: UserGroupIcon,
  },
  {
    label: "Tours publicados",
    value: "24",
    change: "4 en revision",
    icon: CalendarDaysIcon,
  },
  {
    label: "Campanas activas",
    value: "3",
    change: "79 leads",
    icon: MegaphoneIcon,
  },
];

const funnel = [
  { label: "Vistas", value: "8,716", width: "100%" },
  { label: "Detalles abiertos", value: "2,943", width: "74%" },
  { label: "Favoritos", value: "827", width: "48%" },
  { label: "Solicitudes", value: "126", width: "28%" },
];

const statusColors = {
  Published: "success",
  Draft: "neutral",
  Review: "warning",
} as const;

export default function TravelDashboard() {
  const totalCampaignBudget = campaigns.reduce(
    (total, campaign) => total + campaign.budget,
    0,
  );

  return (
    <Page title="Dashboard empresas turisticas">
      <div className="transition-content px-(--margin-x) pb-8 pt-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
              Panel empresarial
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-dark-50">
              Aventura Verde CR
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-gray-500 dark:text-dark-300">
              Gestion comercial para tours, leads, promociones, reputacion y
              rendimiento dentro del marketplace Costa Rica Experiences.
            </p>
          </div>
          <div className="flex gap-2">
            <Button color="primary">Nuevo tour</Button>
            <Button variant="outlined">Crear campana</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overview.map((item) => (
            <Card key={item.label} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-dark-300">
                    {item.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900 dark:text-dark-50">
                    {item.value}
                  </p>
                  <p className="mt-2 text-xs font-medium text-primary-600 dark:text-primary-400">
                    {item.change}
                  </p>
                </div>
                <div className="rounded-lg bg-primary-50 p-3 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                  <item.icon className="size-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-12 gap-4 lg:gap-6">
          <Card className="col-span-12 p-5 xl:col-span-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-dark-50">
                  Tours y experiencias
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Publicacion, posicionamiento y demanda por experiencia.
                </p>
              </div>
              <Button variant="flat">Exportar CSV</Button>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase text-gray-400 dark:border-dark-600">
                    <th className="pb-3 font-medium">Experiencia</th>
                    <th className="pb-3 font-medium">Provincia</th>
                    <th className="pb-3 font-medium">Precio</th>
                    <th className="pb-3 font-medium">Leads</th>
                    <th className="pb-3 font-medium">Rating</th>
                    <th className="pb-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((experience) => (
                    <tr
                      key={experience.id}
                      className="border-b border-gray-100 last:border-0 dark:border-dark-700"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={experience.image}
                            alt=""
                            className="size-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-dark-50">
                              {experience.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-dark-300">
                              {experience.category} - {experience.duration}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">{experience.province}</td>
                      <td className="py-4">{money.format(experience.price)}</td>
                      <td className="py-4">{experience.leads}</td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1">
                          <StarIcon className="size-4 text-amber-400" />
                          {experience.rating}
                        </span>
                      </td>
                      <td className="py-4">
                        <Badge color={statusColors[experience.status]}>
                          {experience.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="col-span-12 grid gap-4 xl:col-span-4">
            <Card className="p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-dark-50">
                Embudo comercial
              </h2>
              <div className="mt-5 space-y-4">
                {funnel.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-dark-700">
                      <div
                        className="h-2 rounded-full bg-primary-500"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-gray-900 dark:text-dark-50">
                  Reputacion
                </h2>
                <Badge color="success">4.8 promedio</Badge>
              </div>
              <div className="mt-5 space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-dark-700/60">
                  <p className="text-sm text-gray-600 dark:text-dark-200">
                    "Excelente guia y comunicacion. El tour fue puntual y muy
                    seguro."
                  </p>
                  <p className="mt-3 text-xs font-medium text-gray-400">
                    Rafting en el rio Pacuare
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ArrowTrendingUpIcon className="size-5 text-primary-500" />
                  <span>Responder resenas mejora el posicionamiento.</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-4 lg:gap-6">
          <Card className="col-span-12 p-5 lg:col-span-7">
            <h2 className="text-base font-semibold text-gray-900 dark:text-dark-50">
              Leads y solicitudes recientes
            </h2>
            <div className="mt-4 space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-dark-600 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-dark-50">
                      {lead.client}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                      {lead.experience} - {lead.channel}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {money.format(lead.value)}
                    </span>
                    <Badge color={lead.status === "Confirmed" ? "success" : "info"}>
                      {lead.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="col-span-12 p-5 lg:col-span-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-dark-50">
                  Campanas y visibilidad
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-300">
                  Presupuesto activo: {money.format(totalCampaignBudget)}
                </p>
              </div>
              <MegaphoneIcon className="size-6 text-primary-500" />
            </div>
            <div className="mt-5 space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-dark-50">
                        {campaign.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-dark-300">
                        {campaign.placement}
                      </p>
                    </div>
                    <Badge color={campaign.status === "Active" ? "success" : "warning"}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <span>{campaign.clicks} clicks</span>
                    <span>{campaign.leads} leads</span>
                    <span>{money.format(campaign.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
