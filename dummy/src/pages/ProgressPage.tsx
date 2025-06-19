
import React from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CircleDashed, BarChart3 } from 'lucide-react';
import { topics } from '@/components/Sidebar';

const ProgressPage = () => {
  const { completedTopics, quizScores, overallProgress } = useProgress();
  
  return (
    <div className="container max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <div className="flex items-center bg-secondary/50 px-3 py-1 rounded-full">
          <BarChart3 size={18} className="mr-2" />
          <span>{overallProgress}% Complete</span>
        </div>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Topic Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topics.map(topic => {
                const isCompleted = completedTopics.includes(topic.id);
                const quizScore = quizScores[topic.id];
                
                return (
                  <div key={topic.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-success mr-2" />
                      ) : (
                        <CircleDashed className="h-5 w-5 text-muted-foreground mr-2" />
                      )}
                      <span className={isCompleted ? 'text-foreground' : 'text-muted-foreground'}>
                        {topic.title}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {quizScore !== undefined ? (
                        <span className={`px-2 py-0.5 rounded text-sm ${quizScore >= 70 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning-foreground'}`}>
                          Quiz: {quizScore}%
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Quiz not taken</span>
                      )}
                      <Button variant="ghost" size="sm" asChild className="ml-4">
                        <Link to={topic.path}>
                          {isCompleted ? 'Review' : 'Start'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Getting Started",
                  description: "Complete your first topic",
                  icon: <CheckCircle2 />,
                  unlocked: completedTopics.length > 0
                },
                {
                  title: "Quiz Master",
                  description: "Score 100% on a quiz",
                  icon: <BarChart3 />,
                  unlocked: Object.values(quizScores).some(score => score === 100)
                },
                {
                  title: "Halfway There",
                  description: "Complete 50% of all topics",
                  icon: <BarChart3 />,
                  unlocked: overallProgress >= 50
                },
                {
                  title: "SQL Expert",
                  description: "Complete all topics",
                  icon: <CheckCircle2 />,
                  unlocked: overallProgress === 100
                },
              ].map((achievement, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg border flex items-center ${
                    achievement.unlocked ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-muted'
                  }`}
                >
                  <div className={`p-2 rounded-full mr-3 ${
                    achievement.unlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className={`font-medium ${
                      achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
