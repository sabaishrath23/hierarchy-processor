import React, { useState } from 'react';
import { Loader2, GitBranch, AlertCircle, Info } from 'lucide-react';
import TreeView from './components/TreeView';
import ResultsCard from './components/ResultsCard';

function App() {
  const [input, setInput] = useState('[\n  "A->B",\n  "A->C",\n  "B->D"\n]');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    let parsedData = [];
    try {
      // Try parsing as JSON first
      parsedData = JSON.parse(input);
      if (!Array.isArray(parsedData)) {
        throw new Error("Input must be a JSON array of strings.");
      }
    } catch (e) {
      // Fallback: parse line by line
      parsedData = input.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        // Clean up quotes or commas if they exist
        .map(line => line.replace(/^"|",?$|',?$/g, ''));
    }

    try {
      const response = await fetch('http://localhost:5000/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: parsedData }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Hierarchy Processor</h1>
        <p className="subtitle">Process hierarchical node relationships and generate structural insights.</p>
      </header>

      <main>
        <section className="input-section">
          <label htmlFor="nodes-input">Enter Node Relationships (JSON Array or line-by-line)</label>
          <textarea
            id="nodes-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='["A->B", "A->C"]'
          />
          <button 
            className="btn-submit" 
            onClick={handleSubmit} 
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 className="spinner" size={16} /> : <GitBranch size={16} />}
            Process Hierarchy
          </button>
        </section>

        {error && (
          <div className="error-message">
            <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            {error}
          </div>
        )}

        {results && (
          <section className="results-section">
            <div className="card summary-card">
              <h2><Info size={18} /> Summary Statistics</h2>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Total Trees</span>
                  <span className="summary-value">{results.summary.total_trees}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Cycles</span>
                  <span className="summary-value">{results.summary.total_cycles}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Largest Tree Root</span>
                  <span className="summary-value">{results.summary.largest_tree_root || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2><GitBranch size={18} /> Visualized Hierarchies</h2>
              {results.hierarchies.length === 0 ? (
                <p className="subtitle" style={{marginBottom: 0}}>No valid hierarchies found.</p>
              ) : (
                <div className="hierarchies-list" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  {results.hierarchies.map((hierarchy, index) => (
                    <div key={index} className="tree-container">
                      {hierarchy.has_cycle ? (
                        <div className="cycle-warning">
                          <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          Cycle Detected (Tree disabled)
                        </div>
                      ) : (
                        <TreeView data={hierarchy} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(results.invalid_entries.length > 0 || results.duplicate_edges.length > 0) && (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
                {results.invalid_entries.length > 0 && (
                  <ResultsCard 
                    title="Invalid Entries" 
                    items={results.invalid_entries} 
                    type="invalid" 
                  />
                )}
                {results.duplicate_edges.length > 0 && (
                  <ResultsCard 
                    title="Duplicate Edges" 
                    items={results.duplicate_edges} 
                    type="duplicate" 
                  />
                )}
              </div>
            )}
            
            <div className="card">
                <h2>User Details</h2>
                <div className="summary-grid">
                    <div className="summary-item">
                        <span className="summary-label">User ID</span>
                        <span className="summary-value" style={{fontSize: '16px'}}>{results.user_id}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Email</span>
                        <span className="summary-value" style={{fontSize: '16px'}}>{results.email_id}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Roll Number</span>
                        <span className="summary-value" style={{fontSize: '16px'}}>{results.college_roll_number}</span>
                    </div>
                </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
