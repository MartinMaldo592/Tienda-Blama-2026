import { google } from 'googleapis';

const KEY_FILE = './tienda-blama-b9786a6539e4.json';
const ACCOUNT_ID = '6336487505';
const CONTAINER_ID = '242018047';

const META_TAG_NAME = 'Meta - Event - Purchase';
const TIKTOK_TAG_NAME = 'TikTok - Event - Purchase';

const NEW_META_HTML = `<script>
if (window.fbq) {
  var ecommerce = {{ecommerce}} || {};
  var items = ecommerce.items || [];
  var contentIds = [];
  for (var i = 0; i < items.length; i++) {
    contentIds.push(String(items[i].item_id || ''));
  }
  
  var emailVal = '{{Data Layer - email}}' || '';
  var phoneVal = '{{Data Layer - phone}}' || '';
  var fbclidVal = '{{Cookie - fbclid}}' || '';
  
  var cleanPhone = phoneVal.replace(/\\D/g, '');
  if (cleanPhone.length === 9 && cleanPhone.indexOf('9') === 0) {
    phoneVal = '+51' + cleanPhone;
  } else if (cleanPhone.indexOf('51') === 0 && cleanPhone.length === 11) {
    phoneVal = '+' + cleanPhone;
  } else if (cleanPhone.length > 0) {
    phoneVal = phoneVal.indexOf('+') === 0 ? phoneVal : '+' + cleanPhone;
  }
  
  var advancedMatching = {};
  if (emailVal) advancedMatching.em = emailVal.trim().toLowerCase();
  if (phoneVal) advancedMatching.ph = phoneVal.trim().toLowerCase();
  if (fbclidVal) advancedMatching.external_id = fbclidVal.trim();
  
  fbq('track', 'Purchase', {
    content_ids: contentIds,
    content_type: 'product',
    value: Number(ecommerce.value || 0),
    currency: 'PEN'
  }, advancedMatching);
}
</script>`;

