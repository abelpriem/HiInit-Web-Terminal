# API - HIINIT v0.1

## GUEST REQUEST

`Retrieve Guest` ✅
- Request: GET /guest
- Response: 200 "Content-Type": application/json { username, [ group ], [ role ] }
- Response (error) : 500|404|406 "Content-Type": application/json { error, message }

## USER REQUEST

`Register User` ✅
- Request: POST /users "Content-Type": application/json { name, email, password }
- Response: 201
- Response (error) : 500|409|406 "Content-Type": application/json" { error, message }

`Authenticate User` ✅
- Request: POST /users/auth "Content-Type": application/json { email, password }
- Response: 200 "Content-Type": application/json { userId }
- Respone (error): 500|404|406|409 "Content-Type": application/json { error, message }

`Retrieve User` ✅
- Request: GET /users Authorization: Bearer ${session.token}
- Response: 200 "Content-Type": application/json { username, [ group ], [ role ] }
- Response (error) : 500|404|406 "Content-Type": application/json { error, message }

`Change Email` ✅
- Request: PATCH /users/email Authorization: Bearer ${session.token}
- Response: 200
- Response (error) : 500|404|406|409 "Content-Type": application/json { error, message }

`Change Password` ✅
- Request: PATCH /users/password Authorization: Bearer ${session.token}
- Response: 200
- Response (error) : 500|404|406|409 "Content-Type": application/json { error, message }

`Upload Files` ✅
- Request: POST /upload "Contet-Type": multipart/form-data Authorization: Bearer ${session.token}
- Response: 201
- Response (error) : 500|404|406|409 "Content-Type": multipart/form-data { error, message }

`Retrieve Files` ✅
- Request: GET /download Authorization: Bearer ${session.token}
- Response: 200 "Content-Type": application/json { filename, filetype }
- Respose (error): 500 "Content-Type": application/json { error, message }

`Download Files` ✅
- Request: GET /download/:fileId Authorization: Bearer ${session.token}
- Response: 201
- Response (error) : 500|404|406|409 "Content-Type": multipart/form-data { error, message }

`Delete Files` ✅
- Request: GET /download/delete/:fileId Authorization: Bearer ${session.token}
- Response: 201
- Response (error) : 500|404|406|409 "Content-Type": multipart/form-data { error, message }

`Retrieve Commands` ✅
- Request: GET /commands Authorization: Bearer ${session.token}
- Response: 200 "Content-Type": application/json { command_NAME }
- Respose (error): 500 "Content-Type": application/json { error, message }

## ADMIN

`Register Admin` ✅
- Request: POST /admin Authorization: Bearer ${session.token}
- Response: 201 "Content-Type": application/json { username, email, password }
- Response (error) : 500|409|406|401 "Content-Type": application/json { error, message } 

`Retrieve All User` ✅
- Request: GET /admin/users/all Authorization: Bearer ${session.token}
- Response: 200 
- Response (error) : 500|404|406 "Content-Type": application/json { error, message }

`Retrieve All Groups` ✅
- Request: GET /admin/groups/all Authorization: Bearer ${session.token}
- Response: 200 
- Response (error) : 500|404|406 "Content-Type": application/json { error, message }

`Delete User` ✅
- Request: DELETE /admin/users/:userId Authorization: Bearer ${session.token}
- Response: 200 
- Response (error): 500|404|406|401 "Content-Type": application/json { error, message }

`Create Commands` ✅ (PENDING v1.0)
- Request: POST /admin/commands Authorization: Bearer ${session.token}
- Response: 201 "Content-Type": application/json { command_name }
- Response (error) : 500|409|406|401 "Content-Type": application/json { error, message } 

`Create Groups` ✅
- Request: POST /admin/groups Authorization: Bearer ${session.token}
- Response: 201 "Content-Type": application/json { group_name }
- Response (error) : 500|409|406|401 "Content-Type": application/json { error, message } 

`Assign Groups` ✅
- Request: PATCH /admin/groups/edit Authorization: Bearer ${session.token}
- Response: 200
- Response (error) : 500|409|406|401 "Content-Type": application/json { error, message } 

`Delete Groups` ✅
- Request: DELETE /admin/groups/delete/:groupId Authorization: Bearer ${session.token}
- Response: 200
- Response (error) : 500|409|406|401 "Content-Type": application/json { error, message }