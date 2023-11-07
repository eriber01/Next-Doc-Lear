import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/invoices/edit-form";
import { notFound } from "next/navigation";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Edit Invoices'
}

interface Params {
  params: {
    id: string
  }
}

export default async function Page({ params: { id } }: Params) {

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers()
  ])

  if (!invoice) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice!} customers={customers} />
    </main>
  )
}