'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { EmblorInput, EmblorLabel, EmblorRoot, EmblorTag, EmblorTagList, EmblorTagRemove, EmblorTagText } from 'emblor';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

const skillsSchema = z.object({
  skills: z.array(z.string()).min(2, 'Add at least two skills.').max(5, 'Choose no more than five skills.'),
});

type SkillsForm = z.infer<typeof skillsSchema>;

export function EmblorReactHookFormField() {
  const descriptionId = useId();
  const errorId = useId();
  const [submitted, setSubmitted] = useState<string[]>([]);
  const form = useForm<SkillsForm>({
    resolver: zodResolver(skillsSchema),
    defaultValues: { skills: ['react'] },
  });

  return (
    <form className="w-full max-w-xl" onSubmit={form.handleSubmit(({ skills }) => setSubmitted(skills))} noValidate>
      <FieldGroup className="gap-4">
        <Controller
          name="skills"
          control={form.control}
          render={({ field, fieldState }) => (
            <EmblorRoot
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              maxTags={5}
              invalid={fieldState.invalid}
            >
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel asChild>
                  <EmblorLabel>Skills</EmblorLabel>
                </FieldLabel>
                <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2.5 py-2 shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-[[data-invalid]]:border-destructive has-[[data-invalid]]:ring-destructive/20">
                  <EmblorTagList className="flex flex-wrap gap-1.5">
                    {(tag, index) => (
                      <EmblorTag
                        key={tag}
                        index={index}
                        className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm font-medium"
                      >
                        <EmblorTagText />
                        <EmblorTagRemove
                          aria-label={`Remove ${tag}`}
                          className="rounded-sm px-0.5 text-muted-foreground hover:bg-accent"
                        >
                          ×
                        </EmblorTagRemove>
                      </EmblorTag>
                    )}
                  </EmblorTagList>
                  <EmblorInput
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-describedby={`${descriptionId}${fieldState.invalid ? ` ${errorId}` : ''}`}
                    aria-invalid={fieldState.invalid}
                    className="min-w-28 flex-1 bg-transparent text-sm outline-none"
                    placeholder="Add a skill"
                  />
                </div>
                <FieldDescription id={descriptionId}>Add between two and five skills.</FieldDescription>
                {fieldState.invalid ? <FieldError id={errorId} errors={[fieldState.error]} /> : null}
              </Field>
            </EmblorRoot>
          )}
        />
        <Field orientation="horizontal" className="flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setSubmitted([]);
            }}
          >
            Reset
          </Button>
          <Button type="submit">Save skills</Button>
        </Field>
        <output className="rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground" aria-live="polite">
          {submitted.length ? JSON.stringify(submitted) : 'Submit to inspect the validated value'}
        </output>
      </FieldGroup>
    </form>
  );
}
