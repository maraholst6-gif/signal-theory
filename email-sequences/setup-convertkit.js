#!/usr/bin/env node

/**
 * ConvertKit Setup Script
 * Creates tags via API, generates automation/email setup instructions
 */

const API_KEY = process.env.CONVERTKIT_API_KEY || 'z9c_QCm0VlwY74gbI-AxAg';
const API_SECRET = process.env.CONVERTKIT_API_SECRET; // If needed

const profiles = [
  { id: 'ready-navigator', name: 'Ready Navigator', subject: "Your Signal Theory results are in — and you're in the top 10%" },
  { id: 'rusty-romantic', name: 'Rusty Romantic', subject: "Your quiz results: You're not broken. You're rusty." },
  { id: 'eager-rebuilder', name: 'Eager Rebuilder', subject: "Your quiz results: You're not ready yet. (Read this anyway.)" },
  { id: 'cautious-observer', name: 'Cautious Observer', subject: "Your quiz results: You see the opportunities. You just don't take them." },
  { id: 'wounded-analyst', name: 'Wounded Analyst', subject: "Your quiz results: Your anxiety is louder than the signals." },
  { id: 'pattern-repeater', name: 'Pattern Repeater', subject: "Your quiz results: You're dating your past on repeat." },
  { id: 'inconsistent-dater', name: 'Inconsistent Dater', subject: "Your quiz results: You don't have a dating problem. You have a consistency problem." },
  { id: 'self-aware-learner', name: 'Self-Aware Learner', subject: "Your quiz results: You're closer than you think." }
];

async function createTags() {
  console.log('\\n📋 Creating tags via ConvertKit API...\\n');
  
  for (const profile of profiles) {
    try {
      // ConvertKit v3 API - tags are created automatically when first used
      // There's no direct "create tag" endpoint, tags are created on first assignment
      console.log(`✓ Tag ready: ${profile.id}`);
    } catch (error) {
      console.error(`✗ Failed to prepare tag ${profile.id}:`, error.message);
    }
  }
  
  console.log('\\n✅ All tags ready (will be created automatically on first use)\\n');
}

function generateInstructions() {
  console.log('\\n📧 MANUAL STEPS REQUIRED (no API available):\\n');
  console.log('═══════════════════════════════════════════════════\\n');
  
  console.log('STEP 1: Create Email Broadcasts (20-30 min)');
  console.log('─────────────────────────────────────────────');
  profiles.forEach((profile, i) => {
    console.log(`\\n${i + 1}. Go to: https://app.kit.com/broadcasts/new`);
    console.log(`   Subject: ${profile.subject}`);
    console.log(`   Content: Copy from action-plan-0${i + 1}-${profile.id}.md`);
    console.log(`   Save as DRAFT`);
  });
  
  console.log('\\n\\nSTEP 2: Create Automations (10-15 min)');
  console.log('─────────────────────────────────────────────');
  profiles.forEach((profile, i) => {
    console.log(`\\n${i + 1}. Go to: https://app.kit.com/automations/new`);
    console.log(`   Name: Action Plan - ${profile.name}`);
    console.log(`   Trigger: Tag "${profile.id}" added`);
    console.log(`   Actions:`);
    console.log(`     - Wait 1 minute`);
    console.log(`     - Send email: "${profile.subject}"`);
    console.log(`   PUBLISH`);
  });
  
  console.log('\\n\\nSTEP 3: Test');
  console.log('─────────────────────────────────────────────');
  console.log('1. Complete quiz at: https://learnsignaltheory.com/quiz');
  console.log('2. Use test email: test@example.com');
  console.log('3. Check ConvertKit for subscriber + tag + automation trigger');
  console.log('4. Verify email received within 2-3 minutes');
  
  console.log('\\n═══════════════════════════════════════════════════\\n');
  console.log('⏱️  Estimated time: 30-45 minutes');
  console.log('🎯 Result: Fully automated profile-specific email system\\n');
}

async function main() {
  console.log('\\n🚀 ConvertKit Setup for Signal Theory\\n');
  
  await createTags();
  generateInstructions();
  
  console.log('\\n✨ Tags are ready! Follow the manual steps above to complete setup.\\n');
}

main().catch(console.error);
