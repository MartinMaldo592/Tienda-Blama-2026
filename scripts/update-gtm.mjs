import { google } from 'googleapis';
import fs from 'fs';

const KEY_FILE = './tienda-blama-b9786a6539e4.json';
const ACCOUNT_ID = '6336487505';
const CONTAINER_ID = '242018047';
const WORKSPACE_ID = '17';
const WORKSPACE_PATH = `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/workspaces/${WORKSPACE_ID}`;

const NEW_GA4_ID = 'G-6CN78M9MQM';
const NEW_META_ID = '4026169770853490';

async function main() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE,
      scopes: [
        'https://www.googleapis.com/auth/tagmanager.edit.containers'
      ],
    });

    const authClient = await auth.getClient();
    const tagmanager = google.tagmanager({
      version: 'v2',
      auth: authClient,
    });

    console.log('--- Iniciando actualización de Google Tag Manager ---');

    // 1. Actualizar Variable de Lookup para Meta Ads (ID: 61)
    console.log('\n[Meta Ads] Actualizando variable "Lookup - ID Meta Pixel"...');
    const metaVarPath = `${WORKSPACE_PATH}/variables/61`;
    const metaVarResponse = await tagmanager.accounts.containers.workspaces.variables.get({ path: metaVarPath });
    const metaVar = metaVarResponse.data;

    // Actualizar los mapeos en el parámetro "map"
    const mapParam = metaVar.parameter.find(p => p.key === 'map');
    if (mapParam && mapParam.list) {
      for (const item of mapParam.list) {
        const keyItem = item.map.find(m => m.key === 'key');
        const valueItem = item.map.find(m => m.key === 'value');
        if (keyItem && valueItem && (keyItem.value === 'blama.shop' || keyItem.value === 'www.blama.shop')) {
          console.log(`  -> Cambiando valor para ${keyItem.value}: ${valueItem.value} => ${NEW_META_ID}`);
          valueItem.value = NEW_META_ID;
        }
      }
    }

    await tagmanager.accounts.containers.workspaces.variables.update({
      path: metaVarPath,
      requestBody: metaVar
    });
    console.log('✅ Variable "Lookup - ID Meta Pixel" actualizada.');

    // 2. Actualizar Tags de Google Analytics 4 (IDs: 45, 46, 47, 48, 49, 50)
    const gaTags = [
      { id: '45', type: 'googtag', key: 'tagId' },
      { id: '46', type: 'gaawe', key: 'measurementIdOverride' },
      { id: '47', type: 'gaawe', key: 'measurementIdOverride' },
      { id: '48', type: 'gaawe', key: 'measurementIdOverride' },
      { id: '49', type: 'gaawe', key: 'measurementIdOverride' },
      { id: '50', type: 'gaawe', key: 'measurementIdOverride' }
    ];

    console.log('\n[Google Analytics] Actualizando configuración de IDs en Etiquetas...');
    for (const gaTagInfo of gaTags) {
      const tagPath = `${WORKSPACE_PATH}/tags/${gaTagInfo.id}`;
      console.log(`  -> Procesando etiqueta: ID ${gaTagInfo.id}...`);
      const tagResponse = await tagmanager.accounts.containers.workspaces.tags.get({ path: tagPath });
      const tag = tagResponse.data;

      const targetParam = tag.parameter.find(p => p.key === gaTagInfo.key);
      if (targetParam) {
        console.log(`     Modificando parámetro "${gaTagInfo.key}": ${targetParam.value} => ${NEW_GA4_ID}`);
        targetParam.value = NEW_GA4_ID;
        await tagmanager.accounts.containers.workspaces.tags.update({
          path: tagPath,
          requestBody: tag
        });
      } else {
        console.warn(`     ⚠️ Parámetro "${gaTagInfo.key}" no encontrado en etiqueta ID ${gaTagInfo.id}`);
      }
    }
    console.log('✅ Etiquetas de Google Analytics 4 actualizadas.');

    // 3. Intentar crear versión y publicar
    try {
      console.log('\n[GTM Versioning] Creando nueva versión del espacio de trabajo...');
      const versionResponse = await tagmanager.accounts.containers.workspaces.create_version({
        path: WORKSPACE_PATH,
        requestBody: {
          name: 'Migración Píxeles Producción Real',
          notes: 'Actualización automática de Google Analytics (GA4) a G-6CN78M9MQM y Meta Pixel a 4026169770853490 para producción.'
        }
      });
      const newVersion = versionResponse.data.containerVersion;
      console.log(`✅ Versión creada exitosamente: "${newVersion.name}" (Versión ID: ${newVersion.containerVersionId})`);

      // 4. Publicar la versión
      console.log(`\n[GTM Publish] Publicando versión ${newVersion.containerVersionId}...`);
      await tagmanager.accounts.containers.versions.publish({
        path: `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/versions/${newVersion.containerVersionId}`
      });
      console.log('🎉 ¡Versión publicada exitosamente en producción!');
    } catch (verError) {
      console.log('\n⚠️ Nota: Los cambios en las variables y etiquetas se guardaron correctamente en tu espacio de trabajo de GTM (workspace 17).');
      console.log('Sin embargo, tu Service Account no tiene permisos de publicación para crear y publicar versiones automáticamente en GTM.');
      console.log('👉 Para aplicar los cambios, solo debes ingresar a tu consola de Google Tag Manager (GTM-PCKTWQM3), ir al espacio de trabajo "Default Workspace", revisar los cambios y hacer clic en el botón "Enviar" -> "Publicar".');
    }

  } catch (error) {
    console.error('❌ Error durante la actualización de GTM:', error.message || error);
    process.exit(1);
  }
}

main();
