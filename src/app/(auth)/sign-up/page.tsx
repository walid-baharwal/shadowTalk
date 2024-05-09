"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import { z } from "zod";
import { useDebounceValue } from "usehooks-ts";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
export default function SignupForm() {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const debounceUsername = useDebounceValue(username, 300);
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
            if (debounceUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get<ApiResponse>(
                        `/api/u-unique?username=${debounceUsername}`
                    );
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUniqueUsername();
    }, [debounceUsername]);
    const submit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data);
            if (response.data.success) {
                router.replace(`/varify/${username}`);
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
    return <></>;
}
