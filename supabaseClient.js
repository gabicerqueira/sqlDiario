// supabaseClient.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xiwrrirhqbtvmpjdakjo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpd3JyaXJocWJ0dm1wamRha2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMTc0NjIsImV4cCI6MjAzODY5MzQ2Mn0.WuFDPQkW_LJ37psnyhDnshtXmPhvTf1l0PvIRyJ_K8A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false,
});
