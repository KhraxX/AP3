'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from '@/services/authService';

type FormInputs = {
  email: string;
  password: string;
};

export default function SignIn() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm<FormInputs>();

  const email = watch('email');
  const password = watch('password');

  const onSubmit = async (data: FormInputs) => {
    try {
      setLoading(true);
      const success = await signInWithEmailAndPassword(data.email, data.password);

      if (success) {
        router.push('/');
        toast({
          title: "Succès",
          description: "Connexion réussie",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register('email', { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              {...register('password', { required: true })}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}