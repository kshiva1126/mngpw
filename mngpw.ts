import * as flags from 'https://deno.land/std/flags/mod.ts'
import { readFileStr } from 'https://deno.land/std/fs/read_file_str.ts'
import { writeJson } from 'https://deno.land/std/fs/write_json.ts'

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
  // allとかあってもいいかも

}

type jsonType = {
  key: string;
  user: string;
  password: string;
}

async function createDot() {
  const dotfile = `${Deno.homeDir()}/.mngpw`;
  console.log(dotfile);
  const encoder = new TextEncoder();
  const data = encoder.encode();
  await Deno.writeFileSync(dotfile, data, {create: true});
}

async function checkInput(input: string) {
  console.log(input);
  switch (input) {
    case 'y':
    case 'yes':
    case 'Y':
    case 'YES':
    case '1':
      createDot();
      break;

    case 'n':
    case 'no':
    case 'N':
    case 'NO':
    case '0':
      break;
    default:
      console.log('Please input y or n');
      getInput();
      break;
  }
}

async function getInput(cannot_find = false) {
  const buf = new Uint8Array(1024);
  let msg = 'The file already exists, will you overwrite it? [y/n]';
  if (cannot_find) {
    msg = '.mngpw file cannot find, will you create it? [y/n]';
  }
  console.log(msg);
  const n = await Deno.stdin.read(buf); 
  if (n == Deno.EOF) {
    console.log("Standard input closed")
  } else {
    const input = new TextDecoder().decode(buf.subarray(0, n-1));
    await checkInput(input);
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

async function register(key: string, user: string, password: string) {
  const dotfile = `${Deno.homeDir()}/.mngpw`;
  const json = await readFileStr(dotfile, {encoding: 'utf-8'})
  .catch(() => {
    getInput(true);
  })
  let arr: jsonType[] = typeof json == 'string' ? JSON.parse(json) : new Array();
  // JSONに登録する
  const obj: jsonType = {key, user, password};
  arr.push(obj);
  const uniqArr = arr.filter((x, i, self) => (
    self.findIndex(y => y.key === x.key) === i
  ));
  writeJson(dotfile, uniqArr);
}

function show(key: string) {
  console.log(key);
  // JSONからkeyに合致したuser:passwordを出力する
}

async function main () {
  const { key, u, user, p, password, s, store, d, display, init } = flags.parse(Deno.args) as FlagsType;

  if (s || store) {
    if ((key) && (u || user) && (p || password)) {
      const user_val: string = u ? u : user;
      const password_val: string = p ? p : password;
      register(key, user_val, password_val);
      return;
    }
    console.log('Please choose -s option with --key, -u and -p options');
    return;
  }

  if (d || display) {
    if (key) {
      show(key);
      return;
    }
    console.log('Please choose -d option with -t option.');
  }

  if (init) {
    await initFile();
  }

  const encoder = new TextEncoder();
  const data = encoder.encode('Hello, Deno2!\n');
  await Deno.writeFile('hoge', data);
}

main();