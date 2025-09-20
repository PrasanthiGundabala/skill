// Utility to load candidate data from CSV
export const loadCandidatesFromCSV = async (): Promise<any[]> => {
  try {
    const response = await fetch('/candidates_data.csv');
    const csvText = await response.text();
    
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    const candidates = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const candidate: any = {};
      
      headers.forEach((header, i) => {
        let value = values[i] || '';
        
        // Parse specific fields
        if (header === 'Relevance Score') {
          value = parseInt(value) || 0;
        } else if (header === 'Skills') {
          value = value.split(',').map(s => s.trim()).filter(s => s);
        } else if (header === 'Missing Skills') {
          value = value.split(',').map(s => s.trim()).filter(s => s);
        } else if (header === 'Verdict') {
          value = value as 'High' | 'Medium' | 'Low';
        }
        
        candidate[header] = value;
      });
      
      // Add required fields for the application
      return {
        id: index + 1,
        name: candidate.Name,
        email: candidate.Email,
        phone: candidate.Phone,
        location: candidate.Location,
        experience: candidate.Experience,
        jobRole: candidate['Job Role'],
        relevanceScore: candidate['Relevance Score'],
        verdict: candidate.Verdict,
        skills: candidate.Skills,
        appliedDate: candidate['Applied Date'],
        isDuplicate: false,
        missingSkills: candidate['Missing Skills'],
        resumeUrl: `/resumes/${candidate.Name.toLowerCase().replace(/\s+/g, '_')}.pdf`
      };
    });
    
    return candidates;
  } catch (error) {
    console.error('Error loading candidates from CSV:', error);
    return [];
  }
};
