#!/usr/bin/env node

/*
მსმენელი აწყობს expense manager cli აპლიკაციას, რომელსაც ექნება შემდეგი ფუნქციონალი
ხარჯის ობიექტის დამატება
ხარჯის ობიექტის წაშლა
ხარჯის ობიექტის მოძიება თარიღით, კატეგორიით

ფუნქციონალი, რაც უნდა იყოს გამოყენებული:
Fs,path მოდულები ფაილებთან,დირექტორებთან სამუშაოდ
json.stringify/parse მეთოდები 
https://www.npmjs.com/package/commander ბიბლიოთეკა არგუმენტების წასაკითხად.

მოსალოდნელი ფუნქციონალი:
Cli არგუმენტით create-expense total, category, date უნდა შეიქმნას ახალი ხარჯის ობიექტი და დაიწეროს json ფაილში
Cli არგუმენტით search-expense category=”shopping” მოძიებულ უნდა იქნეს შესაბამისი ხარჯი და დაიბეჭდოს ტერმინალში
Cli არგუმენტით delete-expense id=1 მოძიებულ უნდა იქნეს შესაბამისი ხარჯი და წაიშალოს მონაცმები.
*/

const { Command } = require("commander");
const fs = require("fs").promises;
const path = require("path");
const program = new Command();

program
  .command("create")
  .description("create new expense")
  .argument("<total>", "total expense")
  .argument("<category>", "")
  .argument("<date>", "")
  .action((total, category, date) => {
    fs.readFile("./data.json", "utf-8").then((data) => {
      let expenseManager = [];
      if (data) {
        expenseManager = JSON.parse(data);
      }
      const expense = {
        id: expenseManager.length + 1,
        total,
        category,
        date,
      };
      expenseManager.push(expense);
      const json = JSON.stringify(expenseManager, null, 2);
      fs.writeFile("./data.json", json);
    });
  });

program
  .command("search")
  .description("search expense")
  .argument("<category>", "")
  .action((category) => {
    fs.readFile("./data.json", "utf-8")
      .then((res) => JSON.parse(res))
      .then((data) => {
        const index = data.findIndex((exp) => exp.category === category);
        if (index === -1) {
          console.log("Category doesn't exists");
        }
        const expense = data[index];
      })
      .catch((err) => {
        console.log(err);
      });
  });
program
  .command("delete")
  .description("delete expense")
  .argument("<id>", "")
  .action((id) => {
    fs.readFile("./data.json", "utf-8")
      .then((res) => JSON.parse(res))
      .then((data) => {
        const filteredData = data.filter((exp) => exp.id !== parseInt(id));
        const json = JSON.stringify(filteredData, null, 2);
        fs.writeFile("./data.json", json);
        console.log("Expense Deleted");
      })

      .catch((err) => {
        console.log(err);
      });
  });

program.parse();
