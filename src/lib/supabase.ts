import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bqeglucioqurmzvnhsvw.supabase.co';
const supabaseAnonKey = 'sb_publishable_mgM4sH1xvvwDpXBcd_tRCg_XMQInrdb';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
