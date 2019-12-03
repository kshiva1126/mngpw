import * as flags from 'https://deno.land/std@v0.17.0/flags/mod.ts'

type Flags = {
  site?: string;
  u?: string;
  user?: string;
  p?: string;
  password?: string;
  path?: string;
  s?: boolean;
  store?: boolean;
  d?: boolean;
  display?: boolean;
  x?: boolean;
  m?: boolean;
  // allとかあってもいいかも

}

const register = (site: string, user: string, password: string) => {
  console.log(site, user, password);
  // CSVに登録する
}

const show = (site: string) => {
  console.log(site);
  // CSVからsiteに合致したuser:passwordを出力する
}

const exportCSV = () => {
  // CSVをカレントディレクトリに出力する
}

const importCSV = (path: string) => {
  // CSVをインポートする
}

const main = () => {
  const { site, u, user, p, password, path, s, store, d, display, x, m } = flags.parse(Deno.args) as Flags;

  if (s || store) {
    if ((site) && (u || user) && (p || password)) {
      const user_val: string = u ? u : user;
      const password_val: string = p ? p : password;
      register(site, user_val, password_val);
      return;
    }
    console.log('Please choose -s option with -t, -u and -p options');
    return;
  }

  if (d || display) {
    if (site) {
      show(site);
      return;
    }
    console.log('Please choose -d option with -t option.');
  }

  if (x) {
    exportCSV();
    return;
  }

  if (m) {
    if (path) {
      importCSV(path);
      return;
    }
    return;
  }
}

main();