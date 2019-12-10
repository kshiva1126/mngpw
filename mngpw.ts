import * as flags from 'https://deno.land/std/flags/mod.ts'
import { readFileStr } from 'https://deno.land/std/fs/read_file_str.ts'
import { writeJson } from 'https://deno.land/std/fs/write_json.ts'
import { clipboard } from 'https://deno.land/x/clipboard/mod.ts';

type FlagsType = {
  key?: string;
  u?: string;
  user?: string;
  p?: string;
  password?: string;
  s?: boolean;
  store?: boolean;
  d?: boolean;
  display?: boolean;
  init?: boolean;
  update?: boolean;
  all?: boolean;
  copy?: boolean;
}

type jsonType = {
  key: string;
  user: string;
  password: string;
}

main();

async function main () {
  const { key, u, user, p, password, s, store, d, display, init, update, all, copy } = flags.parse(Deno.args) as FlagsType;

  if (all) {
    await displayAll().catch(err => console.log(err));
    return;
  }

  if (s || store) {
    if ((key) && (u || user) && (p || password)) {
      const user_val: string = u ? u : user;
      const password_val: string = p ? p : password;
      await register(key, user_val, password_val);
      return;
    }
    console.log('Please choose -s option with --key, -u and -p options');
    return;
  }

  if (d || display) {
    if (key) {
      await show(key).catch(err => console.log(err));
      return;
    }
    console.log('Please choose -d option with --key option.');
    return;
  }

  if (update) {
    if ((key) && ((u || user) || (p || password))) {
      const user_val: string = u ? u : user;
      const password_val: string = p ? p : password;
      await updateJson(key, user_val, password_val).catch(err => console.log(err));
      return;
    } else {
      console.log('Please choose --update option with -u or -p options')
    }
  }

  if (copy) {
    if (key) {
      await copyToClipboard(key).catch(err => console.log(err));
      return;
    } else {
      console.log('Please choose --copy option with --key option')
    }
  }

  if (init) {
    await initFile();
    return;
  }

  console.log('Please choose -s, -d, --update or --init');
}

async function displayAll() {
  const dotfile = `${Deno.homeDir()}/.mngpw`;
  const json = await readFileStr(dotfile, {encoding: 'utf-8'}).catch(() => {
    throw '.mngpw file is not found'
  });
  const arr: jsonType[] = json && typeof json == 'string' ? JSON.parse(json) : new Array();
  if (arr) {
    console.table(arr);
  } else {
    console.log('Could not find password to display');
  }
}

async function register(key: string, user: string, password: string) {
  const dotfile = `${Deno.homeDir()}/.mngpw`;
  const json = await readFileStr(dotfile, {encoding: 'utf-8'}).catch(() => createDot());
  const arr: jsonType[] = json && typeof json == 'string' ? JSON.parse(json) : new Array();
  // JSONに登録する
  const obj: jsonType = {key, user, password};
  arr.push(obj);
  const uniqArr = arr.filter((x, i, self) => (
    self.findIndex(y => y.key === x.key) === i
  ));
  writeJson(dotfile, uniqArr, {spaces: 2});
}

async function show(key: string) {
  // JSONからkeyに合致したuser:passwordを出力する
  const dotfile = `${Deno.homeDir()}/.mngpw`;
  const json = await readFileStr(dotfile, {encoding: 'utf-8'}).catch(() => {
    throw '.mngpw file is not found'
  });
  const arr: jsonType[] = json && typeof json == 'string' ? JSON.parse(json) : new Array();
  const result = arr.find(item => item.key === key);
  if (result) {
    console.table(result);
  } else {
    console.log('The password corresponding to key is not found');
  }
}

async function updateJson(key: string, user: string, password: string) {
  const dotfile = `${Deno.homeDir()}/.mngpw`;
  const json = await readFileStr(dotfile, {encoding: 'utf-8'}).catch(() => {
    throw '.mngpw file is not found'
  });
  const arr: jsonType[] = json && typeof json == 'string' ? JSON.parse(json) : new Array();
  const target = arr.find(item => item.key === key);
  if (target) {
    const newArr = arr.filter(obj => obj.key !== target.key);
    if (user) target.user = user;
    if (password) target.password = password;
    newArr.push(target);
    writeJson(dotfile, newArr, {spaces: 2});
  } else {
    console.log('The password corresponding to key is not found');
  }
}

async function copyToClipboard(key: string) {
  const dotfile = `${Deno.homeDir()}/.mngpw`;
  const json = await readFileStr(dotfile, {encoding: 'utf-8'}).catch(() => {
    throw '.mngpw file is not found'
  });
  const arr: jsonType[] = json && typeof json == 'string' ? JSON.parse(json) : new Array();
  const result = arr.find(item => item.key === key);
  if (result) {
    await clipboard.writeText(result.password);
    console.log(`password : ${result.password}`)
    console.log('Copy to clipboard!')
  } else {
    console.log('The password corresponding to key is not found');
  }
}

async function initFile() {
  const dotfile = `${Deno.homeDir()}/.mngpw`;
  readFileStr(dotfile)
  .then(() => {
    getInput();
  })
  .catch(() => {
    createDot();
  })
}

async function getInput() {
  const buf = new Uint8Array(1024);
  const msg = 'The file already exists, will you overwrite it? [yN]';
  console.log(msg);
  const n = await Deno.stdin.read(buf); 
  if (n == Deno.EOF) {
    console.log("Standard input closed")
  } else {
    const input = new TextDecoder().decode(buf.subarray(0, n-1));
    await checkInput(input);
  }
}

async function createDot() {
  const dotfile = `${Deno.homeDir()}/.mngpw`;
  const encoder = new TextEncoder();
  const data = encoder.encode();
  await Deno.writeFileSync(dotfile, data, {create: true});
  console.log(`${dotfile} file created successfully!`);
}

async function checkInput(input: string) {
  switch (input) {
    case 'y':
    case 'yes':
    case 'Y':
    case 'YES':
    case '1':
      await createDot();
      break;

    case 'n':
    case 'no':
    case 'N':
    case 'NO':
    case '0':
      break;
    default:
      console.log('Please input y or n');
      await getInput();
      break;
  }
}
