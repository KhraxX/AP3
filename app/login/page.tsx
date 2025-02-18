'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from '@/components/auth/signIn';
import SignUp from '@/components/auth/signUp';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="mt-4">
            <SignIn />
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <SignUp />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}