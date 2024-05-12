import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteIcon } from "lucide-react";
import axios from "axios";

const MessageCard = ({ content, _id }: { content: string; _id: string }) => {
  const handleDelete = async () => {
    const response = await axios.delete(`api/delete-message/${_id}`);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>📨</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <DeleteIcon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
      </Card>
    </>
  );
};

export default MessageCard;
