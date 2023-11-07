import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import NotFoundPage from '@/app/ui/not-found';

export default function NotFound() {
  return NotFoundPage({ path: 'customers' })
}