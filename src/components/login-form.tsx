'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/firebase';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
} from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export function AuthForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>, action: 'login' | 'signup') => {
    setIsSubmitting(true);
    if (action === 'login') {
      initiateEmailSignIn(auth, values.email, values.password);
    } else {
      initiateEmailSignUp(auth, values.email, values.password);
    }
    // The onAuthStateChanged listener in FirebaseProvider will handle the redirect
    // but we can push the user to the homepage optimistically.
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-lg">
            <CardHeader>
                <CardTitle>Welcome</CardTitle>
                <CardDescription>Sign in or create an account to continue</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit((values) => onSubmit(values, 'login'))} className="space-y-4 mt-4">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Processing...' : 'Login'}
                        </Button>
                    </form>
                    </Form>
                </TabsContent>
                <TabsContent value="signup">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit((values) => onSubmit(values, 'signup'))} className="space-y-4 mt-4">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Processing...' : 'Create Account'}
                        </Button>
                    </form>
                    </Form>
                </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
