import { LightningElement, api } from 'lwc';

const flagDictionary = {
  APledge: 'APledge: Active Pledge',
  PayIssues: 'PayIssues: Pymt Investigation',
  CsSpecialHandling: 'CsSpecialHandling: CS Special Handling'
};

export default class creditFlagItem extends LightningElement {
  @api
  flagValue;

  @api
  isEditable = false;

  @api
  isDeletable = false;

  @api
  index;

  _availableValues;
  @api
  set availableValues(v) {
    if (typeof v === 'array') {
      this._availableValues = v;
    } else if (typeof v === 'string') {
      this._availableValues = v.trim().split(',');
    }
  }
  get availableValues() {
    return this._availableValues;
  }

  mode = 'view';

  selectedValue;

  get isViewMode() {
    return this.mode === 'view';
  }

  get isEditMode() {
    return this.mode === 'edit';
  }

  get flagLabel() {
    return flagDictionary[this.flagValue];
  }

  get comboBoxOptions() {
    return this.availableValues.map((value) => ({
      value,
      label: flagDictionary[value] || value,
      selected: value === this.flagValue
    }));
  }

  handleDelete() {
    this.dispatchEvent(
      new CustomEvent('delete', {
        detail: { value: this.flagValue, index: this.index }
      })
    );
  }

  handleEdit() {
    this.selectedValue = this.flagValue || this.availableValues[0];
    this.mode = 'edit';
  }

  handleValueChange(event) {
    this.selectedValue = event.currentTarget.value;
  }

  handleCancel() {
    this.mode = 'view';
  }

  handleSave() {
    this.mode = 'view';
    if (this.flagValue !== this.selectedValue) {
      this.dispatchEvent(
        new CustomEvent('update', {
          detail: { newValue: this.selectedValue, oldValue: this.flagValue, index: this.index }
        })
      );
      this.flagValue = this.selectedValue;
    }
  }
}
