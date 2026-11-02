# Chatbot Features - Keyword-Based Responses

## Overview

The Therapy Space chatbot now uses an intelligent keyword-matching system to provide contextual, empathetic responses based on what users share.

## Keyword Categories

The chatbot recognizes and responds to the following categories:

### 1. Greetings
**Keywords:** hello, hi, hey, good morning, good afternoon, good evening, greetings
**Purpose:** Friendly welcome messages to start conversations

### 2. Sadness/Depression
**Keywords:** sad, depressed, down, unhappy, hopeless, empty, tearful, crying, miserable, blue
**Purpose:** Supportive responses for users experiencing sadness or depression

### 3. Anxiety/Stress
**Keywords:** anxious, anxiety, worried, worry, stressed, stress, panic, nervous, overwhelmed, fear, scared, afraid
**Purpose:** Calming responses with coping strategies for anxiety

### 4. Anger/Frustration
**Keywords:** angry, anger, mad, frustrated, frustration, irritated, annoyed, furious, rage, upset
**Purpose:** Validating responses that help users process anger

### 5. Sleep Issues
**Keywords:** sleep, sleepless, insomnia, tired, exhausted, restless, can't sleep, wake up, nightmares
**Purpose:** Helpful suggestions for improving sleep

### 6. Loneliness/Isolation
**Keywords:** lonely, alone, isolated, no one, nobody, empty, disconnected, by myself
**Purpose:** Supportive responses addressing feelings of isolation

### 7. Self-Care/Motivation
**Keywords:** self care, self-care, motivation, motivated, energy, lazy, procrastinate, don't want, can't do
**Purpose:** Encouraging responses about self-care and motivation

### 8. Gratitude/Positive
**Keywords:** grateful, gratitude, thankful, blessed, lucky, appreciate, happy, good, great, wonderful, awesome
**Purpose:** Affirming responses for positive feelings

### 9. Relationships
**Keywords:** relationship, friend, family, partner, breakup, divorce, fight, argument, conflict, love, hate
**Purpose:** Supportive guidance for relationship issues

### 10. Work/Study Stress
**Keywords:** work, job, study, school, exam, test, deadline, boss, colleague, homework, assignment
**Purpose:** Helpful responses for work and academic stress

### 11. Help/Support
**Keywords:** help, support, need, don't know, confused, stuck, lost, what should, what do
**Purpose:** Reassuring responses offering guidance

### 12. Crisis (High Priority)
**Keywords:** suicide, kill myself, end it, not worth it, better off, self harm, hurt myself, give up
**Purpose:** Crisis intervention responses with emergency resources

### 13. General (Fallback)
**Purpose:** Empathetic responses when no specific keywords match

## How It Works

1. **Keyword Matching:** When a user sends a message, the system checks the message against all keyword categories
2. **Priority System:** Crisis keywords are checked first for immediate safety
3. **Contextual Response:** If keywords match, a random response from that category's response pool is selected
4. **Fallback:** If no keywords match, a general supportive response is provided
5. **Database Storage:** Both user messages and bot responses are saved to the database

## Response Quality

- All responses are empathetic and validating
- Responses acknowledge the user's feelings
- Responses often include questions to encourage further conversation
- Responses may suggest coping strategies when appropriate
- Crisis responses include resources for immediate help

## Testing

You can test the chatbot by using messages containing keywords from any category. For example:
- "I feel really anxious about my exam"
- "I'm feeling sad and don't know why"
- "I can't sleep at night"
- "I'm so grateful for my friends"

## Note

This chatbot is designed to provide support and validation, but it is not a replacement for professional mental health care. Crisis responses direct users to professional resources.

