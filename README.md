# mngpw
mngpw is simple cli password manager made with Deno TypeScript.

## install
```
$ deno install mngpw https://raw.githubusercontent.com/kshiva1126/mngpw/master/mngpw.ts --allow-write --allow-read --allow-env --allow-run
$ mngpw --init
```

## demonstration
```
$ mngpw --init
The file already exists, will you overwrite it? [yN]
y
/home/kshiva1126/.mngpw file created successfully!
$ mngpw -s --key test -u user -p password
$ mngpw -d --key test
┌──────────┬────────────┐
│ (index)  │   Values   │
├──────────┼────────────┤
│   key    │   "test"   │
│   user   │   "user"   │
│ password │ "password" │
└──────────┴────────────┘
$ mngpw --update --key test -u user2
$ mngpw -d --key test
┌──────────┬────────────┐
│ (index)  │   Values   │
├──────────┼────────────┤
│   key    │   "test"   │
│   user   │  "user2"   │
│ password │ "password" │
└──────────┴────────────┘
$ mngpw --store --key test3 --user user3 --password blahblahblah
$ mngpw --all
┌─────────┬─────────┬─────────┬────────────────┬────────┐
│ (index) │   key   │  user   │    password    │ Values │
├─────────┼─────────┼─────────┼────────────────┼────────┤
│    0    │ "test"  │ "user2" │   "password"   │        │
│    1    │ "test3" │ "user3" │ "blahblahblah" │        │
└─────────┴─────────┴─────────┴────────────────┴────────┘
$ mngpw --copy --key test3
password : blahblahblah
Copy to clipboard!
$ cat ~/.mngpw
[
  {
    "key": "test",
    "user": "user2",
    "password": "password"
  },
  {
    "key": "test3",
    "user": "user3",
    "password": "blahblahblah"
  }
]%
```
