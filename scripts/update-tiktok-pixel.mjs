import { google } from 'googleapis';

const KEY_FILE = './tienda-blama-b9786a6539e4.json';
const ACCOUNT_ID = '6336487505';
const CONTAINER_ID = '242018047';
const TIKTOK_VAR_NAME = 'Lookup - ID TikTok Pixel';
const NEW_TIKTOK_PIXEL_ID = 'D922UFRC77U4748KJP2G';

async function main() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE,
      scopes: [
        'https://www.googleapis.com/auth/tagmanager.edit.containers',
        'https://www.googleapis.com/auth/tagmanager.publish',
        'https://www.googleapis.com/auth/tagmanager.edit.containerversions'
      ],
    });

    const authClient = await auth.getClient();
    const tagmanager = google.tagmanager({
      version: 'v2',
      auth: authClient,
    });

    console.log('--- Iniciando actualización de TikTok Pixel en GTM ---');

    // 1. Obtener todos los workspaces para buscar "Default Workspace"
    const workspacesResponse = await tagmanager.accounts.containers.workspaces.list({
      parent: `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}`
    });
    const workspaces = workspacesResponse.data.workspace || [];
    
    // Buscar "Default Workspace"
    let workspace = workspaces.find(w => w.name === 'Default Workspace');
    if (!workspace && workspaces.length > 0) {
      workspace = workspaces[0];
    }
    
    if (!workspace) {
      throw new Error('No se encontró ningún espacio de trabajo (workspace) en el contenedor de GTM.');
    }

    console.log(`Usando Workspace: "${workspace.name}" (ID: ${workspace.workspaceId})`);
    const workspacePath = `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/workspaces/${workspace.workspaceId}`;

    // 2. Listar todas las variables para buscar "Lookup - ID TikTok Pixel" dinámicamente
    console.log('\n[GTM Variables] Buscando variable por nombre...');
    const variablesResponse = await tagmanager.accounts.containers.workspaces.variables.list({
      parent: workspacePath
    });
    const variables = variablesResponse.data.variable || [];
    
    const tiktokVarInfo = variables.find(v => v.name === TIKTOK_VAR_NAME);
    if (!tiktokVarInfo) {
      throw new Error(`No se encontró la variable "${TIKTOK_VAR_NAME}" en GTM.`);
    }

    console.log(`Encontrada variable "${tiktokVarInfo.name}" (ID: ${tiktokVarInfo.variableId})`);
    const tiktokVarPath = `${workspacePath}/variables/${tiktokVarInfo.variableId}`;

    // 3. Obtener el cuerpo de la variable
    const tiktokVarResponse = await tagmanager.accounts.containers.workspaces.variables.get({ path: tiktokVarPath });
    const tiktokVar = tiktokVarResponse.data;

    // Actualizar defaultValue
    const defaultValueParam = tiktokVar.parameter.find(p => p.key === 'defaultValue');
    if (defaultValueParam) {
      console.log(`  -> Cambiando defaultValue: ${defaultValueParam.value} => ${NEW_TIKTOK_PIXEL_ID}`);
      defaultValueParam.value = NEW_TIKTOK_PIXEL_ID;
    }

    // Actualizar los mapeos en el parámetro "map"
    const mapParam = tiktokVar.parameter.find(p => p.key === 'map');
    if (mapParam && mapParam.list) {
      for (const item of mapParam.list) {
        const keyItem = item.map.find(m => m.key === 'key');
        const valueItem = item.map.find(m => m.key === 'value');
        if (keyItem && valueItem && (keyItem.value === 'blama.shop' || keyItem.value === 'www.blama.shop')) {
          console.log(`  -> Cambiando valor para ${keyItem.value}: ${valueItem.value} => ${NEW_TIKTOK_PIXEL_ID}`);
          valueItem.value = NEW_TIKTOK_PIXEL_ID;
        }
      }
    }

    // Enviar actualización
    await tagmanager.accounts.containers.workspaces.variables.update({
      path: tiktokVarPath,
      requestBody: tiktokVar
    });
    console.log('✅ Variable "Lookup - ID TikTok Pixel" actualizada con éxito.');

    // 4. Crear versión de contenedor y publicar
    try {
      console.log('\n[GTM Versioning] Intentando crear una nueva versión del contenedor...');
      const versionResponse = await tagmanager.accounts.containers.workspaces.create_version({
        path: workspacePath,
        requestBody: {
          name: `Actualización TikTok Pixel - ${NEW_TIKTOK_PIXEL_ID}`,
          notes: `Actualización automatizada del píxel de producción de TikTok Ads a ${NEW_TIKTOK_PIXEL_ID}.`
        }
      });
      const newVersion = versionResponse.data.containerVersion;
      console.log(`✅ Versión creada exitosamente: "${newVersion.name}" (Versión ID: ${newVersion.containerVersionId})`);

      // 5. Publicar la versión
      console.log(`[GTM Publish] Publicando versión ${newVersion.containerVersionId} en producción...`);
      await tagmanager.accounts.containers.versions.publish({
        path: `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/versions/${newVersion.containerVersionId}`
      });
      console.log('🎉 ¡Cambios publicados exitosamente en producción en Google Tag Manager!');
    } catch (verError) {
      console.log('\n⚠️ Nota: Los cambios se guardaron correctamente en tu espacio de trabajo de GTM.');
      console.log('Sin embargo, la Service Account de Google Cloud no tiene permisos de publicación directa.');
      console.log('👉 Para que entren en vigencia, ingresa a Google Tag Manager, abre tu espacio de trabajo y dale a Enviar -> Publicar.');
    }

  } catch (error) {
    console.error('❌ Error durante la actualización de TikTok Pixel en GTM:', error.message || error);
    process.exit(1);
  }
}

main();
