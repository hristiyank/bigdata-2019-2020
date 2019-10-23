use bankDB //Create the database bankDB

//generate departments and positions
var bankDepartments = [
	{
		name: 'Risk Department',
		positions: [
			{
				id: 0,
				name: 'Risk Control Director'
			},
			{
				id: 1,
				name: 'Structural Risk Analyst'
			},
			{
				id: 2,
				name: 'Credit Risk Analyst'
			}
		]
	},
	{
		name: 'Commercial Department',
		positions: [
			{
				id: 0,
				name: 'Head of Business to Client Sales'
			},
			{
				id: 1,
				name: 'Key Account Manager'
			},
			{
				id: 2,
				name: 'Customer Consultant'
			}
		]
	},
	{
		name: 'Finance and Accounting Department',
		positions: [
			{
				id: 0,
				name: 'Head of Finance and Accounting'
			},
			{
				id: 1,
				name: 'Accounts Receivable'
			},
			{
				id: 2,
				name: 'Accounts Payable'
			},
			{
				id: 3,
				name: 'Bussiness Controller'
			},
			{
				id: 4,
				name: 'Financial Analyst'
			}
		]
	}
];

for (i = 0; i < 3; i++) {
	db.departments.insert(bankDepartments[i]);
}

//generate employees
var generateFname = function(){
  var collection = ['Hristiyan','Ivan','Georgi','Petar','Vladimir','Krasimir','Elenko'];
  
  var index = Math.floor(Math.random() * 7);
  return collection[index];
}

var generateMname = function(){
  var collection = ['Dimitrov','Ivanov','Georgiev','Borisov','Vladimirov','Angelov','Vasilev'];
  
  var index = Math.floor(Math.random() * 7);
  return collection[index];
}

var generateLname = function(){
  var collection = ['Kirov','Ivanov','Georgiev','Petrov','Vladimirov','Anev','Elenov'];
  
  var index = Math.floor(Math.random() * 7);
  return collection[index];
}

var generateAddress = function(){
  var streets = ['Slavyanska street','Bogomol street','Iztochen boulevard',
				 'Petko D. Petkov street','Bratya Miladinovi Street',
				 'Stefan Stambolov street','Osvobozhdenie boulevard'];
  
  var streetIndex = Math.floor(Math.random() * 7);
  
  var streetNumbers = ['1','18','6','23','12','54','31'];
  
  var index = Math.floor(Math.random() * 7);
  
  return streetNumbers[index] + ' ' + streets[streetIndex];
}

var generatePhone = function(collection){
  var phones = ['+359888912344','+359877629878','+359889009151',
					'+359878566477','+359899645444','+359887003421',
					'+359888987654', '+359878654321', '+359877123789',
					'+359888223344'];
  
  var index;
  var samePhone;
  do {
	index = Math.floor(Math.random() * 10);
	if (collection == 'employees') {
		samePhone = db.employees.find({phone: phones[index]}).toArray();
	} else {
		samePhone = db.clients.find({phone: phones[index]}).toArray();
	}
  } while (samePhone.length != 0);
  
  return phones[index];
}

var generateMail = function(name){
  var collection = ['gmail.com','abv.bg','mail.bg'];
  
  var index = Math.floor(Math.random() * 3);
  return name.toLowerCase() + '@' + collection[index];
}

var checkName = function(lName, fName, collection){
	var sameName = (collection == 'employees') ? 
		db.employees.find({fName: fName,lName: lName}).toArray() 
		: 
		db.clients.find({fName: fName,lName: lName}).toArray();
			
	var empLength = sameName.length;
	
	if (sameName.length > 0) {
		var mName = generateMname();
		
		for (i = 0; i < empLength; i++) {
			if(! sameName[i].mName) {
				sameName[i].mName = generateMname();
				if (collection == 'employees') {
					db.employees.update({_id:sameName[i]._id}, {$set: {"mName":sameName[i].mName}})
				} else {
					db.clients.update({_id:sameName[i]._id}, {$set: {"mName":sameName[i].mName}})
				}
			}
			
			while (mName == sameName[i].mName) {
				mName = generateMname();
			}
		}
		
		return mName;
	}
	
	return false;
}

