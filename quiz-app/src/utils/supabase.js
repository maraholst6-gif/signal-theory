import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function saveQuizSubmission(data) {
  if (!supabase) {
    console.log('Supabase not configured — storing locally:', data);
    localStorage.setItem('quiz-submission-latest', JSON.stringify({ ...data, timestamp: new Date().toISOString() }));
    const existing = JSON.parse(localStorage.getItem('quiz-submissions') || '[]');
    existing.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem('quiz-submissions', JSON.stringify(existing));
    return { success: true };
  }

  const { error } = await supabase
    .from('quiz_submissions')
    .insert([{
      email: data.email,
      name: data.name || null,
      profile_type: data.profileType,
      scores: data.scores,
      answers: data.answers,
    }]);

  return { success: !error, error };
}
