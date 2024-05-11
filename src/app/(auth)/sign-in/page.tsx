"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

export default function SignupForm() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const submit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
        console.log("data::",data)
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      console.log("results ",result);
      if (result?.error) {
          toast({
            title: "Login Failed",
            description: result.error,
            variant: "destructive",
          });
      }

      if (result?.url) {
        console.log("called")
        router.replace("/dashboard");
      }

    } catch (error: any) {

      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });

    } finally {
      setIsSubmitting(false);
    }

  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="p-8 max-w-xs md:max-w-[400px] w-full shadow-[0_40px_60px_-25px_rgba(255,200,255,0.15)] rounded-lg border  border-gray-800 ">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl mb-6">
            Welcome Back 
            </h1>
            <p className="mb-4">Sign in to continue your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-6 mt-10">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="username/email" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-700" />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
                  </>
                ) : (
                  "Signin"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-5">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-blue-700/80 hover:text-blue-900">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
