
class Employee {
    constructor(name, age, salary) {
        this._name = name;
        this._age = age;
        this._salary = salary;
    }
    // Гетери
    get name() {
        return this._name;
    }
    get age() {
        return this._age;
    }
    get salary() {
        return this._salary;
    }
    get everything(){
        return {
            name: this._name,
            age: this._age,
            salary: this._salary
        };
    
    }
    // Сеттери
    set name(value) {
        this._name = value;
    }
    set age(value) {
        this._age = value;
    }
    set salary(value) {
        this._salary = value;
    }
}
class Programmer extends Employee {
    constructor(name, age, salary, lang) {
        super(name, age, salary);
        this._lang = lang;
    }
    get lang() {
        return this._lang;
    }
    set lang(value) {
        this._lang = value;
    }
    // Перезаписані
    get salary() {
        return this._salary * 3;
    }
    get everything(){
        return {
            name: this._name,
            age: this._age,
            salary: this.salary, 
            lang: this._lang
        };
    }

}

const programmer1 = new Programmer('John', 30, 1000, ['JavaScript', 'Python']);
const programmer2 = new Programmer('Jane', 25, 1200, ['Java', 'C#']);

console.log(programmer1.everything);
// { name: 'John', age: 30, salary: 3000, lang: ['JavaScript', 'Python'] }
console.log('2')
console.log(programmer2.everything);
// { name: 'Jane', age: 25, salary: 3600, lang: ['Java', 'C#'] }