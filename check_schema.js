const fs = require('fs');
const envText = (fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '') + '\n' + (fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '');
const env = {};
envText.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('./node_modules/@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  // 1. Check site_settings
  const { data: settings } = await supabase.from('site_settings').select('*').eq('key', 'site_config').maybeSingle();
  console.log('--- SITE CONFIG SCRIPTS ---');
  if (settings?.value?.customScripts) {
    console.log('customScripts:', JSON.stringify(settings.value.customScripts, null, 2));
  } else {
    console.log('No customScripts in site_config');
  }

  // 2. Check articles for schema
  const { data: articles } = await supabase.from('articles').select('slug, title, content').limit(10);
  console.log('--- ARTICLES ---');
  articles?.forEach(a => {
    const str = typeof a.content === 'string' ? a.content : JSON.stringify(a.content);
    if (str.includes('schemaScript') || str.includes('application/ld+json') || str.includes('schema.org')) {
      console.log('Article with schema:', a.slug, a.title);
    }
  });
}

check().catch(console.error);

