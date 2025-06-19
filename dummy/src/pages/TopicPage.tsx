
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import Quiz from '@/components/Quiz';
import { useProgress } from '@/contexts/ProgressContext';
import { topicData } from '@/data/topicData';
import { topics } from '@/components/Sidebar';
import { useToast } from '@/hooks/use-toast';
import { marked } from 'marked';

const TopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { markTopicAsCompleted, isTopicCompleted } = useProgress();
  
  const topic = topicId ? topicData[topicId as keyof typeof topicData] : null;
  
  useEffect(() => {
    if (!topic) {
      navigate('/not-found');
    }
  }, [topic, navigate]);
  
  if (!topic) return null;
  
  const topicIndex = topics.findIndex(t => t.id === topicId);
  const prevTopic = topicIndex > 0 ? topics[topicIndex - 1] : null;
  const nextTopic = topicIndex < topics.length - 1 ? topics[topicIndex + 1] : null;
  
  const completed = isTopicCompleted(topic.id);
  
  const handleMarkAsCompleted = () => {
    markTopicAsCompleted(topic.id);
    toast({
      title: "Progress saved",
      description: "This topic has been marked as completed.",
    });
  };
  
  const handleNext = () => {
    if (nextTopic) {
      navigate(nextTopic.path);
    }
  };
  
  return (
    <div className="container max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{topic.title}</h1>
        {!completed && (
          <Button onClick={handleMarkAsCompleted} variant="outline" className="flex items-center gap-2">
            <CheckCircle size={16} />
            Mark as Completed
          </Button>
        )}
        {completed && (
          <div className="flex items-center text-success">
            <CheckCircle className="mr-2" size={18} />
            <span>Completed</span>
          </div>
        )}
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(topic.content) }} 
          />
        </CardContent>
      </Card>
      
      <div className="mb-8">
        <Quiz 
          topicId={topic.id} 
          title={`${topic.title} Quiz`} 
          questions={topic.quiz} 
        />
      </div>
      
      <div className="flex justify-between">
        {prevTopic ? (
          <Button
            variant="outline"
            onClick={() => navigate(prevTopic.path)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Previous: {prevTopic.title}
          </Button>
        ) : (
          <div></div>
        )}
        
        {nextTopic && (
          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            Next: {nextTopic.title}
            <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TopicPage;
