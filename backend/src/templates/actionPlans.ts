/**
 * actionPlans.ts
 * Profile-specific action plan content loaded from database
 */

import pool from '../db/pool';

// After build, action plans are copied to backend/dist/email-action-plans
// From backend/dist/templates, go up one level to dist, then into email-action-plans
interface ActionPlanContent {
  subject: string;
  htmlBody: string;
  textBody: string;
}

/**
 * Load action plan content for a quiz profile from database
 */
export async function getActionPlan(profileId: string): Promise<ActionPlanContent | null> {
  try {
    const result = await pool.query(
      'SELECT subject, body FROM email_templates WHERE profile_id = $1',
      [profileId]
    );
    
    if (result.rows.length === 0) {
      console.warn(`[actionPlans] No template found for profile: ${profileId}`);
      return null;
    }
    
    const { subject, body: markdown } = result.rows[0];
    
    // Convert markdown to HTML
    const htmlBody = markdownToHtml(markdown);
    
    // Convert markdown to plain text
    const textBody = markdownToText(markdown);
    
    return { subject, htmlBody, textBody };
  } catch (err) {
    console.error(`[actionPlans] Database error for profile ${profileId}:`, err);
    return null;
  }
}

/**
 * Simple markdown to HTML converter
 * Handles: headers, bold, italic, links, lists
 */
function markdownToHtml(md: string): string {
  let html = md;
  
  // Remove metadata section at top (between first --- and second ---)
  html = html.replace(/^#[^\n]+\n\n\*\*Subject:\*\*[^\n]+\n\*\*Preview:\*\*[^\n]+\n\n---\n\n/, '');
  
  // Replace [First Name] placeholder
  html = html.replace(/\[First Name\]/g, '{firstName}');
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Links FIRST (before bold processing strips the markdown)
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#FF6B35;font-weight:600;text-decoration:underline">$1</a>');
  
  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Paragraphs (any line not already wrapped in a tag)
  html = html.split('\n\n').map(block => {
    if (block.startsWith('<') || block.trim() === '' || block.trim() === '---') {
      return block;
    }
    return `<p>${block.replace(/\n/g, ' ')}</p>`;
  }).join('\n');
  
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  
  return html;
}

/**
 * Simple markdown to plain text converter
 */
function markdownToText(md: string): string {
  let text = md;
  
  // Remove metadata section
  text = text.replace(/^#[^\n]+\n\n\*\*Subject:\*\*[^\n]+\n\*\*Preview:\*\*[^\n]+\n\n---\n\n/, '');
  
  // Replace [First Name] placeholder
  text = text.replace(/\[First Name\]/g, '{firstName}');
  
  // Remove markdown formatting
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '$1');
  text = text.replace(/\*\*(.+?)\*\*/g, '$1');
  text = text.replace(/\*(.+?)\*/g, '$1');
  text = text.replace(/\[(.+?)\]\(.+?\)/g, '$1');
  text = text.replace(/^#{1,3} (.+)$/gm, '$1');
  text = text.replace(/^---$/gm, '');
  
  return text.trim();
}