var fillEmployees = function(){
	var employeeInfo = {};
	var departments = db.departments.find().toArray();
	var depIndex;
	var posIndex;
	var mName;
	
	for (i = 0; i < 10; i++) {
		employeeInfo.fName = generateFname();
		employeeInfo.lName = generateLname();
		mName = checkName(employeeInfo.fName, employeeInfo.lName, 'employees');
		
		if (mName) {
			employeeInfo.mName = mName;
		}
		
		employeeInfo.address = generateAddress();
		employeeInfo.email = generateMail(employeeInfo['fName']);
		employeeInfo.phone = generatePhone('employees');
		employeeInfo.isManager = (i < 3);
		
		if (employeeInfo.isManager) {
			employeeInfo.departmentId = departments[i]._id;
			employeeInfo.positionId = departments[i]['positions'][0].id;
		} else {
			depIndex = Math.floor(Math.random() * 3);
			posIndex = Math.floor(Math.random() * (departments[depIndex]['positions'].length - 1)) + 1;
			employeeInfo.departmentId = departments[depIndex]._id;
			employeeInfo.positionId = departments[depIndex]['positions'][posIndex].id;
			employeeInfo.managerId = db.employees.find({
				departmentId: employeeInfo.departmentId,
				isManager: true
			}).toArray()[0]._id;
		}
		
		db.employees.insert(employeeInfo);
	}
}

fillEmployees();

//generate Clients
var fillClients = function(){
	var clientInfo = {};
	var mName;
	var account;
	
	for (i = 0; i < 10; i++) {
		clientInfo.fName = generateFname();
		clientInfo.lName = generateLname();
		mName = checkName(clientInfo.fName, clientInfo.lName, 'clients');
		
		if (mName) {
			clientInfo.mName = mName;
		}
		
		clientInfo.address = generateAddress();
		clientInfo.email = generateMail(clientInfo['fName']);
		clientInfo.phone = generatePhone('clients');
		clientInfo.accounts = [];
		
		db.clients.insert(clientInfo);
	}
}

fillClients();

var geneateAccount = function(client){
	var accounts = [
		'BG76RZBB91555946852491', 'BG33BNPA94404324721555', 'BG45TTBB94006686959774',
		'BG83TTBB94008232368231', 'BG86TTBB94009295684699', 'BG48STSA93005446583855',
		'BG14IORT80941936525743', 'BG12UNCR70008416517194', 'BG16RZBB91557826129534',
		'BG44RZBB91552318422664', 'BG40STSA93006126498515', 'BG55BNPA94404881771692',
		'BG95BNPA94409913176589', 'BG05IORT80945773224911', 'BG91BNPA94402123326948',
		'BG23STSA93008522226355', 'BG32RZBB91553378985281', 'BG77STSA93003378582812',
		'BG13TTBB94006641566484', 'BG85IORT80944784422834'
	];
	
	var amounts = [
		100000.00, 23489.98, 345.45, 8009.54, 4500.34,
		6709.99, 8765.76, 800.43, 76.54, 980.45, 0.00,
		34.56, 234.76, 4567.90, 5670.98, 908.88, 9000.87,
		1005.90, 534.78, 8778.90
	];
	
	var currencies = ['BGN', 'USD', 'EUR'];
	var accountIndex;
	var amountIndex;
	var currencyIndex;
	var accountsNumber = Math.floor(Math.random() * 2) + 1;
	var sameAccount = [];
	var account = {};
	
	for (j = 0; j < accountsNumber; j++) {
		do {
			accountIndex = Math.floor(Math.random() * 20);
			amountIndex = Math.floor(Math.random() * 20);
			currencyIndex = Math.floor(Math.random() * 3);
			
			account = {
				account: accounts[accountIndex],
				amount: amounts[amountIndex],
				currency: currencies[currencyIndex]
			};
			
			sameAccount = db.clients.find({"accounts.account": account.account}).toArray();
		} while (sameAccount.length > 0);
		
		db.clients.update(
			{_id: client._id},
			{$addToSet: {"accounts": account}}
		)
	}
}

