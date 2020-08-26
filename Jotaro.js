// Задаем функцию для проверки возраста
function checkAge() {
 if (age > 17) {
 	return true;
 } else {
 	return confirm('HOHO')
 }
}

let age = prompt('How old are u?');

if (checkAge(age)) {
	alert('Jotaro')
} else {
	alert('Dio')
}