const NEW_TIKTOK_HTML = `<script>
if (window.ttq) {
  var emailVal = '{{Data Layer - email}}' || '';
  var phoneVal = '{{Data Layer - phone}}' || '';
  var ttclidVal = '{{Cookie - ttclid}}' || '';
  
  var cleanPhone = phoneVal.replace(/\\D/g, '');
  if (cleanPhone.length === 9 && cleanPhone.indexOf('9') === 0) {
    phoneVal = '+51' + cleanPhone;
  } else if (cleanPhone.indexOf('51') === 0 && cleanPhone.length === 11) {
    phoneVal = '+' + cleanPhone;
  } else if (cleanPhone.length > 0) {
    phoneVal = phoneVal.indexOf('+') === 0 ? phoneVal : '+' + cleanPhone;
  }
  
  var identity = {};
  if (emailVal) identity.email = emailVal.trim().toLowerCase();
  if (phoneVal) identity.phone_number = phoneVal.trim().toLowerCase();
  if (ttclidVal) identity.external_id = ttclidVal.trim();
  
  if (identity.email || identity.phone_number || identity.external_id) {
    ttq.identify(identity);
  }
  
  var ecommerce = {{ecommerce}} || {};
  var items = ecommerce.items || [];
  var contents = [];
  for (var i = 0; i < items.length; i++) {
    contents.push({
      content_id: String(items[i].item_id || ''),
      content_name: String(items[i].item_name || ''),
      content_type: 'product',
      price: Number(items[i].price || 0),
      quantity: Number(items[i].quantity || 1)
    });
  }
  
  ttq.track('CompletePayment', {
    contents: contents,
    value: Number(ecommerce.value || 0),
    currency: 'PEN'
  });
}
</script>`;

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

    console.log('--- Iniciando actualización de Etiquetas en GTM ---');

    // 1. Obtener workspaces
    const workspacesResponse = await tagmanager.accounts.containers.workspaces.list({
      parent: `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}`
    });
    const workspaces = workspacesResponse.data.workspace || [];
    let workspace = workspaces.find(w => w.name === 'Default Workspace') || workspaces[0];
    
    if (!workspace) {
      throw new Error('No se encontró ningún espacio de trabajo (workspace).');
    }
    console.log(`Usando Workspace: "${workspace.name}" (ID: ${workspace.workspaceId})`);
    const workspacePath = `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/workspaces/${workspace.workspaceId}`;

    // 2. Listar todas las etiquetas para encontrar por nombre
    const tagsResponse = await tagmanager.accounts.containers.workspaces.tags.list({
      parent: workspacePath
    });
    const tags = tagsResponse.data.tag || [];

    // 3. Actualizar Meta Purchase Tag
    const metaTagInfo = tags.find(t => t.name === META_TAG_NAME);
    if (metaTagInfo) {
      console.log(`\n[Meta Tag] Actualizando etiqueta "${META_TAG_NAME}" (ID: ${metaTagInfo.tagId})...`);
      const tagPath = `${workspacePath}/tags/${metaTagInfo.tagId}`;
      const tagResponse = await tagmanager.accounts.containers.workspaces.tags.get({ path: tagPath });
      const tag = tagResponse.data;

      // Buscar parámetro HTML
      const htmlParam = tag.parameter.find(p => p.key === 'html');
      if (htmlParam) {
        htmlParam.value = NEW_META_HTML;
        await tagmanager.accounts.containers.workspaces.tags.update({
          path: tagPath,
          requestBody: tag
        });
        console.log('✅ Etiqueta de Meta Purchase actualizada.');
      }
    } else {
      console.warn(`⚠️ No se encontró la etiqueta "${META_TAG_NAME}" en GTM.`);
    }

    // 4. Actualizar TikTok CompletePayment Tag
    const tiktokTagInfo = tags.find(t => t.name === TIKTOK_TAG_NAME);
    if (tiktokTagInfo) {
      console.log(`\n[TikTok Tag] Actualizando etiqueta "${TIKTOK_TAG_NAME}" (ID: ${tiktokTagInfo.tagId})...`);
      const tagPath = `${workspacePath}/tags/${tiktokTagInfo.tagId}`;
      const tagResponse = await tagmanager.accounts.containers.workspaces.tags.get({ path: tagPath });
      const tag = tagResponse.data;

      // Buscar parámetro HTML
      const htmlParam = tag.parameter.find(p => p.key === 'html');
      if (htmlParam) {
        htmlParam.value = NEW_TIKTOK_HTML;
        await tagmanager.accounts.containers.workspaces.tags.update({
          path: tagPath,
          requestBody: tag
        });
        console.log('✅ Etiqueta de TikTok CompletePayment actualizada.');
      }
    } else {
      console.warn(`⚠️ No se encontró la etiqueta "${TIKTOK_TAG_NAME}" en GTM.`);
    }

    // 5. Crear versión de contenedor y publicar
    try {
      console.log('\n[GTM Versioning] Creando versión del espacio de trabajo...');
      const versionResponse = await tagmanager.accounts.containers.workspaces.create_version({
        path: workspacePath,
        requestBody: {
          name: 'Corrección E164 Formato Teléfono en Píxeles',
          notes: 'Corrección automatizada para forzar formateo E164 internacional (+51) en los píxeles de Meta y TikTok Ads.'
        }
      });
      const newVersion = versionResponse.data.containerVersion;
      console.log(`✅ Versión creada exitosamente: "${newVersion.name}" (Versión ID: ${newVersion.containerVersionId})`);

      // 6. Publicar la versión
      console.log(`[GTM Publish] Publicando versión ${newVersion.containerVersionId} en producción...`);
      await tagmanager.accounts.containers.versions.publish({
        path: `accounts/${ACCOUNT_ID}/containers/${CONTAINER_ID}/versions/${newVersion.containerVersionId}`
      });
      console.log('🎉 ¡Cambios publicados exitosamente en producción en Google Tag Manager!');
    } catch (verError) {
      console.log('\n⚠️ Nota: Los cambios se guardaron en tu espacio de trabajo de GTM, pero no se pudieron publicar automáticamente.');
    }

  } catch (error) {
    console.error('❌ Error durante la actualización de etiquetas en GTM:', error.message || error);
    process.exit(1);
  }
}

main();