var fillAccounts = function(){
	var accountsNumber;
	var clients = db.clients.find().toArray();
	var clientsLength = clients.length;
	var client = [];
	
	for (i = 0; i < clientsLength; i++) {
		geneateAccount(clients[i]);
	}
}

fillAccounts();

//Бизнес заявки част 1

//1
db.departments.find({},{name: 1})

//2
//Add salary to employees collection
var addSalaryToEmployees = function(){
	var headOfDepSalary = 3000.00;
	var otherSalaries = [1000.00, 1500.00, 2000.00];
	var index;
	var employees = db.employees.find().toArray();
	var employeesLength = employees.length;
	
	for (i = 0; i < employeesLength; i++) {
		if (employees[i].isManager) {
			db.employees.update({_id:employees[i]._id}, {$set: {"salary": headOfDepSalary}});
		} else {
			index = Math.floor(Math.random() * 3);
			db.employees.update({_id:employees[i]._id}, {$set: {"salary": otherSalaries[index]}});
		}
	}
}

addSalaryToEmployees();

//list employees with salaries
db.employees.find({},{fName: 1, lName: 1, salary: 1})

//3
db.employees.aggregate(
	[
		{
			$project: { 
				fName: 1,
				lName: 1,
				email: {$toLower : {$concat: ["$fName", ".", "$lName", "@bankoftomarow.bg"]}}
			}
		}
   ]
)

//4
//Add years of experiance to employees
var addYearsOfExperiance = function(){
	var years;
	var employees = db.employees.find().toArray();
	var employeesLength = employees.length;
	
	for (i = 0; i < employeesLength; i++) {
		years = Math.floor(Math.random() * 10);
		db.employees.update({_id:employees[i]._id}, {$set: {"yearsOfExperiance": years}});
	}
}

addYearsOfExperiance();

//find employees with more than 5 years of experiance
db.employees.find({yearsOfExperiance: {$gt: 5}})

//5 but with the letter G, because we don`t have names with S
db.employees.find({fName: /^G/})

//6
//Add birth place to employees
var addBirthPlace = function(){
	var birthPlaces = ['Bulgaria', 'Greece', 'Turkey'];
	var employees = db.employees.find().toArray();
	var employeesLength = employees.length;
	var index;
	
	for (i = 0; i < employeesLength; i++) {
		index = Math.floor(Math.random() * 3);
		db.employees.update({_id:employees[i]._id}, {$set: {"birthPlace": birthPlaces[index]}});
	}
}

addBirthPlace();

db.employees.find({birthPlace: {$not: /Bulgaria/}})

//7
db.employees.find({
	$or: [
		{fName: /I/i},
		{lName: /I/i},
		{mName: /I/i}
	]
})



//Бизнес заявки част 2

//1 Add migrations between departments
var fillMigrations = function(){
	var employees = db.employees.find().toArray();
	var departments = db.departments.find().toArray();
	var departmentsHistory = [];
	var empLength = employees.length;
	var haveMore = false;
	var today = new Date(); 
	var fromDate;
	var toDate;
	var random;
	var randomId;
	var randomDay;
	var randomMonth;
	
	for (i = 0; i < empLength; i++) {
		var departmentsHistory = [];
		haveMore = Math.random() < 0.5; //50:50 chance
		
		random = Math.floor(Math.random() * employees[i].yearsOfExperiance);
		randomId = Math.floor(Math.random() * 3);
		randomMonth = Math.floor(Math.random() * 12) + 1;
		randomDay = Math.floor(Math.random() * 28) + 1;
		fromDate = new Date(today.getFullYear() - employees[i].yearsOfExperiance, randomMonth, randomDay);
		
		randomMonth = Math.floor(Math.random() * 12) + 1;
		randomDay = Math.floor(Math.random() * 28) + 1;
		toDate = new Date(fromDate.getFullYear() + random, randomMonth, randomDay);
		departmentsHistory.push({
			departmentId: departments[randomId]._id,
			fromDate: fromDate.getTime(),
			toDate: toDate.getTime(),
		});
		
		if(haveMore) {
			while (haveMore) {
				haveMore = Math.random() < 0.1;
				random = Math.floor(Math.random() * (toDate.getFullYear() - fromDate.getFullYear()));
				fromDate = toDate;randomMonth = Math.floor(Math.random() * 12) + 1;
				randomMonth = Math.floor(Math.random() * 12) + 1;
				randomDay = Math.floor(Math.random() * 28) + 1;
				toDate = new Date(fromDate.getFullYear() + random, randomMonth, randomDay);
				departmentsHistory.push({
					departmentId: departments[randomId]._id,
					fromDate: fromDate.getTime(),
					toDate: toDate.getTime(),
				});
			};
		}
		
		departmentsHistory[departmentsHistory.length - 1].departmentId = employees[i].departmentId;
		delete departmentsHistory[departmentsHistory.length - 1].toDate;
	
		db.migrations.insert({
			employeeId: employees[i]._id,
			departmentsHistory: departmentsHistory
		});
	}
}

