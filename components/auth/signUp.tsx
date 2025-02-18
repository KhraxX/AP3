'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { signUpWithEmailAndPassword } from '@/services/authService';


type FormInputs = {
  email: string;
  password: string;
};

export default function SignUp() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormInputs>();

  const email = watch('email');
  const password = watch('password');

  const onSubmit = async (data: FormInputs) => {
    try {
      setLoading(true);
      console.log("Tentative d'inscription avec:", { email: data.email });

      const result = await signUpWithEmailAndPassword(
        data.email,
        data.password
      );

      if (result.success) {
        setDialogOpen(true);
      } else {
        toast({
          title: 'Erreur',
          description: result.error || "Erreur lors de l'inscription",
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        title: 'Erreur',
        description: "Une erreur inattendue s'est produite",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <MailCheck className="h-8 w-8 text-green-600" aria-hidden="true" />
                </div>
                <span className="mt-2 text-center">Inscription réussie</span>
              </div>
            </AlertDialogTitle>

            <AlertDialogDescription>
              <span className="mt-2 text-center block">
                Un email de confirmation a été envoyé à votre adresse.<br />
                Veuillez vérifier votre boîte mail pour confirmer votre inscription.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-2 flex justify-center">
            <AlertDialogAction
              className="w-full"
              onClick={() => (window.location.href = '/')}
            >
              Retour
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email', { 
                    required: "L'email est requis",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email invalide"
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { 
                    required: "Le mot de passe est requis",
                    minLength: {
                      value: 6,
                      message: "Le mot de passe doit contenir au moins 6 caractères"
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
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
                  'Créer votre compte'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}