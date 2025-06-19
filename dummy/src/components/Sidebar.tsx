
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProgress } from '@/contexts/ProgressContext';
import { Check, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Topic {
  id: string;
  title: string;
  path: string;
}

export const topics: Topic[] = [
  {
    id: 'intro-to-sql',
    title: 'Introduction to SQL',
    path: '/topic/intro-to-sql',
  },
  {
    id: 'basic-queries',
    title: 'Basic SQL Queries',
    path: '/topic/basic-queries',
  },
  {
    id: 'filtering-data',
    title: 'Filtering Data with WHERE',
    path: '/topic/filtering-data',
  },
  {
    id: 'joins',
    title: 'Joining Tables',
    path: '/topic/joins',
  },
  {
    id: 'aggregations',
    title: 'Aggregation Functions',
    path: '/topic/aggregations',
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { isTopicCompleted, getTopicQuizScore } = useProgress();
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  useEffect(() => {
    // Extract the topic ID from the URL
    const match = location.pathname.match(/\/topic\/([^/]+)/);
    if (match && match[1]) {
      setActiveTopicId(match[1]);
    } else {
      setActiveTopicId(null);
    }
  }, [location]);

  return (
    <div className="h-full w-64 bg-sidebar border-r">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">SQL Learning Path</h2>
        <div className="space-y-1">
          {topics.map((topic) => {
            const isCompleted = isTopicCompleted(topic.id);
            const isActive = topic.id === activeTopicId;
            const quizScore = getTopicQuizScore(topic.id);
            
            return (
              <Link
                key={topic.id}
                to={topic.path}
                className={`topic-link group ${isActive ? 'topic-link-active' : ''} ${
                  isCompleted ? 'topic-link-completed' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {isCompleted ? (
                      <div className="mr-2 h-5 w-5 rounded-full bg-success flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    ) : (
                      <ChevronRight size={16} className="mr-2 opacity-70" />
                    )}
                    <span>{topic.title}</span>
                  </div>
                  {quizScore !== undefined && (
                    <Badge variant={quizScore >= 70 ? "outline" : "secondary"} className="ml-2">
                      {quizScore}%
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
