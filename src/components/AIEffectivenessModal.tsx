
import React, { useState, useEffect } from 'react';
import { X, Brain, ThumbsDown, Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FeedbackData {
  id: string;
  sessionId: string;
  wasSolved: boolean;
  suggestions?: string;
  timestamp: Date;
  conversationSummary: string;
}

interface AIEffectivenessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIEffectivenessModal = ({ isOpen, onClose }: AIEffectivenessModalProps) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);

  useEffect(() => {
    if (isOpen) {
      const feedback = JSON.parse(localStorage.getItem('aiFeedback') || '[]');
      // Convert timestamp strings back to Date objects
      const processedFeedback = feedback.map((f: any) => ({
        ...f,
        timestamp: new Date(f.timestamp)
      }));
      setFeedbackData(processedFeedback);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSessions = feedbackData.length;
  const resolvedSessions = feedbackData.filter(f => f.wasSolved).length;
  const unsolvedSessions = feedbackData.filter(f => !f.wasSolved);
  const effectivenessRate = totalSessions > 0 ? Math.round((resolvedSessions / totalSessions) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold">AI Effectiveness Dashboard</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{effectivenessRate}%</div>
                <div className="text-sm text-slate-600">Overall Effectiveness</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
                <div className="text-sm text-slate-600">Total Sessions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{unsolvedSessions.length}</div>
                <div className="text-sm text-slate-600">Needs Improvement</div>
              </CardContent>
            </Card>
          </div>

          {/* Unsolved Issues */}
          {unsolvedSessions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ThumbsDown className="h-5 w-5 text-red-600" />
                Issues That Need Attention ({unsolvedSessions.length})
              </h3>
              <div className="space-y-3">
                {unsolvedSessions.map((feedback) => (
                  <Card 
                    key={feedback.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedFeedback(feedback)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="destructive">Unsolved</Badge>
                            <span className="text-xs text-slate-500">
                              {feedback.timestamp.toLocaleDateString()} at {feedback.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm text-slate-700 mb-2">
                            <strong>Suggestions:</strong> {feedback.suggestions}
                          </div>
                          <div className="text-xs text-slate-500">
                            Click to view full conversation
                          </div>
                        </div>
                        <MessageSquare className="h-4 w-4 text-slate-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Sessions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">All Sessions</h3>
            <div className="space-y-2">
              {feedbackData.map((feedback) => (
                <div 
                  key={feedback.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100"
                  onClick={() => setSelectedFeedback(feedback)}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={feedback.wasSolved ? "default" : "destructive"}>
                      {feedback.wasSolved ? "Resolved" : "Unsolved"}
                    </Badge>
                    <span className="text-sm text-slate-600">
                      {feedback.timestamp.toLocaleDateString()} at {feedback.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Feedback Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Conversation Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFeedback(null)}>
                <X size={20} />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedFeedback.wasSolved ? "default" : "destructive"}>
                    {selectedFeedback.wasSolved ? "Resolved" : "Unsolved"}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    {selectedFeedback.timestamp.toLocaleDateString()} at {selectedFeedback.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                {selectedFeedback.suggestions && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <strong className="text-yellow-800">Improvement Suggestions:</strong>
                    <p className="text-yellow-700 mt-1">{selectedFeedback.suggestions}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Full Conversation:</h4>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-slate-700">
                      {selectedFeedback.conversationSummary}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIEffectivenessModal;
