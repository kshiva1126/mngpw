import * as flags from 'https://deno.land/std@v0.25.0/flags/mod.ts'
import * as read_file_str from 'https://deno.land/std@v0.25.0/fs/read_file_str.ts'

type FlagsType = {
  keyword?: string;
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
  keyword: string;
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

async function getInput() {
  const buf = new Uint8Array(1024);
  console.log('The file already exists, will you overwrite it? [y/n]');
  const n = await Deno.stdin.read(buf); 
  if (n == Deno.EOF) {
    console.log("Standard input closed")
  } else {
    const input = new TextDecoder().decode(buf.subarray(0, n-1));
    await checkInput(input);
  }
}

async function initFile() {
  const dotfile = `${Deno.homeDir}/.mngpw`;
  read_file_str.readFileStr(dotfile)
  .then(() => {
    getInput();
  })
  .catch(() => {
    createDot();
  })
}

function register(keyword: string, user: string, password: string) {
  console.log(keyword, user, password);
  // JSONに登録する
}

function show(keyword: string) {
  console.log(keyword);
  // JSONからkeywordに合致したuser:passwordを出力する
}

async function main () {
  const { keyword, u, user, p, password, s, store, d, display, init } = flags.parse(Deno.args) as FlagsType;

  if (s || store) {
    if ((keyword) && (u || user) && (p || password)) {
      const user_val: string = u ? u : user;
      const password_val: string = p ? p : password;
      register(keyword, user_val, password_val);
      return;
    }
    console.log('Please choose -s option with --keyword, -u and -p options');
    return;
  }

  if (d || display) {
    if (keyword) {
      show(keyword);
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