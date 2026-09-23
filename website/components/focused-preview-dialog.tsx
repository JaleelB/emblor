'use client';

import { useState } from 'react';

import type { PlaygroundExample, PlaygroundPreviewState } from '@/components/playground-examples';
import { playgroundPreviews } from '@/components/playground-examples';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type PreviewWidth = 'phone' | 'compact' | 'wide';
type PreviewDirection = 'ltr' | 'rtl';

export function FocusedPreviewDialog({
  example,
  open,
  onOpenChange,
}: {
  example: PlaygroundExample | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [width, setWidth] = useState<PreviewWidth>('wide');
  const [direction, setDirection] = useState<PreviewDirection>('ltr');
  const [previewState, setPreviewState] = useState<PlaygroundPreviewState>('default');
  const Preview = example ? playgroundPreviews[example.slug] : undefined;
  const supportsStateControls = example?.slug === 'tag-input-basic';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="focused-preview-dialog" showCloseButton>
        <DialogHeader className="focused-preview-header">
          <div>
            <DialogTitle>{example?.title ?? 'Example preview'}</DialogTitle>
            <DialogDescription>Test the live composition at a representative content width.</DialogDescription>
          </div>
          <div className="focused-preview-controls">
            {supportsStateControls ? (
              <ToggleGroup
                className="focused-preview-state-controls"
                type="single"
                value={previewState}
                onValueChange={(value) => {
                  if (value) setPreviewState(value as PlaygroundPreviewState);
                }}
                variant="outline"
                size="sm"
                aria-label="Preview state"
              >
                <ToggleGroupItem value="default">Default</ToggleGroupItem>
                <ToggleGroupItem value="disabled">Disabled</ToggleGroupItem>
                <ToggleGroupItem value="readonly">Read-only</ToggleGroupItem>
                <ToggleGroupItem value="invalid">Invalid</ToggleGroupItem>
                <ToggleGroupItem value="capacity">At limit</ToggleGroupItem>
              </ToggleGroup>
            ) : null}
            <div className="focused-preview-environment-controls">
              <ToggleGroup
                type="single"
                value={direction}
                onValueChange={(value) => {
                  if (value) setDirection(value as PreviewDirection);
                }}
                variant="outline"
                size="sm"
                aria-label="Preview direction"
              >
                <ToggleGroupItem value="ltr">LTR</ToggleGroupItem>
                <ToggleGroupItem value="rtl">RTL</ToggleGroupItem>
              </ToggleGroup>
              <ToggleGroup
                type="single"
                value={width}
                onValueChange={(value) => {
                  if (value) setWidth(value as PreviewWidth);
                }}
                variant="outline"
                size="sm"
                aria-label="Preview width"
              >
                <ToggleGroupItem value="phone">Phone</ToggleGroupItem>
                <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
                <ToggleGroupItem value="wide">Wide</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </DialogHeader>
        <div className="focused-preview-stage" data-preview-width={width}>
          <div className="focused-preview-canvas" dir={direction}>
            {Preview ? <Preview previewState={previewState} /> : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
