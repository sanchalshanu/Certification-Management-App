import { LightningElement, wire, track } from 'lwc';
import Cert_Object from '@salesforce/schema/Certification__c';
import CertId from '@salesforce/schema/Certification__c.Name';
import CertName from '@salesforce/schema/Certification__c.Cert_Name__c';
import CertComm from '@salesforce/schema/Certification__c.Comments__c';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import getcertificationDataFetch from'@salesforce/apex/fetchdata.certificationDataFetch';

import { refreshApex } from '@salesforce/apex';
import {
    updateRecord,
    deleteRecord
} from 'lightning/uiRecordApi';
const col=[
    { label: 'Certification Id',fieldName:'Name',editable: false},
    { label: 'Certification Name', fieldName: 'Cert_Name__c', editable: true },
    { label: 'Comments', fieldName: 'Comments__c', editable: true }
]
export default class Certification extends LightningElement {
    fields = [CertName, CertComm];
    @track columns=col;
    @track error;
    // @track data;
    @track draftValues = [];
    @track recordid;
    @track result;

    handleSuccess(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Certification',
            message: 'Certification  Created !',
            variant: 'success'
        }));
        location.reload();
    }

    @wire(getcertificationDataFetch)certification;
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
            return refreshApex(this.certification);
            // location.reload();
    }
    Save(event) {
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
    
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(() => {
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
            //  location.reload();
             return refreshApex(this.certification);
        }).catch(error => {
            // Handle error
        });
        return refreshApex(this.certification);
    }

}
