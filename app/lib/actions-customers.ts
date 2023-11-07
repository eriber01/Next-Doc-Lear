'use server'

import { z } from "zod"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";

export type State = {
  message?: string | null
  errors?: {
    name?: string[]
    email?: string[]
  }
}

const CustomerSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter the name.'
  }).trim().min(1, { message: 'Please enter the name.' }),
  email: z.string({
    invalid_type_error: 'Please enter the email'
  })
    .email(),
  image_url: z.string()
})


const CreateCustomer = CustomerSchema.omit({ id: true, image_url: true })

export async function createCustomer(prevState: State, formData: FormData) {
  console.log({
    name: formData.get('name'),
    email: formData.get('email')
  });

  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.'
    }
  }

  const { email, name } = validatedFields.data

  try {

    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, '')
    `

  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Customer.',
    };
  }

  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
}

const UpdateCustomer = CustomerSchema.omit({ id: true, image_url: true })
export async function updateCustomer(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.'
    }
  }

  const { email, name } = validatedFields.data
  console.log({ email, name });

  try {
    await sql`
      UPDATE customers
      SET name=${name}, email=${email}
      WHERE id = ${id}
    `
  } catch (error) {
    console.log(error);
    
    return {
      message: 'Database Error: Failed to Edit Customer.',
    };
  }

  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')

}

export async function deleteCustomer(id: string) {

  try {
    await sql`
      DELETE FROM customers where id=${id}
    `
    revalidatePath('/dashboard/customer')
    return {
      message: 'Customer Deleted'
    }
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Customer.'
    }
  }
}