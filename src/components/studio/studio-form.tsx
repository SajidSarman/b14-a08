"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { StudioImageField } from "@/components/studio/studio-image-field";

const AMENITIES = [
  "Green Screen",
  "Lighting Kit",
  "Soundproofing",
  "Microphones",
  "Piano / Keyboard",
  "Changing Room",
  "Wi-Fi",
  "Free Parking",
  "Air Conditioning",
  "Kitchenette",
];

const initialForm: StudioFormState = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  imageUrl: "",
  amenities: [],
  overview: "",
};

type StudioFormState = {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
};

export function StudioForm({
  user,
}: {
  user: { name: string; email: string };
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<StudioFormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isImageUploading, setIsImageUploading] = React.useState(false);
  const [error, setError] = React.useState("");

  const update = (field: keyof StudioFormState, value: string | string[]) =>
    setForm((current) => ({ ...current, [field]: value }));

  const toggleAmenity = (amenity: string, checked: boolean) =>
    update(
      "amenities",
      checked
        ? [...form.amenities, amenity]
        : form.amenities.filter((item) => item !== amenity)
    );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      ...form,
      hostName: user.name,
      hostEmail: user.email,
      ownerEmail: user.email,
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit || 0),
      maxCapacity: Number(form.maxCapacity),
    };

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/studios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }

      toast.add({
        title: "Studio added",
        description: "Your listing has been created.",
        type: "success",
      });
      router.push("/my-listings");
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? `Unable to add this studio: ${submitError.message}`
          : "Unable to add this studio. Please try again.";
      setError(message);
      toast.add({
        title: "Studio could not be added",
        description: message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // console.log(form) 

  return (
    <form
      className="mx-auto grid w-full max-w-2xl gap-6 px-4 py-12 md:py-16"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Add New Studio</h1>
        <p className="text-sm text-muted-foreground">
          List your space so creators can find and book it.
        </p>
      </div>

      {/* Read-only host info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="hostName">Your Name</Label>
          <Input
            id="hostName"
            value={user.name}
            readOnly
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hostEmail">Your Email</Label>
          <Input
            id="hostEmail"
            type="email"
            value={user.email}
            readOnly
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Studio Title</Label>
        <Input
          id="title"
          placeholder="Sunlit downtown photo studio"
          required
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={form.category || null}
          onValueChange={(value) => update("category", value ?? "")}
        >
          <SelectTrigger id="category" className="w-full" aria-label="Category">
            {form.category
              ? CATEGORIES.find((c) => c.value === form.category)?.label
              : "Select a category"}
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min={1}
            placeholder="35"
            required
            value={form.hourlyRate}
            onChange={(event) => update("hourlyRate", event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
          <Input
            id="securityDeposit"
            type="number"
            min={0}
            placeholder="100"
            value={form.securityDeposit}
            onChange={(event) => update("securityDeposit", event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="maxCapacity">Max Capacity</Label>
          <Input
            id="maxCapacity"
            type="number"
            min={1}
            placeholder="10"
            value={form.maxCapacity}
            onChange={(event) => update("maxCapacity", event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Location / Address</Label>
        <Input
          id="location"
          placeholder="12 Art Street, Los Angeles, CA"
          required
          value={form.location}
          onChange={(event) => update("location", event.target.value)}
        />
      </div>

      <StudioImageField
        imageUrl={form.imageUrl}
        onImageUrlChange={(value) => update("imageUrl", value)}
        isUploading={isImageUploading}
        onUploadingChange={setIsImageUploading}
      />

      <fieldset className="grid gap-3">
        <legend className="text-sm font-medium">Amenities</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AMENITIES.map((amenity) => (
            <Label
              key={amenity}
              className="flex items-center gap-2 rounded-lg border p-2.5 text-sm font-normal has-[[data-checked]]:border-ring has-[[data-checked]]:bg-primary/5"
            >
              <Checkbox
                checked={form.amenities.includes(amenity)}
                onCheckedChange={(checked) => toggleAmenity(amenity, !!checked)}
              />
              {amenity}
            </Label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <Label htmlFor="overview">Detailed Overview</Label>
        <Textarea
          id="overview"
          rows={5}
          className="min-h-32"
          placeholder="Describe the space, its vibe, the gear included, house rules…"
          value={form.overview}
          onChange={(event) => update("overview", event.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full sm:w-auto sm:justify-self-end"
        disabled={isSubmitting || isImageUploading}
      >
        {isImageUploading
          ? "Uploading image..."
          : isSubmitting
            ? "Saving..."
            : "Add Studio"}
      </Button>
    </form>
  );
}
