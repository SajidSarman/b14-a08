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

const CATEGORIES = [
  { value: "photo-studio", label: "Photo Studio" },
  { value: "film-stage", label: "Film Stage" },
  { value: "podcast-lounge", label: "Podcast Lounge" },
  { value: "music-suite", label: "Music Suite" },
  { value: "workshop", label: "Workshop" },
];

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

// TODO: replace with the logged-in user from the session once auth is wired
const DEMO_USER = {
  name: "Demo User",
  email: "demo@studiospace.com",
};

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

export function StudioForm() {
  const [form, setForm] = React.useState<StudioFormState>(initialForm);

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
      hostName: DEMO_USER.name,
      hostEmail: DEMO_USER.email,
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit || 0),
      maxCapacity: Number(form.maxCapacity),
    };

    const res = await fetch("http://localhost:5000/add-studio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const serverResponse = await res.json();

    // TODO: POST `data` to the Express API, then:
    // toast.success("Studio added!") and router.push("/my-listings")

    // console.log("Studio data:", data);
    
    console.log("Server response:", serverResponse);
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
            defaultValue={DEMO_USER.name}
            readOnly
            disabled
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hostEmail">Your Email</Label>
          <Input
            id="hostEmail"
            type="email"
            defaultValue={DEMO_USER.email}
            readOnly
            disabled
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

      <div className="grid gap-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://i.ibb.co/your-studio-photo.jpg"
          value={form.imageUrl}
          onChange={(event) => update("imageUrl", event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Paste a direct image URL — imgbb upload comes with the image-upload step.
        </p>
      </div>

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

      <Button type="submit" className="w-full sm:w-auto sm:justify-self-end">
        Add Studio
      </Button>
    </form>
  );
}
