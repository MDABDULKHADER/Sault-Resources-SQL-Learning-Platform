
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Play, Database, BookOpen, Table } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface QueryResult {
  success: boolean;
  results?: any[];
  rowCount?: number;
  error?: string;
}

interface SampleQuery {
  title: string;
  query: string;
  description: string;
}

interface SchemaInfo {
  [tableName: string]: Array<{
    Field: string;
    Type: string;
    Null: string;
    Key: string;
    Default: any;
    Extra: string;
  }>;
}

const SQLEditor: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM employees LIMIT 10;');
  const [results, setResults] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState<SchemaInfo>({});
  const [sampleQueries, setSampleQueries] = useState<SampleQuery[]>([]);
  const { toast } = useToast();

  const API_URL = 'http://localhost:5001/api/practice';

  useEffect(() => {
    fetchSchema();
    fetchSampleQueries();
  }, []);

  const fetchSchema = async () => {
    try {
      const response = await fetch(`${API_URL}/schema`);
      const data = await response.json();
      if (data.success) {
        setSchema(data.schema);
      }
    } catch (error) {
      console.error('Error fetching schema:', error);
    }
  };

  const fetchSampleQueries = async () => {
    try {
      const response = await fetch(`${API_URL}/sample-queries`);
      const data = await response.json();
      if (data.success) {
        setSampleQueries(data.queries);
      }
    } catch (error) {
      console.error('Error fetching sample queries:', error);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a SQL query",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResults(data);

      if (data.success) {
        toast({
          title: "Success",
          description: `Query executed successfully. ${data.rowCount} row(s) returned.`,
        });
      } else {
        toast({
          title: "Query Error",
          description: data.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error executing query:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to practice server. Make sure server2.js is running.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSampleQuery = (sampleQuery: SampleQuery) => {
    setQuery(sampleQuery.query);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">SQL Live Practice Editor</h1>
        <p className="text-muted-foreground">
          Practice SQL queries on a dummy database with real-time execution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Editor and Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Query Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                SQL Query Editor
              </CardTitle>
              <CardDescription>
                Write and execute SQL queries. Only SELECT, SHOW, DESCRIBE, and EXPLAIN queries are allowed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                  placeholder="Enter your SQL query here..."
                />
                <Button 
                  onClick={executeQuery} 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {loading ? 'Executing...' : 'Execute Query'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Query Results</CardTitle>
              </CardHeader>
              <CardContent>
                {results.success ? (
                  <div>
                    <div className="mb-4">
                      <Badge variant="outline">
                        {results.rowCount} row(s) returned
                      </Badge>
                    </div>
                    <ScrollArea className="h-96 w-full border rounded">
                      {results.results && results.results.length > 0 ? (
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              {Object.keys(results.results[0]).map((column) => (
                                <th key={column} className="p-2 text-left font-medium">
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {results.results.map((row, index) => (
                              <tr key={index} className="border-b">
                                {Object.values(row).map((value, cellIndex) => (
                                  <td key={cellIndex} className="p-2">
                                    {value !== null ? String(value) : 'NULL'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="p-4 text-muted-foreground">No results to display</p>
                      )}
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="text-red-600 bg-red-50 p-4 rounded">
                    <strong>Error:</strong> {results.error}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Schema and Examples */}
        <div className="space-y-6">
          <Tabs defaultValue="schema" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schema">
                <Table className="h-4 w-4 mr-2" />
                Schema
              </TabsTrigger>
              <TabsTrigger value="examples">
                <BookOpen className="h-4 w-4 mr-2" />
                Examples
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schema">
              <Card>
                <CardHeader>
                  <CardTitle>Database Schema</CardTitle>
                  <CardDescription>
                    Available tables and their structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {Object.entries(schema).map(([tableName, columns]) => (
                      <div key={tableName} className="mb-4">
                        <h4 className="font-semibold text-sm mb-2 bg-muted p-2 rounded">
                          {tableName}
                        </h4>
                        <div className="space-y-1 text-xs">
                          {columns.map((column) => (
                            <div key={column.Field} className="flex justify-between p-1">
                              <span className="font-mono">{column.Field}</span>
                              <span className="text-muted-foreground">{column.Type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples">
              <Card>
                <CardHeader>
                  <CardTitle>Sample Queries</CardTitle>
                  <CardDescription>
                    Click on any example to load it in the editor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {sampleQueries.map((sample, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => loadSampleQuery(sample)}
                        >
                          <h5 className="font-medium text-sm mb-1">{sample.title}</h5>
                          <p className="text-xs text-muted-foreground mb-2">
                            {sample.description}
                          </p>
                          <code className="text-xs bg-muted p-1 rounded block">
                            {sample.query}
                          </code>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SQLEditor;
