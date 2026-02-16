// AI-powered utilities for problem scoring and duplicate detection
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

export interface AIScore {
  severityScore: number; // 1-10 (1=minor, 10=critical)
  priorityLevel: 'low' | 'medium' | 'high' | 'critical';
  confidenceScore: number; // 0-1
  riskFactors: string[];
  estimatedUrgency: number; // hours until action needed
}

export interface DuplicateCheck {
  isDuplicate: boolean;
  similarityScore: number; // 0-1
  similarReports: Array<{
    id: string;
    location: string;
    similarityScore: number;
    createdAt: string;
  }>;
}

// AI-powered severity scoring based on image analysis and description
export const calculateAIScore = async (
  imageUrl: string | null,
  description: string,
  problemType: string,
  location: string
): Promise<AIScore> => {
  let severityScore = 5; // Default medium severity
  let confidenceScore = 0.7; // Default confidence
  const riskFactors: string[] = [];
  
  // Analyze description for severity indicators
  const descriptionLower = description.toLowerCase();
  
  // Critical keywords that increase severity
  const criticalKeywords = [
    'emergency', 'urgent', 'dangerous', 'hazardous', 'blocking', 'flooding',
    'collapsed', 'broken', 'severe', 'critical', 'immediate', 'accident',
    'injury', 'traffic', 'blocked', 'flooded', 'deep', 'large'
  ];
  
  // Medium severity keywords
  const mediumKeywords = [
    'moderate', 'medium', 'noticeable', 'concerning', 'problem', 'issue',
    'damage', 'cracked', 'uneven', 'rough', 'bumpy'
  ];
  
  // Low severity keywords
  const lowKeywords = [
    'minor', 'small', 'slight', 'beginning', 'early', 'developing',
    'surface', 'cosmetic', 'minor', 'small'
  ];
  
  // Count keyword matches
  const criticalCount = criticalKeywords.filter(keyword => 
    descriptionLower.includes(keyword)
  ).length;
  
  const mediumCount = mediumKeywords.filter(keyword => 
    descriptionLower.includes(keyword)
  ).length;
  
  const lowCount = lowKeywords.filter(keyword => 
    descriptionLower.includes(keyword)
  ).length;
  
  // Adjust severity based on keywords
  if (criticalCount > 0) {
    severityScore = Math.min(10, 7 + criticalCount);
    riskFactors.push('Critical keywords detected');
  } else if (mediumCount > 0) {
    severityScore = Math.min(8, 5 + mediumCount);
  } else if (lowCount > 0) {
    severityScore = Math.max(1, 3 - lowCount);
  }
  
  // Problem type specific scoring
  switch (problemType) {
    case 'pothole':
      // Potholes are generally more dangerous
      severityScore = Math.min(10, severityScore + 1);
      riskFactors.push('Pothole - vehicle damage risk');
      break;
    case 'drainage':
      // Drainage issues can cause flooding
      severityScore = Math.min(10, severityScore + 1);
      riskFactors.push('Drainage - flooding risk');
      break;
    case 'construction':
      // Construction issues can be safety hazards
      severityScore = Math.min(10, severityScore + 1);
      riskFactors.push('Construction - safety hazard');
      break;
    case 'garbage':
      // Garbage is generally lower priority
      severityScore = Math.max(1, severityScore - 1);
      break;
  }
  
  // Location-based risk assessment
  const locationLower = location.toLowerCase();
  if (locationLower.includes('highway') || locationLower.includes('main road')) {
    severityScore = Math.min(10, severityScore + 2);
    riskFactors.push('Main road - high traffic impact');
  } else if (locationLower.includes('school') || locationLower.includes('hospital')) {
    severityScore = Math.min(10, severityScore + 2);
    riskFactors.push('Sensitive area - school/hospital nearby');
  } else if (locationLower.includes('residential')) {
    severityScore = Math.max(1, severityScore - 1);
  }
  
  // Image analysis simulation (in real implementation, you'd use actual CV)
  if (imageUrl) {
    // Simulate image analysis
    const hasImage = true;
    confidenceScore = 0.8; // Higher confidence with image
    
    // Simulate image-based severity detection
    // In real implementation, you'd analyze the image for:
    // - Size of the problem
    // - Depth of potholes
    // - Amount of garbage
    // - Water accumulation
    // - Structural damage
    
    // For now, we'll simulate based on description length (more detailed = more severe)
    if (description.length > 100) {
      severityScore = Math.min(10, severityScore + 1);
    }
  } else {
    confidenceScore = 0.6; // Lower confidence without image
    riskFactors.push('No image provided - reduced confidence');
  }
  
  // Determine priority level
  let priorityLevel: 'low' | 'medium' | 'high' | 'critical';
  if (severityScore >= 8) {
    priorityLevel = 'critical';
  } else if (severityScore >= 6) {
    priorityLevel = 'high';
  } else if (severityScore >= 4) {
    priorityLevel = 'medium';
  } else {
    priorityLevel = 'low';
  }
  
  // Calculate estimated urgency (hours until action needed)
  let estimatedUrgency: number;
  switch (priorityLevel) {
    case 'critical':
      estimatedUrgency = 2; // 2 hours
      break;
    case 'high':
      estimatedUrgency = 24; // 1 day
      break;
    case 'medium':
      estimatedUrgency = 72; // 3 days
      break;
    case 'low':
      estimatedUrgency = 168; // 1 week
      break;
  }
  
  return {
    severityScore: Math.round(severityScore),
    priorityLevel,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    riskFactors,
    estimatedUrgency
  };
};

