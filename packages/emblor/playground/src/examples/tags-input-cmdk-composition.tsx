import * as React from 'react';
import { Command } from 'cmdk';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagRemove } from 'emblor/core';

const SUGGESTIONS = ['spacing system', 'color tokens', 'animation curves', 'documentation', 'component tokens'];

export function CmdkCompositionExample(): JSX.Element {
  const [tags, setTags] = React.useState<Array<string>>(['spacing system', 'color tokens']);
  const labelId = React.useId().replace(/:/g, '');

  const availableSuggestions = React.useMemo(
    () => SUGGESTIONS.filter((item) => !tags.includes(item)),
    [tags],
  );

  return (
    <div className="story-preview">
      <Command className="cmdk-shell" loop>
        <EmblorRoot
          className="ti-root"
          labelId={labelId}
          value={tags}
          onValueChange={setTags}
          delimiter={[',', 'Enter']}
          allowDuplicates={false}
        >
          <div className="ti-label-group">
            <label id={labelId} className="ti-label">
              Command palette filters
            </label>
            <p className="ti-helper">Type to filter suggestions or press Enter to commit the current query.</p>
          </div>
          <div className="ti-stack">
            <EmblorTagList className="ti-tag-list">
              {tags.map(function renderTag(tag, index) {
                return (
                  <EmblorTag key={`${tag}-${index}`} index={index} className="ti-tag">
                    <span>{tag}</span>
                    <EmblorTagRemove
                      index={index}
                      aria-label={`Remove ${tag}`}
                      className="ti-tag-remove ti-tag-remove--subtle"
                    />
                  </EmblorTag>
                );
              })}
            </EmblorTagList>
            <EmblorInput as={Command.Input} className="ti-input" placeholder="Filter commands" />
          </div>
        </EmblorRoot>
        <Command.List className="cmdk-suggestions">
          <Command.Empty className="cmdk-empty">No matching commands.</Command.Empty>
          <Command.Group className="cmdk-group">
            <p className="cmdk-heading">Suggestions</p>
            {availableSuggestions.map(function renderSuggestion(suggestion) {
              return (
                <Command.Item
                  key={suggestion}
                  value={suggestion}
                  className="cmdk-item"
                  onSelect={function handleSelect(value) {
                    setTags(function update(previous) {
                      if (previous.includes(value)) {
                        return previous;
                      }
                      return [...previous, value];
                    });
                  }}
                >
                  {suggestion}
                </Command.Item>
              );
            })}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
