db.users.insertMany([{
  "id": 1,
  "username": "admin",
  "password": "admin",
  "isAdmin": true,
  "fullname": "Admin"
},
{
  "id": 2,
  "username": "john",
  "password": "john",
  "isAdmin": false,
  "fullname": "John Wong"
},
{
  "id": 3,
  "username": "peter",
  "password": "peter",
  "isAdmin": false,
  "fullname": "Peter Chan"
}
]);