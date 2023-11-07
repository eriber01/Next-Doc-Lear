import { fetchInvoicesPages } from "@/app/lib/data"
import { lusitana } from "@/app/ui/fonts"
import Search from "@/app/ui/search"
import { InvoicesTableSkeleton } from "@/app/ui/skeletons"
import { Metadata } from "next"
import { Suspense } from "react"
import Table from '@/app/ui/customers/table';
import Pagination from "@/app/ui/invoices/pagination"
import { CreateCustomer } from "@/app/ui/customers/buttons"

export const metadata: Metadata = {
  title: 'Customers'
}

interface Props {
  searchParams?: {
    query?: string
    page?: string
  }
}

export default async function Page({ searchParams }: Props) {

  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1
  console.log(query);

  const totalPage = await fetchInvoicesPages(query)

  return (
    <div className="w-full">
      <div className="mt-4 items-center justify-between gap-2 md:mt-8">
        {/* Aqui boton crear customer */}
        <div>
          <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
            Customers
          </h1>
          <Search placeholder="Search customers..." />
        </div>
        <div className="mt-2">
          <CreateCustomer />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
      </div>
    </div>
  )
}