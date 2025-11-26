# Fill-in-the-Blank Feature Addition

## Overview

Added a new answer mode to Syllogimous that provides cognitive variety beyond true/false validity judgments. Users can now answer questions by selecting the correct missing premise or conclusion from multiple choices.

## Changes Made

### Requirements Document
- Added **Requirement 8: Fill-in-the-Blank Question Mode**
- Renumbered subsequent requirements (8→9, 9→10, etc.)
- Added glossary terms:
  - **Fill-in-the-Blank Mode**: Question format where one premise or the conclusion is hidden
  - **Answer Mode**: The question format type (validity judgment or fill-in-the-blank)

### Acceptance Criteria (Requirement 8)
1. System randomly hides one premise or the conclusion
2. System generates 3-5 plausible alternative options
3. Hidden element displayed as blank with multiple choice options
4. System checks if selected option matches correct hidden element
5. Alternatives are grammatically consistent but logically distinct
6. Correct answers provide same feedback as validity mode
7. Incorrect answers show which option was correct
8. Users can choose between validity, fill-in-the-blank, or mixed mode
9. Mixed mode randomly alternates between question types
10. Statistics separately track performance for each answer mode

### TypeScript Interfaces (`types/interfaces.ts`)

#### New Type
```typescript
export type AnswerMode = 'validity' | 'fill-in-the-blank' | 'mixed';
```

#### Updated Question Interface
```typescript
export interface Question {
  // ... existing fields
  answerMode: AnswerMode;
  hiddenElementIndex?: number; // Index of hidden premise (-1 for conclusion)
  correctAnswer?: string; // The correct hidden element
  alternatives?: string[]; // Alternative options for fill-in-the-blank
  // ... rest of fields
}
```

#### Updated QuestionRecord Interface
```typescript
export interface QuestionRecord {
  // ... existing fields
  userAnswer?: boolean | string; // boolean for validity, string for fill-in-the-blank
  // ... rest of fields
}
```

#### Updated SyllogimousSettings Interface
```typescript
export interface SyllogimousSettings {
  // ... existing fields
  
  // Answer mode
  answerMode: AnswerMode; // 'validity', 'fill-in-the-blank', or 'mixed'
  fillInAlternativesCount: number; // Number of alternative options (3-5)
  
  // ... rest of fields
}
```

#### Updated TypeBasedStats Interface
```typescript
export interface TypeBasedStats {
  [questionType: string]: {
    completed: number;
    accuracy: number;
    validityModeAccuracy?: number; // NEW
    fillInModeAccuracy?: number;   // NEW
    stats: {
      [premises: string]: PremiseStats;
    };
  };
}
```

### Data Models (`types/models.ts`)

#### Updated Default Settings
```typescript
export const DEFAULT_SYLLOGIMOUS_SETTINGS: SyllogimousSettings = {
  // ... existing settings
  
  // Answer mode - validity by default
  answerMode: 'validity',
  fillInAlternativesCount: 4,
  
  // ... rest of settings
};
```

#### New Tip Content
```typescript
FILL_IN_MODE_INTRO: {
  title: 'Fill-in-the-Blank Mode',
  content: 'One premise or the conclusion is hidden. Select the correct option from the choices provided. This tests your ability to complete logical patterns.'
}
```

## Implementation Requirements

### Question Generator
- Implement logic to randomly select which element to hide (premise or conclusion)
- Generate plausible but incorrect alternatives based on:
  - Same grammatical structure
  - Similar vocabulary/word types
  - Logically distinct relationships
  - Appropriate difficulty level

### UI Components
- Display hidden element as "______" or similar placeholder
- Show multiple choice buttons/options
- Highlight selected option
- Show correct answer on incorrect responses
- Maintain consistent styling with validity mode

### Answer Checking
- Compare selected option with `correctAnswer` field
- Handle both string matching and semantic equivalence
- Provide appropriate feedback for correct/incorrect answers

### Statistics Tracking
- Track separate accuracy for validity vs fill-in-the-blank modes
- Store answer mode with each question record
- Calculate mode-specific metrics in stats engine
- Display mode breakdown in statistics view

### Settings UI
- Add answer mode selector (validity / fill-in-the-blank / mixed)
- Add slider/input for number of alternatives (3-5)
- Show mode-specific statistics in analytics

## Cognitive Benefits

1. **Variety**: Reduces monotony of true/false questions
2. **Active Recall**: Requires generating/recognizing correct answer vs passive judgment
3. **Pattern Completion**: Tests ability to complete logical patterns
4. **Multiple Representations**: Same logical content, different cognitive demands
5. **Engagement**: More interactive and game-like experience

## Example Question Formats

### Validity Mode (Original)
```
Premise 1: A is left of B
Premise 2: B is left of C
Conclusion: A is left of C

Is this conclusion valid? [TRUE] [FALSE]
```

### Fill-in-the-Blank Mode (New)
```
Premise 1: A is left of B
Premise 2: ____________
Conclusion: A is left of C

Select the missing premise:
[A] B is right of C
[B] B is left of C  ← Correct
[C] C is left of B
[D] A is right of B
```

### Alternative Fill-in-the-Blank
```
Premise 1: A is left of B
Premise 2: B is left of C
Conclusion: ____________

Select the valid conclusion:
[A] C is left of A
[B] B is left of A
[C] A is left of C  ← Correct
[D] C is right of B
```

## Testing Considerations

### Property-Based Tests
- Generate random questions with hidden elements
- Verify alternatives are distinct and plausible
- Test that correct answer is always in alternatives list
- Verify mixed mode properly alternates between modes

### Unit Tests
- Test alternative generation for each question type
- Test answer checking logic
- Test statistics tracking for each mode
- Test UI rendering for fill-in-the-blank display

## Future Enhancements

1. **Adaptive Alternatives**: Generate harder/easier alternatives based on user performance
2. **Partial Credit**: Award partial points for "close" answers
3. **Hint System**: Provide hints by eliminating incorrect options
4. **Timed Alternatives**: Show options sequentially with time pressure
5. **Custom Alternative Count**: Let users choose 2-6 alternatives per difficulty
6. **Explanation Integration**: Show why each alternative is correct/incorrect

## Migration Notes

- Existing questions default to validity mode
- No breaking changes to existing data structures
- Backward compatible with v3/v4 question formats
- Statistics gracefully handle missing mode-specific data
