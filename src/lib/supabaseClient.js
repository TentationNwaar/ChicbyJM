// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lhfdbuftjlbndnoiltwy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoZmRidWZ0amxibmRub2lsdHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTEwMzIsImV4cCI6MjA1OTUyNzAzMn0.4WbfDtQChcy1rNWqV-2rltDwplbHuIXbbQqwFWftylI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)