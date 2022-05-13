const DATA_VALUE = {
  contribution: 0,
  range_type: '',
  range_values: {
    higher_bound: 0,
    lower_bound: 0,
    multiple_values: [],
  },
};

const CONTEXT_ATTRIBUTE = {
  context_attribute_name: '',
  context_attribute_description: '',
  unit: '',
  weight: 0,
  data_values: [{ ...DATA_VALUE }],
};

const TRANSITION_DATA = {
  from: '',
  to: '',
  timeBased: true,
  rule: null,
  time: '',
};

export const DEFAULT_VALUES = {
  CONTEXT_ATTRIBUTE: CONTEXT_ATTRIBUTE,
  DATA_VALUE: DATA_VALUE,
  TRANSITION_DATA: TRANSITION_DATA,
};
