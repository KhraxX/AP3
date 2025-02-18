'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from '@/services/authService';
import { handleRevalidate } from './actions';

type FormInputs = {
  email: string;
  password: string;
};

export default function Login() {
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
        await handleRevalidate();
        router.push('/');
      } else {
        // Gérer l'erreur
        console.error("Échec de la connexion");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reste de votre composant...
}