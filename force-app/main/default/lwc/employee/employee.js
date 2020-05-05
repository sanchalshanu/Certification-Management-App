import { LightningElement, track, wire} from 'lwc';
import EMP_FIELD from '@salesforce/schema/Employee__c';
import EmpName_FIELD from '@salesforce/schema/Employee__c.Emp_Name__c';
import EmpEmail_FIELD from '@salesforce/schema/Employee__c.Emp_email__c';
import EmpID_FIELD from '@salesforce/schema/Employee__c.Name';
import PrimarySkill_FIELD from '@salesforce/schema/Employee__c.Primary_Skill__c';
import SecondarySkill_FIELD from '@salesforce/schema/Employee__c.Secondary_Skill__c';
import Experience_FIELD from '@salesforce/schema/Employee__c.Experience__c';
import Comments_FIELD from '@salesforce/schema/Employee__c.Comments__c';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import getemployeeDataFetch from'@salesforce/apex/fetchdata.employeeDataFetch';
import { refreshApex } from '@salesforce/apex';
import {
    updateRecord,
    deleteRecord
} from 'lightning/uiRecordApi';
const col=[
    {label:'Employee Id',fieldName:'Name',editable: false},
    { label: 'Name', fieldName: 'Emp_Name__c', editable: true },
    { label: 'Email', fieldName: 'Emp_email__c', editable: true},
    { label: 'Primary Skills', fieldName: 'Primary_Skill__c', editable: true },
    { label: 'Secondary Skills', fieldName: 'Secondary_Skill__c', editable: true },
    { label: 'Experience', fieldName: 'Experience__c', editable: true },
    { label: 'Comments', fieldName: 'Comments__c', editable: true }
]
export default class Employee extends LightningElement {
    fields = [EmpName_FIELD, EmpEmail_FIELD, PrimarySkill_FIELD,SecondarySkill_FIELD,Experience_FIELD,Comments_FIELD];
    @track columns=col;
    @track error;
    @track data;
    @track draftValues = [];
    @track recordid;
    @track result;
    @wire(getemployeeDataFetch)employee;
   

    handleSuccess(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Employee',
            message: 'Employee   Created !',
            variant: 'success'
        }));
        location.reload();
    }
    ClickAdd() {

        var el = this.template.querySelector('lightning-datatable');
        var selected = el.getSelectedRows();
        let selectedIds = [];

        for (const element of selected) {
            selectedIds.push(element.Id);
        }
        this.recordid = selectedIds[0];
        
     }
     deleterecord1(event) {
        
        deleteRecord(this.recordid)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted Successfully',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error Occured',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
            return refreshApex(this.employee);
            // location.reload();
    }
    Save(event) {
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
    
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(EMP_FIELD => {
            this.dispatchEvent( 
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Data updated',
                    variant: 'success'
                })
            );
             // Clear all draft values
             this.draftValues = [];
    
             // Display fresh data in the datatable
             location.reload();
             return refreshApex(this.employee);
        }).catch(error => {
            // Handle error
        });
        return refreshApex(this.employee);
    }
}