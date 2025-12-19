const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function checkJoin() {
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
        const supabaseKey = keyMatch[1].trim(); // This is the ANON key
        const supabase = createClient(supabaseUrl, supabaseKey);

        console.log("Testing Query: .from('categories').select('*, subcategories(*)')");

        const { data, error } = await supabase
            .from('categories')
            .select('*, subcategories(*)')
            .order('id', { ascending: true });

        if (error) {
            console.error('ERROR:', error);
        } else {
            console.log('DATA:', JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error(e);
    }
}

checkJoin();
