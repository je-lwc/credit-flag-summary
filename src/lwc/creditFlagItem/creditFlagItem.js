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

  get comboBoxOptions() {
    return this.availableValues.map((value) => ({ label: flagDictionary[value] || value, value }));
  }

  handleDelete() {
    this.dispatchEvent(
      new CustomEvent('delete', {
        detail: { value: this.flagValue }
      })
    );
  }

  handleEdit() {
    this.selectedValue = this.flagValue;
    this.mode = 'edit';
  }

  handleValueChange(event) {
    this.selectedValue = event.detail.value;
  }

  handleSave() {
    this.mode = 'view';
    if (this.flagValue !== this.selectedValue) {
      this.dispatchEvent('update', {
        detail: { newValue: this.selectedValue, oldValue: this.flagValue }
      });
      this.flagValue = this.selectedValue;
    }
  }
}
