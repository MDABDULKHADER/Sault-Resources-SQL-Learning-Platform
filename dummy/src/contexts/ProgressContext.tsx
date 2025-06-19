
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface TopicProgress {
  id: string;
  completed: boolean;
  quizScore?: number;
}

interface ProgressContextType {
  completedTopics: string[];
  quizScores: Record<string, number>;
  markTopicAsCompleted: (topicId: string) => void;
  saveQuizScore: (topicId: string, score: number) => void;
  isTopicCompleted: (topicId: string) => boolean;
  getTopicQuizScore: (topicId: string) => number | undefined;
  overallProgress: number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// API URL
const API_URL = 'http://localhost:5000/api';

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const { user } = useAuth();
  
  // Total number of topics (should match the actual number in your app)
  const TOTAL_TOPICS = 5;

  useEffect(() => {
    if (user) {
      // Load progress from API
      fetchUserProgress();
    } else {
      // Reset progress when logged out
      setCompletedTopics([]);
      setQuizScores({});
      setOverallProgress(0);
    }
  }, [user]);
  
  const fetchUserProgress = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/progress/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user progress');
      }
      
      const data = await response.json();
      setCompletedTopics(data.completedTopics || []);
      setQuizScores(data.quizScores || {});
      setOverallProgress(user.progress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      
      // Fallback to localStorage if API fails
      const savedTopics = localStorage.getItem('completedTopics');
      const savedScores = localStorage.getItem('quizScores');
      
      if (savedTopics) {
        try {
          setCompletedTopics(JSON.parse(savedTopics));
        } catch (e) {
          console.error('Failed to parse saved topics', e);
        }
      }
      
      if (savedScores) {
        try {
          setQuizScores(JSON.parse(savedScores));
        } catch (e) {
          console.error('Failed to parse saved scores', e);
        }
      }
    }
  };

  const markTopicAsCompleted = async (topicId: string) => {
    if (!user) {
      // Fallback to localStorage if not logged in
      if (!completedTopics.includes(topicId)) {
        const updatedTopics = [...completedTopics, topicId];
        setCompletedTopics(updatedTopics);
        localStorage.setItem('completedTopics', JSON.stringify(updatedTopics));
      }
      return;
    }
    
    try {
      // Update database
      const response = await fetch(`${API_URL}/progress/mark-completed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          topicId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark topic as completed');
      }
      
      // Update local state
      if (!completedTopics.includes(topicId)) {
        setCompletedTopics(prev => [...prev, topicId]);
      }
    } catch (error) {
      console.error('Error marking topic as completed:', error);
    }
  };
  
  const saveQuizScore = async (topicId: string, score: number) => {
    // Update local state
    setQuizScores(prev => ({
      ...prev,
      [topicId]: score,
    }));
    
    if (!user) {
      // Fallback to localStorage if not logged in
      localStorage.setItem('quizScores', JSON.stringify({
        ...quizScores,
        [topicId]: score,
      }));
      
      // Automatically mark topic as completed
      if (!completedTopics.includes(topicId)) {
        const updatedTopics = [...completedTopics, topicId];
        setCompletedTopics(updatedTopics);
        localStorage.setItem('completedTopics', JSON.stringify(updatedTopics));
      }
      
      return;
    }
    
    try {
      // Save to database
      const response = await fetch(`${API_URL}/quiz/save-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          topicId,
          score,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save quiz score');
      }
      
      // Update local state - the topic is automatically marked as completed on the server
      if (!completedTopics.includes(topicId)) {
        setCompletedTopics(prev => [...prev, topicId]);
      }
      
      // Update the user's progress from the server
      await fetchUserProgress();
    } catch (error) {
      console.error('Error saving quiz score:', error);
    }
  };
  
  const isTopicCompleted = (topicId: string) => {
    return completedTopics.includes(topicId);
  };
  
  const getTopicQuizScore = (topicId: string) => {
    return quizScores[topicId];
  };

  return (
    <ProgressContext.Provider value={{ 
      completedTopics, 
      quizScores,
      markTopicAsCompleted, 
      saveQuizScore, 
      isTopicCompleted, 
      getTopicQuizScore,
      overallProgress 
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  
  return context;
};
