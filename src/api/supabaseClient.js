// src/api/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://enftsuaywxyeawkdgnut.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuZnRzdWF5d3h5ZWF3a2RnbnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjM4NzUsImV4cCI6MjA5MjY5OTg3NX0.KR5jg4Dbq9sEDhdhpUvM4Iyaip_6dGN1faBfDXnqkA0";

export const supabase = createClient(supabaseUrl, supabaseKey);