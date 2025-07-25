
'use server'
 
import { redirect } from 'next/navigation'
import { createSession, getSession, deleteSession } from '@/lib/session';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // Hardcoded credentials
  if (username === 'gaston' && password === '16494945321') {
    await createSession({ username });
    return { success: true };
  }
 
  return { success: false, error: 'Usuario o contraseña incorrectos.' };
}
 
export async function logout() {
  await deleteSession();
  redirect('/login');
}
