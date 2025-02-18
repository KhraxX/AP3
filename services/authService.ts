// services/authService.ts
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

// Changé de authUserByEmailAndPassword à signInWithEmailAndPassword pour plus de clarté
export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<boolean> => {
  if (!email || !password) return false;

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) return false;
  
  return true;
};

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur:", error);
    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
};

export const getUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Ajout de la fonction pour la déconnexion
export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};