const { createClient } = require('@supabase/supabase-js');

// Read env vars is hard in node script without dotenv, but key is usually public in frontend code.
// I'll grab them from src/lib/supabase.js via grep or looking at previous file view?
// Waait, I recall reading src/app/admin/page.js uses ../../lib/supabase.
// let's read src/lib/supabase.js first to get keys? No, keys might be in .env.local
// I can try to read .env.local

const fs = require('fs');
const path = require('path');

async function checkDB() {
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.log('No .env.local found');
            return;
        }
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
        const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

        if (!urlMatch || !keyMatch) {
            console.log('Could not parse env');
            return;
        }

        const supabaseUrl = urlMatch[1].trim();
        const supabaseKey = keyMatch[1].trim();
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: cats, error: err1 } = await supabase.from('categories').select('*');
        if (err1) console.log('Error categories:', err1.message);
        else console.log('Categories found:', cats.length, cats);

        const { data: prods, error: err3 } = await supabase.from('products').select('id, name, category, subcategory').limit(10);
        if (err3) console.log('Error products:', err3.message);
        else console.log('Products Sample:', prods);

    } catch (e) {
        console.error(e);
    }
}

checkDB();