// Duplicate detection using location proximity and description similarity
export const checkForDuplicates = async (
  newLocation: string,
  newDescription: string,
  newProblemType: string,
  userId: string
): Promise<DuplicateCheck> => {
  try {
    // Get recent reports (last 30 days) for comparison
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const reportsQuery = query(
      collection(db, 'reports'),
      where('createdAt', '>=', thirtyDaysAgo.toISOString())
    );
    
    const querySnapshot = await getDocs(reportsQuery);
    const existingReports = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    const similarReports: Array<{
      id: string;
      location: string;
      similarityScore: number;
      createdAt: string;
    }> = [];
    
    let maxSimilarity = 0;
    let isDuplicate = false;
    
    for (const report of existingReports) {
      // Skip reports from the same user
      if (report.userId === userId) continue;
      
      // Calculate location similarity (simple string comparison for now)
      const locationSimilarity = calculateLocationSimilarity(newLocation, report.location);
      
      // Calculate description similarity
      const descriptionSimilarity = calculateTextSimilarity(newDescription, report.description);
      
      // Calculate problem type similarity
      const typeSimilarity = newProblemType === report.problemType ? 1 : 0;
      
      // Combined similarity score (weighted)
      const overallSimilarity = (
        locationSimilarity * 0.4 + 
        descriptionSimilarity * 0.4 + 
        typeSimilarity * 0.2
      );
      
      if (overallSimilarity > 0.6) { // 60% similarity threshold
        similarReports.push({
          id: report.id,
          location: report.location,
          similarityScore: Math.round(overallSimilarity * 100) / 100,
          createdAt: report.createdAt
        });
        
        maxSimilarity = Math.max(maxSimilarity, overallSimilarity);
      }
      
      // Mark as duplicate if very high similarity
      if (overallSimilarity > 0.8) {
        isDuplicate = true;
      }
    }
    
    // Sort by similarity score
    similarReports.sort((a, b) => b.similarityScore - a.similarityScore);
    
    return {
      isDuplicate,
      similarityScore: Math.round(maxSimilarity * 100) / 100,
      similarReports: similarReports.slice(0, 5) // Top 5 similar reports
    };
    
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    return {
      isDuplicate: false,
      similarityScore: 0,
      similarReports: []
    };
  }
};

// Calculate location similarity (simplified)
const calculateLocationSimilarity = (location1: string, location2: string): number => {
  const loc1 = location1.toLowerCase().trim();
  const loc2 = location2.toLowerCase().trim();
  
  // Exact match
  if (loc1 === loc2) return 1;
  
  // Check for common words
  const words1 = loc1.split(/[\s,]+/);
  const words2 = loc2.split(/[\s,]+/);
  
  let commonWords = 0;
  for (const word of words1) {
    if (words2.includes(word) && word.length > 2) {
      commonWords++;
    }
  }
  
  const maxWords = Math.max(words1.length, words2.length);
  return commonWords / maxWords;
};

// Calculate text similarity (simplified Jaccard similarity)
const calculateTextSimilarity = (text1: string, text2: string): number => {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// Get AI-powered recommendations for admin
export const getAIRecommendations = (reports: any[]): {
  priorityReports: any[];
  resourceAllocation: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  suggestedActions: string[];
} => {
  // Sort reports by AI score
  const sortedReports = reports
    .filter(report => report.aiScore)
    .sort((a, b) => b.aiScore.severityScore - a.aiScore.severityScore);
  
  const priorityReports = sortedReports.slice(0, 10);
  
  // Calculate resource allocation
  const resourceAllocation = {
    critical: reports.filter(r => r.aiScore?.priorityLevel === 'critical').length,
    high: reports.filter(r => r.aiScore?.priorityLevel === 'high').length,
    medium: reports.filter(r => r.aiScore?.priorityLevel === 'medium').length,
    low: reports.filter(r => r.aiScore?.priorityLevel === 'low').length
  };
  
  // Generate suggested actions
  const suggestedActions: string[] = [];
  
  if (resourceAllocation.critical > 0) {
    suggestedActions.push(`🚨 ${resourceAllocation.critical} critical issues need immediate attention`);
  }
  
  if (resourceAllocation.high > 5) {
    suggestedActions.push(`⚠️ High priority queue is getting long (${resourceAllocation.high} reports)`);
  }
  
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  if (pendingCount > 20) {
    suggestedActions.push(`📊 Consider increasing team capacity (${pendingCount} pending reports)`);
  }
  
  return {
    priorityReports,
    resourceAllocation,
    suggestedActions
  };
};