fillMigrations();

//2
var twoMonthsAgo = new Date();
twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

db.migrations.find({
	$where: "this.departmentsHistory.length > 1", 
	"departmentsHistory.fromDate": {$gt: twoMonthsAgo.getTime()}
})

//3
db.migrations.find({$where: "this.departmentsHistory.length == 1"})

//Бизнес заявки част 3

//1

//Different statuses
const ACTIVE = 1;
const SICK_LEAVE = 2;
const LEAVE = 3;
const MOTHERHOOD = 4;
const FORMER_EMP = 5;

//Add status to employees
var addStatusToEmployees = function(){
	var employees = db.employees.find().toArray();
	var empLength = employees.length;
	var status;
	
	for (i = 0; i < empLength; i++) {
		status = (Math.random() < 0.5) ? ACTIVE : Math.floor(Math.random() * 4) + 2;
		db.employees.update({_id:employees[i]._id}, {$set: {"status": status}})
	}
}

addStatusToEmployees();

db.employees.find({"status": FORMER_EMP})

//2
db.employees.find({"status": MOTHERHOOD})

//3
db.employees.find({$or: [{"status": SICK_LEAVE}, {"status": LEAVE}]})

//4
db.employees.find({$and: [{"salary": {$gte: 2000}}, {"salary": {$lte: 3000}}]})

//5
db.employees.find({$or: [{"salary": 2500}, {"salary": 3000}, {"salary": 3500}, {"salary": 5000}]})

//6
db.employees.find({"managerId": {$exists: false}})

//7
db.employees.find({"salary": {$gte: 5000}}).sort({"fName": -1})

//8
db.employees.aggregate(
{$sort: {"salary": -1}},
{
	$group: {
		_id: "$departmentId",
		employees: { $push: "$$ROOT" } 
	}
}, 
{ "$project": { 
	"employees": { "$slice": [ "$employees", 5 ] }
}}
)

//9
db.employees.aggregate(
	{
		$group: {
			_id: "$departmentId",
			minTotalSalary: {$sum: "$salary"}
		}
	},
	{$sort: {"minTotalSalary": 1}},
	{$limit: 1}
)

//10
db.employees.aggregate(
	{
		$group: {
			_id: {"departmentId": "$departmentId", "avgSalary": "$avgSalary"},
			avgSalary: {$avg: "$salary"}
		}
	}
)


//Бизнес заявки част 4

//1
db.clients.find({"accounts.currency": {$ne: "BGN"}})

//2
db.clients.find({"accounts.amount": 0})

//3 
var addNameToAccounts = function(){
	var clients = db.clients.find().toArray();
	var clientsLength = clients.length;
	var accountsLength = 0;
	var name = '';

	for (i = 0; i < clientsLength; i++) {
		accountsLength = clients[i].accounts.length;
		
		for (j = 0; j < accountsLength; j++) {
			name = clients[i].fName + ' ' + clients[i].lName + ' Smetka ' + clients[i].accounts[j].currency;
			db.clients.update(
				{"accounts.account": clients[i].accounts[j].account},
				{$set: {"accounts.$.name": name}}
			)
		}
	}
}

addNameToAccounts();
