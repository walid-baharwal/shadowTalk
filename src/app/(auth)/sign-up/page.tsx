"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import { z } from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const debounceUsername = useDebounceCallback(setUsername, 400);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<ApiResponse>(`/api/u-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUniqueUsername();
  }, [username]);
  const submit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      if (response.data.success) {
        router.replace(`/verify/${username}`);
      }
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ApiResponse>;
      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ("There was a problem with your sign-up. Please try again.");
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
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
              Join Shadow Talk
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-6 mt-10">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounceUsername(e.target.value);
                        }}
                      />
                    </FormControl>
                    <div className="">
                      {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin" />}
                      {!isCheckingUsername && usernameMessage && username && (
                        <span
                          className={`text-sm ${
                            usernameMessage === "Username is unique"
                              ? "text-green-600"
                              : "text-red-700"
                          }`}
                        >
                          {usernameMessage}
                        </span>
                      )}
                    </div>
                    <FormMessage  />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="email" {...field} />
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
                  "Signup"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-5">
            <p>
              Already a member?{" "}
              <Link href="/sign-in" className="text-blue-700/80 hover:text-blue-900">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
