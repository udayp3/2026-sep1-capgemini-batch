//This is cat-service.js
const { exists, isdir, mkdirp, read } = cds.utils;
const { uuid } = cds.utils;
module.exports = cds.service.impl(async function () {

     
    const {
    EmployeeSrv,
    AddressSrv,
    ProductSrv,
    BusinessPartnerSrv,
    PurchaseOrderSrv,
    PurchaseItemSrv
} = this.entities;

    // Implementation of an action
    // There are 3 generic handlers
    // .before() : Pre-check and validation
    // .on() : Performing DB operations
    // .after() : To save / close connections


    this.on("createEmployee", async (request, response) => {
 
        // Step - 2 : Get the data which is coming from the API
        const empData = request.data;
 
        // Step - 3 : Instantiate the transaction object
        const objTransaction = cds.tx(request);
 
        // Step - 4 : Insert the record into database
        let returnData = await objTransaction.run([
            INSERT.into(EmployeeSrv).entries(empData)
        ]).then((resolve, reject) => {
            if (typeof(resolve) !== undefined) {
                return request.data;
            } else {
                request.error(500, "Error in inserting data into the database");
            }
        }).catch(err => {
            request.error("There is an error : ", err.toString());
        })
 
        // Step - 5 : Return the data
        return returnData;
    })
    this.on("createAddress", async (request, response) => {
 
        // Step - 2 : Get the data which is coming from the API
        const adrData = request.data;
 
        // Step - 3 : Instantiate the transaction object
        const objTransaction = cds.tx(request);
 
        // Step - 4 : Insert the record into database
        let returnData = await objTransaction.run([
            INSERT.into(AddressSrv).entries(adrData)
        ]).then((resolve, reject) => {
            if (typeof(resolve) !== undefined) {
                return request.data;
            } else {
                request.error(500, "Error in inserting data into the database");
            }
        }).catch(err => {
            request.error("There is an error : ", err.toString());
        })
 
        // Step - 5 : Return the data
        return returnData;
    })

    this.on("createProduct", async (request, response) => {
 
        // Step - 2 : Get the data which is coming from the API
        const proData = request.data;
 
        // Step - 3 : Instantiate the transaction object
        const objTransaction = cds.tx(request);
 
        // Step - 4 : Insert the record into database
        let returnData = await objTransaction.run([
            INSERT.into(ProductSrv).entries(proData)
        ]).then((resolve, reject) => {
            if (typeof(resolve) !== undefined) {
                return request.data;
            } else {
                request.error(500, "Error in inserting data into the database");
            }
        }).catch(err => {
            request.error("There is an error : ", err.toString());
        })
 
        // Step - 5 : Return the data
        return returnData;
    })

    this.on('updateEmployee', async (request, response) => {

    const {
        ID,
        salaryAmount,
        Currency_code
    } = request.data;

    try {

        const objTransaction = cds.tx(request);

        await objTransaction.update(EmployeeSrv).with({
            salaryAmount: salaryAmount,
            Currency_code: Currency_code
        }).where({
            ID: ID
        });

        return "Successfully updated.";

    } catch (error) {

        request.error("Error : ", error);

    }

});

this.on("updateProduct", async (request, response) => {

    const {
        NODE_KEY,
        PRICE,
        CURRENCY_CODE
    } = request.data;

    try {

        const objTransaction = cds.tx(request);

        await objTransaction.update(ProductSrv).with({
            PRICE: PRICE,
            CURRENCY_CODE: CURRENCY_CODE
        }).where({
            NODE_KEY: NODE_KEY
        });

        return "Successfully updated.";

    } catch (error) {

        request.error("Error : ", error);

    }

});

this.on("createBusinessPartner", async (request) => {

    const bpData = request.data;

    const objTransaction = cds.tx(request);

    let returnData = await objTransaction.run([
        INSERT.into(BusinessPartnerSrv).entries(bpData)
    ]).then((resolve) => {

        if (typeof(resolve) !== undefined) {
            return request.data;
        } else {
            request.error(500, "Error in inserting data into the database");
        }

    }).catch(err => {
        request.error("There is an error : " + err.toString());
    });

    return returnData;
});

this.on('deleteEmployee', async (request, response) => {

    const {
        ID
    } = request.data;

    try {

        const objTransaction = cds.tx(request);

        await objTransaction.delete(EmployeeSrv).where({
            ID: ID
        });

        return "Successfully deleted.";

    } catch (error) {

        request.error("Error : ", error);

    }

});

    this.before('UPDATE',EmployeeSrv,async(request,response) =>{
        const salaryAmount=request.data.salaryAmount;
        if(salaryAmount >100000){
            request.error(500,'Please get the approval from your line manager');
        }
 
    })

    this.before('UPDATE', PurchaseOrderSrv, async (req) => {
 
        const grossAmt = req.data.Gross_Amt;
        const currency = req.data.CURRENCY_code;
 
        if (currency === 'USD' && grossAmt > 15000) {
        req.error(400, 'Please contact your Line Manager.');
        }
        if (currency === 'EUR' && grossAmt > 10000) {
            req.error(400, 'Please contact your Regional Head.');
        }
 
        });

    this.before('UPDATE', PurchaseItemSrv, async (request, response) => {

    const itemPos = request.data.PO_ITEM_POS;

    if (isNaN(itemPos)) {
        request.error(500, 'Item Position should be a number');
    }

    if (itemPos % 10 !== 0) {
        request.error(500, 'Line items should be multiples of 10');
    }

})

    this.before('UPDATE', 'EmployeeSrv', async (req) => {
 
    const mobile = req.data.phoneNumber;
 
    if (mobile) {
 
        const isValidCountryCode =
            mobile.startsWith('+1')
            mobile.startsWith('+44');    
 
        if (!isValidCountryCode) {
            req.error(
                400,
                'We cannot update the mobile number. Only US and GB country codes are allowed.'
            );
        }
    }
    });

    this.before('UPDATE', BusinessPartnerSrv, async (request, response) => {

    const companyName = request.data.COMPANY_NAME;

    if (companyName && /^[,.-]/.test(companyName.trim())) {
        request.error(400, 'Invalid company name');
    }

});

    this.before('UPDATE',AddressSrv,async(req)=>{
    const address =req.data;
    const adin = await SELECT.one.from(AddressSrv).where({NODE_KEY: address.NODE_KEY})
    if(adin == "GB" || adin=="US"){
       
            req.error(500,"it is already "+adin);
       
    }
    else{
        if(address.COUNTRY!="GB" && address.COUNTRY!="US"){
                req.error(500,"it cannot be "+address.COUNTRY);
       
        }
    }
   
});

    // Implementation of Custom function
this.on('getHighestSalariedEmployees', async (request, response) => {

    try {

        // Step - 1 : Create an object for the transaction
        const transation = cds.tx(request);

        // Step - 2 : Get salaries of an employee using Transaction object
        const response = await transation.read(EmployeeSrv).orderBy({
            salaryAmount: 'desc'
        }).limit(10);

        // Step - 3 : Display the employee salaries
        return response;

    } catch (error) {
        request.error("Error : ", error)
    }

})

    // Implementation of Custom Function
this.on('getHighestPricedProduct', async (request, response) => {

    try {

        // Step 1: Create transaction object
        const transaction = cds.tx(request);

        // Step 2: Read products ordered by PRICE descending
        const responseData = await transaction.read(ProductSrv).orderBy({
            PRICE: 'desc'
        }).limit(10);

        // Step 3: Return highest priced products
        return responseData;

    } catch (error) {

        request.error("Error :", error);

    }

});

    this.on('discountPrice', async(request, response) => {

    try {

        // Step-1 : Get the parameter form the entity
        const ID = request.params[0];

        // Step-2 : Creating object for transaction service using request
        const transaction = cds.tx(request);

        // Step-3 : Update the purchase order service
        await transaction.update(PurchaseOrderSrv).with({
            GROSS_AMOUNT : {
                '-=' : 1000
            },
            NET_AMOUNT : {
                '-=' : 800
            },
            TAX_AMOUNT : {
                '-=' : 200
            }
        }).where(ID)

        const updatePOInfo = await transaction.read(PurchaseOrderSrv);

        return updatePOInfo;

    } catch (error) {
        return "Error : " + error.toString();
    }

})

    this.on('largestOrder', async(request, response) => {

    try {

        // Step-2 : Creating object for transaction service using request
        const transaction = cds.tx(request);

        const reply = await transaction.read(PurchaseOrderSrv).orderBy({
            GROSS_AMOUNT : 'desc'
        }).limit(5);

        return reply;

    } catch (error) {
        return "Error : " + error.toString();
    }

})

    this.on('increasePrice', async (request) => {

    try {

        const ID = request.params[0];
        const tx = cds.tx(request);

        await tx.update(ProductSrv)
            .with({
                PRICE: { '*=': 1.10 }
            })
            .where(ID);

        return await tx.run(
            SELECT.one.from(ProductSrv).where(ID)
        );

    } catch (error) {
        request.error(500, error.toString());
    }

});

    this.on('getTop20Products', async (request) => {

    try {

        const transaction = cds.tx(request);

        const reply = await transaction
            .read(ProductSrv)
            .orderBy({
                PRICE: 'desc'
            })
            .limit(20);

        return reply;

    } catch (error) {
        return "Error : " + error.toString();
    }

});

    this.on('increaseSalary', async (request) => {

    try {

        // Step 1: Get Employee Key
        const ID = request.params[0];

        // Step 2: Create Transaction
        const transaction = cds.tx(request);

        // Step 3: Increase Salary by 15%
        await transaction.update(EmployeeSrv).with({
            salaryAmount: {
                '*=': 1.15
            }
        }).where(ID);

        // Step 4: Return Updated Employee
        const updatedEmployee = await transaction.read(EmployeeSrv).where(ID);

        return updatedEmployee[0];

    } catch (error) {

        return "Error : " + error.toString();

    }

});

    this.on('getTop20HighestPaidEmployees', async (request) => {

    try {

        const transaction = cds.tx(request);

        const reply = await transaction
            .read(EmployeeSrv)
            .orderBy({
                salaryAmount: 'desc'
            })
            .limit(20);

        return reply;

    } catch (error) {

        return "Error : " + error.toString();

    }

});

    // Utility Variables
this.on('getUtilities', async (request, response) => {

    let vUUID = uuid(),
        vPackageContent = null,
        vInput = "%EA%A4%A",
        uri,
        dirExists = false,
        isFileExists = false;

    // Exists
    if (exists('srv/request.http')) {
        isFileExists = true;
    }

    // Is directory exists or not
    if (isdir('app')) {
        dirExists = true;
    }

    // Decode URI
    try {
        uri = decodeURI(vInput);

        // Make Directory
        await mkdirp('srv/lib');

    } catch {
        uri = vInput;
    }

    vPackageContent = await read('package.json');

    // Final Value
    var finalValue = {
        uuid: vUUID,
        uri: uri,
        isFileExists: isFileExists,
        dirExists: dirExists,
        packageInfo: vPackageContent
    };

    return finalValue;
});

})