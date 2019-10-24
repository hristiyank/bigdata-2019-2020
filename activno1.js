///////////// activni uprajneniq

use stu_1801321085

// zad1
var dbw = {
	insert : function (document) {
		if(!document.model) {
			print ('property model is required');
			return;
		}

		if(!document.number) {
			print ('property name is required');
			return
		}
		db.vehicles.insert(document);
	}
};

dbw.insert({ model: 'Ferrari', number : 1991});
dbw.insert({ model: 'Maserati', number : 1992});
dbw.insert({ model: 'Lamborghini', number : 1993});
dbw.insert({ model: 'Mercedes', number : 1994});
dbw.insert({ model: 'BMW', number : 1995});

//zad2
db.vehicles.update({model : 'Ferrari'}, { $set: {"seats": 2}});
db.vehicles.update({model : 'Maserati'}, { $set: {"seats": 4}});
db.vehicles.update({model : 'Lamborghini'}, { $set: {"seats": 2}});
db.vehicles.update({model : 'Mercedes'}, { $set: {"seats": 5}});
db.vehicles.update({model : 'BMW'}, { $set: {"seats": 5}});

//zad3

var dbw2 = {
	insert : function (document) {
	if(!document.tovar) {
	print ('property tovar is required');
	return;
	}
	if(!document.kategoriq) {
	print ('property kategoriq is required');
	return;
	}
	if(!document.kolichestvo) {
	print ('property kolichestvo is required');
	return;
	}

	if (!document.vehiclenumber) {
		print ('property vehiclenumber is required');
		return;
		}
		var number = db.vehicles.find({"number": document.vehiclenumber }).toArray();
		if(! (number.lenght > 0))
			{
			print ('property vehiclenumber is not in vehicles');
			return;
			}
	 
	db.cargo.insert(document);
	}
	};
