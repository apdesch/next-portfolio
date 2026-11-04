import { z } from "zod";
import getFirstFieldErrors from "@/lib/get-first-field-errors";
import getYoutubeVideoId from "@/lib/get-youtube-video-id";

const videoFormSchema = z.object({
  youtubeUrl: z
    .string({ error: "Paste a YouTube video link." })
    .trim()
    .refine(
      (youtubeUrl) => getYoutubeVideoId(youtubeUrl) !== null,
      "Paste a YouTube video link, such as https://youtu.be/…",
    ),
  description: z
    .string({ error: "Write a caption." })
    .trim()
    .min(1, "Write a caption."),
});

type VideoFormValues = z.output<typeof videoFormSchema>;

export type VideoFormErrors = Partial<Record<keyof VideoFormValues, string>>;

export type VideoFormState = { fieldErrors: VideoFormErrors; isSaved: boolean };

type VideoFormResult =
  | { isValid: true; values: VideoFormValues }
  | { isValid: false; fieldErrors: VideoFormErrors };

const parseVideoForm = (formData: FormData): VideoFormResult => {
  const result = videoFormSchema.safeParse({
    youtubeUrl: formData.get("youtubeUrl"),
    description: formData.get("description"),
  });
  if (result.success) return { isValid: true, values: result.data };
  return {
    isValid: false,
    fieldErrors: getFirstFieldErrors(z.flattenError(result.error).fieldErrors),
  };
};

export default parseVideoForm;
