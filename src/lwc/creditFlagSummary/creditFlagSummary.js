import { LightningElement, api, track } from 'lwc';
import getAccountCreditFlag from '@salesforce/apex/BillingCustomerController.getAccountCreditFlag';
import updateCreditFlagSummary from '@salesforce/apex/CreditFlagSummaryController.updateCreditFlagSummary';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const escalationTeam = 'Escalation';
const availableOptions = ['APledge', 'PayIssues', 'CsSpecialHandling'];

export default class creditFlagSummary extends LightningElement {
  @track
  rawFlags = [];

  _accountId;

  userDepartment = escalationTeam; // TODO: need additional code to populate user department

  @track
  loading = false;

  @api
  set recordId(v) {
    this._accountId = v;
    this.loading = true;
    getAccountCreditFlag({ accountId: v })
      .then(
        ({ CREDIT_RATE__c, CREDIT_RATE2__c, CREDIT_RATE3__c, CREDIT_RATE4__c }) =>
          (this.rawFlags = [CREDIT_RATE__c, CREDIT_RATE2__c, CREDIT_RATE3__c, CREDIT_RATE4__c])
      )
      .finally(() => {
        this.loading = false;
        console.log('finished', this.loading);
      });
  }
  get recordId() {
    return this._accountId;
  }

  canEditFlag(flagValue) {
    return (
      !flagValue || (this.userDepartment === escalationTeam && flagValue === 'CsSpecialHandling')
    );
  }

  canDeleteFlag(flagValue) {
    return this.userDepartment === escalationTeam && flagValue === 'CsSpecialHandling';
  }

  get flags() {
    let options = availableOptions;
    if (this.userDepartment !== escalationTeam) {
      // 'CsSpecialHandling' only available to escalation team
      options = options.filter((v) => v !== 'CsSpecialHandling');
    }
    const maxFlagsAvailable = this.userDepartment === escalationTeam ? 3 : 2;
    const numberOfUsedFlag = this.rawFlags.filter((v) => v).length;
    let numberOfAvailableFlags = maxFlagsAvailable - numberOfUsedFlag;
    return this.rawFlags.map((value, index) => {
      const label = `Flag${index ? index + 1 : ''}`;
      if (value) {
        return {
          value,
          index,
          label,
          editable: this.canEditFlag(value),
          deletable: this.canDeleteFlag(value),
          options: [...options.filter((v) => !this.rawFlags.includes(v)), value].join(',')
        };
      } else {
        if (numberOfAvailableFlags > 0) {
          --numberOfAvailableFlags;
          // empty spot available for adding new flag
          return {
            value: '',
            index,
            label,
            editable: this.canEditFlag(value),
            deletable: this.canDeleteFlag(value),
            options: options.filter((v) => !this.rawFlags.includes(v)).join(',')
          };
        }
      }
      return {
        value: '',
        index,
        label,
        editable: false,
        deletable: false
      };
    });
  }

  renderedCallback() {
    const spinner = this.template.querySelector('.slds-spinner_container');
    if (spinner) {
      console.log('loading', this.loading);
      spinner.hidden = !this.loading;
    }
  }

  handleDelete({ detail: { index } }) {
    const [creditRate, creditRate2, creditRate3, creditRate4] = this.rawFlags.map((v, i) =>
      i === parseInt(index, 10) ? null : v
    );
    this.updateFlags({ creditRate, creditRate2, creditRate3, creditRate4 });
  }

  handleUpdate({ detail: { newValue, index } }) {
    const [creditRate, creditRate2, creditRate3, creditRate4] = this.rawFlags.map((v, i) =>
      i === parseInt(index, 10) ? newValue : v
    );
    this.updateFlags({ creditRate, creditRate2, creditRate3, creditRate4 });
  }

  updateFlags(values) {
    this.loading = true;
    return updateCreditFlagSummary({ ...values, accountId: this._accountId })
      .then((res) => {
        if (!res.includes('Credit Flags processed Successfully')) {
          // throw error to be handled by .catch
          throw new Error(res);
        }
        // update flags on display
        this.rawFlags = [
          values.creditRate,
          values.creditRate2,
          values.creditRate3,
          values.creditRate4
        ];
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            message: 'Successfully updated the Credit Flag',
            variant: 'success'
          })
        );
      })
      .catch((err) => {
        console.error(err);
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Failed to Update Flag',
            message: 'Error occurred while updating the Credit Flag(s). Please try again',
            variant: 'error'
          })
        );
      })
      .finally((this.loading = false));
  }
}
