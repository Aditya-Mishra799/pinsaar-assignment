import React from "react";
import { useForm } from "react-hook-form";
import Input from "./Input.jsx";
import Textarea from "./Textarea.jsx";
import Button from "./Button.jsx";

const NoteForm = ({ onCreate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      releaseAt: new Date(data.releaseAt).toISOString(),
    };

    try {
      await onCreate(formattedData);
      reset();
    } catch (error) {
      // Handle submission error appropriately here (e.g., show toast)
      console.error("Error creating note:", error);
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Title"
        name="title"
        placeholder="Enter note title"
        register={register}
        required={true}
        errors={errors}
      />

      <Textarea
        label="Body"
        name="body"
        placeholder="Enter note body"
        register={register}
        required={true}
        errors={errors}
        rows={5}
      />

      <Input
        label="Release At"
        name="releaseAt"
        type="datetime-local"
        register={register}
        required={true}
        errors={errors}
      />

      <Input
        label="Webhook URL"
        name="webhookUrl"
        placeholder="https://example.com/webhook"
        type="url"
        register={register}
        required={true}
        errors={errors}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Note"}
      </Button>
    </form>
  );
};

export default NoteForm;
