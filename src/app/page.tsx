import { redirect } from 'next/navigation';

export default function HomePage() {
  // The root page is not used, redirect to the main projects catalog.
  redirect('/projects');
}
