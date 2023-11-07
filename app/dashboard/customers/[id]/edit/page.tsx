import { fetchCustomerById } from "@/app/lib/data";
import Form from "@/app/ui/customers/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";

import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: 'Edit Customer'
}

interface Params {
  params: {
    id: string
  }
}

export default async function Page({ params: { id } }: Params) {
  const customer = await fetchCustomerById(id)
  console.log({ customer });

  if (!customer) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customer', href: '/dashboard/customers' },
          {
            label: 'Edit Customer',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form customer={customer} />
    </main>
  )
}