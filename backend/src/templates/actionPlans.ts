/**
 * actionPlans.ts
 * Profile-specific action plan content loaded from markdown files
 */

import fs from 'fs';
import path from 'path';

const ACTION_PLANS_DIR = path.join(__dirname, '../../../email-action-plans');

interface ActionPlanContent {
  subject: string;
  htmlBody: string;
  textBody: string;
}

// Map quiz profile IDs to action plan filenames
const PROFILE_FILES: Record<string, string> = {
  'ready-navigator': 'ready-navigator.md',
  'rusty-romantic': 'rusty-romantic.md',
  'eager-rebuilder': 'eager-rebuilder.md',
  'cautious-observer': 'cautious-observer.md',
  'wounded-analyst': 'wounded-analyst.md',
  'pattern-repeater': 'pattern-repeater.md',
  'inconsistent-dater': 'inconsistent-dater-example.md',
  'self-aware-learner': 'self-aware-learner.md',
};

/**
 * Load action plan content for a quiz profile
 */
export function getActionPlan(profileId: string): ActionPlanContent | null {
  const filename = PROFILE_FILES[profileId];
  if (!filename) {
    console.warn(`[actionPlans] No action plan file mapped for profile: ${profileId}`);
    return null;
  }

  const filePath = path.join(ACTION_PLANS_DIR, filename);
  
  try {
    const markdown = fs.readFileSync(filePath, 'utf-8');
    
    // Extract subject from markdown (look for "**Subject:**" line)
    const subjectMatch = markdown.match(/\*\*Subject:\*\*\s*(.+)/);
    const subject = subjectMatch ? subjectMatch[1].trim() : `Your Dating Readiness Profile`;
    
    // Convert markdown to HTML
    const htmlBody = markdownToHtml(markdown);
    
    // Convert markdown to plain text
    const textBody = markdownToText(markdown);
    
    return { subject, htmlBody, textBody };
  } catch (err) {
    console.error(`[actionPlans] Failed to load ${filename}:`, err);
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
  
  // Bold + italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Links - preserve markdown format for now, we'll add URLs in template
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  
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
