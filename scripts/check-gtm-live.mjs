import { google } from 'googleapis';

const KEY_FILE = './tienda-blama-b9786a6539e4.json';

async function main() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/tagmanager.readonly'],
    });

    const authClient = await auth.getClient();
    const tagmanager = google.tagmanager({
      version: 'v2',
      auth: authClient,
    });

    const ws = tagmanager.accounts.containers.workspaces;
    console.log('All workspaces properties:');
    console.log(Object.getOwnPropertyNames(ws));
    
    console.log('\nAll workspaces prototype properties:');
    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(ws)));

  } catch (error) {
    console.error(error);
  }
}

main();
