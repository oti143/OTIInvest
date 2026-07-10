import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fhczertmrdsatgxihrye.supabase.co';
const supabaseAnonKey = 'sb_publishable_ALJxZU7v2HM34yODCKv9xg_59E2cfqZ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
