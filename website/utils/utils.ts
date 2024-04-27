export type propOption = {
  option: string;
  type: string;
  default: string;
  description: string;
};

export const tagInputProps: propOption[] = [
  {
    option: 'placeholder',
    type: 'string',
    default: '""',
    description: 'Placeholder text for the input.',
  },
  {
    option: 'tags',
    type: 'Array<{ id: string, text: string }>',
    default: '[]',
    description: 'An array of tags that are displayed as pre-selected.',
  },
  {
    option: 'setTags',
    type: 'React.Dispatch<React.SetStateAction<{ id: string, text: string }[]>>',
    default: '[]',
    description: 'Function to set the state of tags.',
  },
  {
    option: 'enableAutocomplete',
    type: 'boolean',
    default: 'false',
    description: 'Enable autocomplete feature. Must be used with autocompleteOptions.',
  },
  {
    option: 'autocompleteOptions',
    type: 'Array<{ id: string, text: string }>',
    default: '[]',
    description: 'List of options for autocomplete. Must be used with enableAutocomplete.',
  },
  {
    option: 'maxTags',
    type: 'number',
    default: 'null',
    description: 'Maximum number of tags allowed.',
  },
  {
    option: 'minTags',
    type: 'number',
    default: 'null',
    description: 'Minimum number of tags required.',
  },
  {
    option: 'readOnly',
    type: 'boolean',
    default: 'false',
    description: 'Make the input read-only.',
  },
  {
    option: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the input.',
  },
  {
    option: 'onTagAdd',
    type: 'Function',
    default: 'null',
    description: 'Callback function when a tag is added.',
  },
  {
    option: 'onTagRemove',
    type: 'Function',
    default: 'null',
    description: 'Callback function when a tag is removed.',
  },
  {
    option: 'allowDuplicates',
    type: 'boolean',
    default: 'false',
    description: 'Allow duplicate tags.',
  },
  {
    option: 'maxLength',
    type: 'number',
    default: 'null',
    description: 'Maximum length of a tag.',
  },
  {
    option: 'minLength',
    type: 'number',
    default: 'null',
    description: 'Maximum length of  tag.',
  },
  {
    option: 'validateTag',
    type: 'Function',
    default: 'null',
    description: 'Function to validate a tag.',
  },
  {
    option: 'delimiter',
    type: 'Delimiter',
    default: 'null',
    description: 'Character used to separate tags.',
  },
  {
    option: 'showCount',
    type: 'boolean',
    default: 'false',
    description: 'Show the count of tags.',
  },
  {
    option: 'placeholderWhenFull',
    type: 'string',
    default: '""',
    description: 'Placeholder text when tag limit is reached.',
  },
  {
    option: 'sortTags',
    type: 'boolean',
    default: 'false',
    description: 'Sort tags alphabetically.',
  },
  {
    option: 'delimiterList',
    type: 'Array',
    default: '[]',
    description: 'List of characters that can be used as delimiters.',
  },
  {
    option: 'truncate',
    type: 'number',
    default: 'null',
    description: 'Truncate tag text to a certain length.',
  },
  {
    option: 'autocompleteFilter',
    type: 'Function',
    default: 'null',
    description: 'Function to filter autocomplete options.',
  },
  {
    option: 'direction',
    type: 'string',
    default: 'row',
    description: 'Layout direction of the tag inputs.',
  },
  {
    option: 'onInputChange',
    type: 'Function',
    default: 'null',
    description: 'A callback function that is called whenever the input value changes.',
  },
  {
    option: 'customTagRenderer',
    type: 'Function',
    default: 'null',
    description:
      'A callback function that is used to render custom tag elements. This function receives a tag object as an argument and should return a React element representing the custom-rendered tag.',
  },
  {
    option: 'onFocus',
    type: 'Function',
    default: 'null',
    description: 'Function to be called when the input field gains focus.',
  },
  {
    option: 'onBlur',
    type: 'Function',
    default: 'null',
    description: 'Function to be called when the input field loses focus.',
  },
  {
    option: 'restrictTagsToAutocompleteOptions',
    type: 'boolean',
    default: 'false',
    description: 'Only allow tags that are present in the autocomplete options.',
  },
  {
    option: 'onTagClick',
    type: 'Function',
    default: 'null',
    description: 'A callback function to be called when a tag is clicked',
  },
  {
    option: 'draggable',
    type: 'boolean',
    default: 'false',
    description: 'Enable drag and drop functionality.',
  },
  {
    option: 'inputFieldPosition',
    type: 'string',
    default: 'bottom',
    description: 'Position of the input field in relation to the tags',
  },
  {
    option: 'clearAll',
    type: 'boolean',
    default: 'false',
    description: 'Show a button to clear all tags.',
  },
  {
    option: 'onClearAll',
    type: 'Function',
    default: 'null',
    description: 'A callback function to be called when the clear all button is clicked.',
  },
  {
    option: 'inputProps',
    type: 'Object',
    default: '{}',
    description: 'Additional props to be passed to the input field (for example autocomplete, disabled etc).',
  },
  {
    option: 'usePopoverForTags',
    type: 'boolean',
    default: 'false',
    description: 'Use a popover to display tags instead of inline.',
  },
];
