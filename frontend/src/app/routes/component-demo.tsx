import { zodResolver } from "@hookform/resolvers/zod";
import { createRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

import { rootRoute } from "./__root";

const variants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;
const sizes = ["xs", "sm", "default", "lg"] as const;

export const testSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters" }),
  email: z.email({ error: "Please enter a valid email address" }),
  message: z
    .string()
    .min(10, { error: "Message must be at least 10 characters" }),
});

type TestForm = z.infer<typeof testSchema>;

function ComponentTestPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestForm>({
    resolver: zodResolver(testSchema),
    defaultValues: { name: "", email: "", message: "" },
    mode: "onTouched",
  });

  async function onSubmit(_data: TestForm) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Form submitted", { description: "Test successful!" });
    reset();
  }

  return (
    <div className="mx-auto max-w-200 space-y-8 p-8">
      <h1 className="text-2xl font-bold">Component Library Test</h1>

      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>
            All available button variants and sizes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {sizes.map((size) => (
              <Button key={size} size={size === "default" ? undefined : size}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simple Card</CardTitle>
          <CardDescription>
            A basic card with header and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a simple card example with just a header, description, and
            content area.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            Card Action
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Card with Action</CardTitle>
          <CardDescription>
            A card that includes an action in the header
          </CardDescription>
          <CardAction>
            <Button variant="outline" size="sm">
              Header Action
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This card demonstrates the CardAction component positioned in the
            header area.
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldSet>
          <FieldLegend>Contact Form</FieldLegend>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldContent>
                <Input
                  id="name"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                  placeholder="Your name"
                />
              </FieldContent>
              <FieldError errors={[errors.name]} />
            </Field>

            <FieldSeparator />

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                  placeholder="Your email"
                />
              </FieldContent>
              <FieldError errors={[errors.email]} />
            </Field>

            <FieldSeparator />

            <Field data-invalid={!!errors.message}>
              <FieldLabel htmlFor="message">Message</FieldLabel>
              <FieldContent>
                <Input
                  id="message"
                  aria-invalid={!!errors.message}
                  {...register("message")}
                  placeholder="Your message (min 10 chars)"
                />
              </FieldContent>
              <FieldError errors={[errors.message]} />
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}

const componentTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/demo",
  component: ComponentTestPage,
});

export default componentTestRoute;
