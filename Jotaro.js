// Задаем функцию для проверки возраста
function checkAge() {
 if (age > 18) {
 	return true;
 } else {
 	return confirm('HOHO')
 }
}

let age = prompt('How old are u?', 18);

if (checkAge(age)) {
	alert('Jotaro')
} else {
	alert('Dio')
}