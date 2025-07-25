
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { login } from './actions';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        
        try {
            const result = await login(formData);
            if (result.success) {
                toast({ title: '¡Bienvenido!', description: 'Has iniciado sesión correctamente.' });
                router.push('/projects');
                router.refresh();
            } else {
                toast({ title: 'Error de autenticación', description: result.error, variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Ocurrió un error inesperado.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                        <CardDescription>
                           Ingresa tus credenciales para acceder a la aplicación.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Usuario</Label>
                            <Input id="username" name="username" type="text" placeholder="gaston" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Acceder
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

