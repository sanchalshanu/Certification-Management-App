public with sharing class fetchdata {
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> employeeDataFetch(){
        return [select Id,Name,Emp_Name__c,Emp_email__c,Primary_Skill__c,Secondary_Skill__c,Experience__c,Comments__c from Employee__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Certification__c> certificationDataFetch(){
        return [select Id,Name,Cert_Name__c,Comments__c from Certification__c];
    }
    @AuraEnabled(Cacheable = true)
    public static List<Certification_Request__c> certificationReqDataFetch(){
        return [SELECT Id, Name, Due_Date__c, Status__c, Comments__c,Email_recipient__c FROM Certification_Request__c ORDER BY Id ];
    }
    @AuraEnabled(Cacheable = true)
    public static List<Voucher__c> voucherDataFetch(){
        return [ SELECT Id,Active__c,Name,Validity__c,Voucher_Cost__c,Voucher_Name__c,Comments__c FROM Voucher__c ORDER BY Id ASC NULLS FIRST LIMIT 10 ];
    }
    
}
