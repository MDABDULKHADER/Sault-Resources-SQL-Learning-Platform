import React, { useState } from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  topicId: string;
  title: string;
  questions: QuizQuestion[];
}

const Quiz: React.FC<QuizProps> = ({ topicId, title, questions }) => {
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { saveQuizScore, getTopicQuizScore } = useProgress();
  const { toast } = useToast();
  
  const previousScore = getTopicQuizScore(topicId);

  const handleOptionChange = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    
    setCurrentAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions have been answered
    const answeredQuestions = Object.keys(currentAnswers).length;
    if (answeredQuestions < questions.length) {
      toast({
        title: "Incomplete Quiz",
        description: `Please answer all questions (${answeredQuestions}/${questions.length} answered)`,
        variant: "destructive",
      });
      return;
    }

    // Calculate score
    let correctAnswers = 0;
    questions.forEach((q) => {
      if (currentAnswers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const newScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(newScore);
    setSubmitted(true);
    
    // Save quiz score to database via API
    await saveQuizScore(topicId, newScore);
    
    toast({
      title: "Quiz Completed!",
      description: `Your score: ${newScore}%`,
      variant: newScore >= 70 ? "default" : "destructive",
    });
  };

  const handleRetry = () => {
    setCurrentAnswers({});
    setSubmitted(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Test your knowledge on this topic
          {previousScore !== undefined && !submitted && (
            <span className="ml-2 text-muted-foreground">
              (Previous score: {previousScore}%)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <div className="flex items-start">
                <span className="font-medium text-lg">{question.question}</span>
                {submitted && (
                  currentAnswers[question.id] === question.correctAnswer ? (
                    <CheckCircle2 className="ml-2 h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="ml-2 h-5 w-5 text-destructive" />
                  )
                )}
              </div>
              
              <RadioGroup
                value={currentAnswers[question.id]?.toString() || ""}
                disabled={submitted}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`q${question.id}-option${index}`}
                      checked={currentAnswers[question.id] === index}
                      onClick={() => handleOptionChange(question.id, index)}
                    />
                    <Label
                      htmlFor={`q${question.id}-option${index}`}
                      className={`cursor-pointer ${
                        submitted && question.correctAnswer === index 
                          ? 'text-success font-medium' 
                          : submitted && currentAnswers[question.id] === index
                            ? 'text-destructive'
                            : ''
                      }`}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              {submitted && currentAnswers[question.id] !== question.correctAnswer && (
                <p className="text-sm font-medium text-success mt-1">
                  Correct answer: {question.options[question.correctAnswer]}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {submitted ? (
          <>
            <div className="text-lg font-medium">
              Your score: 
              <span className={score >= 70 ? "text-success ml-2" : "text-destructive ml-2"}>
                {score}%
              </span>
            </div>
            <Button onClick={handleRetry}>Retry Quiz</Button>
          </>
        ) : (
          <Button onClick={handleSubmit} className="ml-auto">Submit Answers</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Quiz;
