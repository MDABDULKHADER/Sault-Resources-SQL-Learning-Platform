
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, BookOpenCheck, ArrowRight, Award, Database } from 'lucide-react';
import { topics } from '@/components/Sidebar';
import { useProgress } from '@/contexts/ProgressContext';

const HomePage = () => {
  const { user } = useAuth();
  const { completedTopics, overallProgress } = useProgress();
  
  return (
    <div className="container max-w-4xl">
      <div className="flex flex-col items-center text-center mb-12">
        <BookOpen className="h-16 w-16 text-primary mb-6" />
        <h1 className="text-4xl font-bold mb-4">Welcome to Sault Resources</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Learn technical topics with interactive lessons and quizzes. Perfect for beginners and experienced practitioners alike.
        </p>
      </div>
      
      {user ? (
        <>
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Progress</CardTitle>
                <CardDescription>
                  Continue where you left off or explore new topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{overallProgress}%</p>
                    <p className="text-muted-foreground">Course completion</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedTopics.length}/{topics.length}</p>
                    <p className="text-muted-foreground">Topics completed</p>
                  </div>
                  <Button asChild>
                    <Link to="/progress">View Detailed Progress</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SQL Practice Section */}
          <div className="mb-8">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Database className="h-5 w-5" />
                  SQL Live Practice
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Practice SQL queries on a real database with instant feedback
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/sql-practice">
                    Start SQL Practice
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
        </>
      ) : (
        <>
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              <Button size="lg" asChild>
                <Link to="/register">Create Free Account</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Available Topics</h2>
        </>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {topics.map((topic) => {
          const isCompleted = user ? completedTopics.includes(topic.id) : false;
          
          return (
            <Card key={topic.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {isCompleted ? (
                    <BookOpenCheck className="h-5 w-5 text-success mr-2" />
                  ) : (
                    <BookOpen className="h-5 w-5 mr-2" />
                  )}
                  {topic.title}
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Button variant={isCompleted ? "outline" : "default"} className="w-full" asChild>
                  <Link to={topic.path}>
                    {isCompleted ? 'Review Topic' : 'Start Learning'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
        <div className="flex items-start">
          <Award className="h-8 w-8 text-primary mr-4 mt-1" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Why Learn with SaultResources?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Interactive Learning</h4>
                <p className="text-muted-foreground">Learn at your own pace with interactive lessons and quizzes</p>
              </div>
              <div>
                <h4 className="font-medium">Progress Tracking</h4>
                <p className="text-muted-foreground">Monitor your progress and see your achievements</p>
              </div>
              <div>
                <h4 className="font-medium">Practical Examples</h4>
                <p className="text-muted-foreground">Real-world examples to help you apply what you learn</p>
              </div>
              <div>
                <h4 className="font-medium">Comprehensive Topics</h4>
                <p className="text-muted-foreground">From basics to advanced techniques, we've got you covered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
