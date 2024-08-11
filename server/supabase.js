// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Use the anon key for client operations
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
