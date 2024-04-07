Languajes: | [Spanish](./README-es.md) |

## HiInit Web Terminal v0.1 &middot; [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

      ___ ___  .___ .___  _______   .___ ___________     __      __        ___                    _______      _______        
     /   |   \ |   ||   | \      \  |   |\__    ___/    /  \    /  \  ____ \_ |__           ___  _\   _  \     \   _  \     
    /    ~    \|   ||   | /   |   \ |   |  |    |       \   \/\/   /_/ __ \ | __ \          \  \/ /  /_\  \    /  /_\  \    
    \    Y    /|   ||   |/    |    \|   |  |    |        \        / \  ___/ | \_\ \          \   /\  \_/   \   \  \_/   \   
     \___|_  / |___||___|\____|__  /|___|  |____|         \__/\  /   \___   |___  /           \_/  \_____  / /\ \_____  /   
           \/                    \/                            \/        \/     \/                       \/  \/       \/    
<br>

> HiInit is a `file and data upload web terminal` with the ability to register and log in users in different groups and categories.
> Files can be shared between different members of a specific group as well as navigate between the different folders that make up the root.
> There will be different roles with their corresponding permissions but only **ADMIN** user has the `CRUD System` (create, rewrite, update & delete).

- Last update: 26/03/2024

## INDEX

- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README.md#resume">Resume</a>
- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README.md#type-of-users">Types of User</a>
- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README.md#cases---functions">Cases - Functions</a>
- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README.md#data-model">Data Model</a>
- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README.md#commands">Commands</a>
- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README.md#figma---stories">Figma - Stories</a>

## RESUME

`For HiInit v0.1`
- [x] Terminal web with local files and drive online services.
- [x] Personal desktop for each user.
- [x] Use `MULTER` librery and `FS` package from NodeJS on API to upload files with HTTP request and save files on disk storage `npm i multer`
- [x] Upload and download files.
- [x] Fully CRUD system
- [x] First version to final proyect ISDI CODERS.

<br>

`For HiInit v1.0`
- [ ] Using AWS for cloud or remote file hosting
- [ ] Use MongoDB ATLAS to store BBD in the cloud
- [ ] Organization and creation of folders
- [ ] Add staff groups/roles
- [ ] Assign more groups to users
- [ ] In construction ... ⏳

## TYPE OF USERS

- Guest: First entry without log - Orange color
- User: Regular user - Blue color
- Root: Administrator - Red color

## CASES - FUNCTIONS 

`GUEST`

- First view | Register or Login | Exit | Help

`REGULAR USER`

- Create and manage own files & folders | Upload & download files | Modify your data | Help

`ROOT - ADMIN`

- Manage users | CRUD system | All files & folders | Permissions | Groups | Help

## DATA MODEL

`USER`

- id
- username
- email
- password
- group (ref: Group.id)
- role (type: String, enum: [ guest, regular, admin ])

`GROUP`

- id
- name

`COMMAND`

- id
- name
- description

`FILE`

- id
- name
- owner (ref: User.id)
- type (type: String, enum: [ file, folder ])
- parent (ref: File.id)
- permissions (type: Number, enum: [ 0, 2, 3 ])

## COMMANDS

## | TYPE - GUEST |

- First entry on "INITIAL PAGE"

|   Commands  | Function                                                   |
|  ---------  | --------                                                   | 
|  `register` | *Register user with `{ username, email and password }`*    |
|   `login`   | *Log HiInit with credentials `{ email and password }`*     |
|    `help`   | *Only **list** the commands with names & functions*        |
|    `exit`   | *Get back on `initial page`*                               |

## | TYPE - USER |

|   Commands  | Function                                                   |
|  ---------  | --------                                                   |
|    `pwd`    | *`Show` the actual directory*                              |
|     `ls`    | *List the `files on the directory`*                        |
|  `desktop`  | *Redirects user to their `Desktop' folder`*                |
|  `download` | *`Download` the specific file or document*                 |
|   `upload`  | *`Upload` the specific file or document*                   |
|   `delete`  | *`Delete` their own files*                                 |
|    `help`   | *Only **list** the commands with names & functions*        |
|    `exit`   | *Exit and `get back` to initial page*                      |


## | TYPE - ADMIN (ROOT) |

|   Commands  | Function                                                   |
|  ---------  | --------                                                   |
|    `sudo`   | *Entry on `ADMINISTRATOR` mode*                            |
|    `pwd`    | *`Show` the actual directory*                              |
|     `ls`    | *List the `files on the directory`*                        |
|  `desktop`  | *Redirects user to their `Desktop' folder`*                |
|  `download` | *`Download` the specific file or document*                 |
|   `upload`  | *`Upload` the specific file or document*                   |
|   `delete`  | *`Delete` their own files*                                 |
|    `help`   | *Only **list** the commands with names & functions*        |
|    `exit`   | *Exit and `get back` to initial page*                      |

## FIGMA - STORIES

`INITIAL PAGE`

![INICIAL](https://github.com/b00tc4mp/isdi-parttime-202309/assets/133054841/4a4d3c48-c489-4c9d-9c46-59ef278338e1)

- First entry on APP with contact information: email, GitHub and Linkedin profile.
- Format command bar: **guest@hiinit-guest**
- When we press `ENTER` on the initial page, we could entry to Login and Register page with the intrucctions: *"Entry login or register command to switch between the different login and register components"*
- We could write `HELP` command to show us all list guest commands
- With `EXIT` command we could refresh the initial page **only on guest mode**
- Entry the next component -> **LOGIN | REGISTER**

<br>

`REGISTER -> On "GUEST" Mode`

![REGISTER](https://github.com/b00tc4mp/isdi-parttime-202309/assets/133054841/0cfbb82d-5257-40a3-8a35-1a8cef199e06)

- ***register => username + email + password***
- Once we could register on web, the text will disappear and create a new command bar to entry the logg in
- Interface error system: showing errors through screen elements (HTML)
- Entry the next component -> **LOGIN**
  
<br>

`LOGIN -> On "GUEST" Mode`

![LOGIN](https://github.com/b00tc4mp/isdi-parttime-202309/assets/133054841/d9098538-35ae-4b73-8446-409f4cea064c)

- ***login => email + password***
- When we entry our credentials, the command bar show us our username next to the category `user` or `admin` with its own group color
- Interface error system: showing errors through screen elements (HTML) & shell command message 'not found'
- Entry the next component -> **DESKTOP**
  
<br>

`DESKTOP -> On "USER" logged`

![desktop](https://github.com/b00tc4mp/isdi-parttime-202309/assets/133054841/f525a6f5-fcd3-4c07-a7f0-da5a36d5220f)

- Only entry with logged
- Group `localhost` by default
- Command bar format: **username@group-role** 
- Whith `pwd` command will tell us the fully address from root directory: `C:\Desktop`
- They could see their commands with `help` command 
- We can attach or upload files with `upload` command and `download` the own one
- The `permissions` are related to the type of group established by ADMIN
- Users from the same group could `see files from each other` and `download them`
- On `Profile page`, users would modify their `email or password account`
- In all cases, we have the `exit` command to return to **INITIAL PAGE**

<br>

`ADMINISTRATOR -> On "ADMIN" logged`

![SUDO](https://github.com/b00tc4mp/isdi-parttime-202309/assets/133054841/6088b75e-d89f-4085-bb53-435054f38f93)

- Group `root` by default
- Only entry with ADMIN logged with command `sudo`
- The **ADMIN** could `create, delete or update GROUPS` and `assign users` on them
- They can also list users and `delete them`
- They have the possibility of `creating` another **ADMIN** (they wont be able to eliminate each other)

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
