using { poapplication2.db as database } from '../db/schema';
using { poapplication2.common as common } from '../db/common';

service CatalogService {

    //@readonly post
    //@insertonly get
    /*@Capabilities : {
        InsertRestrictions.Insertable : true,
        UpdateRestrictions.Updatable : true,
        DeleteRestrictions.Deletable : true,
        ReadRestrictions.Readable : false

    }*/
    entity EmployeeSrv as projection on database.master.Employees {
    *
    } actions {

        action increaseSalary() returns EmployeeSrv;

        function getTop20HighestPaidEmployees() returns array of EmployeeSrv;

    };


    entity ProductSrv as projection on database.master.Products {
    *
    } actions {

        // Instance Bounded Action
        action increasePrice() returns ProductSrv;

        // Instance Bounded Function
        function getTop20Products() returns array of ProductSrv;

    };
        

    entity BusinessPartnerSrv
        as projection on database.master.BusinessPartners;

    entity AddressSrv
        as projection on database.master.Addresses;


        // Transactional data which is in Transaction context
    entity PurchaseOrderSrv as projection on database.transaction.PurchaseOrders {
            *
        }actions {

            // Declare instance bounded action
            action discountPrice() returns array of PurchaseOrderSrv;

            // Declare instance bounded action
            function largestOrder() returns array of PurchaseOrderSrv;

    };

    entity PurchaseItemSrv
        as projection on database.transaction.PurchaseItems;

        action createEmployee(
        Currency_code : String(3),
        ID : UUID,
        accountNumber : common.String32,
        bankId : String(16),
        bankName : common.String64,
        email : common.Email,
        gender : common.Gender,
        language : String(2),
        loginName : String(16),
        nameFirst : common.String64,
        nameInitials : common.String64,
        nameLast : common.String64,
        nameMiddle : common.String64,
        phoneNumber : common.PhoneNumber,
        salaryAmount : common.AmountT
        ) returns EmployeeSrv;

        action createAddress(
        ADDRESS_TYPE: common.String32,
        BUILDING: common.String255,
        CITY:common.String255,
        COUNTRY:common.String255,
        LATITUDE:Decimal,
        LONGITUDE:Decimal,
        NODE_KEY: String(16),
        POSTAL_CODE: String(16),
        STREET:common.String255,
        VAL_END: Date,
        VAL_START: Date
    )returns array of AddressSrv;

    action updateEmployee(
        ID: UUID,
        salaryAmount: common.AmountT,
        Currency_code: String(3)
    ) returns String;

    action createProduct(
    NODE_KEY       : common.Guid,
    PRODUCT_ID     : common.String32,
    TYPE_CODE      : String(2),
    CATEGORY       : common.String32,
    DESCRIPTION    : common.String255,
    TAX_TARIF_CODE : Integer,
    MEASURE_UNIT   : String(2),
    WEIGHT_MEASURE : Decimal(5,2),
    WEIGHT_UNIT    : String(2),
    PRICE          : Decimal(15,2),
    CURRENCY_CODE  : String(5),
    WIDTH          : Decimal(5,2),
    DEPTH          : Decimal(5,2),
    HEIGHT         : Decimal(5,2),
    DIM_UNIT       : String(2)
) returns ProductSrv;

action createBusinessPartner(
    NODE_KEY : common.Guid,
    BP_ROLE : common.Role,
    EMAIL : common.Email,
    MOBILE : common.PhoneNumber,
    FAX : common.String32,
    WEB : common.String255,
    BP_ID : common.Guid,
    COMPANY_NAME : common.String255
) returns BusinessPartnerSrv;

action updateProduct(
    NODE_KEY : common.Guid,
    PRICE : Decimal(15,2),
    CURRENCY_CODE : String(5)
) returns String;

action deleteEmployee(
    ID : UUID,
)
    returns String;

// Custom Function Declaration
function getHighestSalariedEmployees() returns array of EmployeeSrv;

// Custom Function Declaration
function getHighestPricedProduct() returns array of ProductSrv;

// Custom Function Declaration
function getUtilities() returns String;
}