export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: 'Water Supply' | 'Road Infrastructure' | 'Waste Management' | 'Electricity' | 'Public Safety' | 'Drainage';
  location: string;
  coordinates: { lat: number; lng: number };
  department: string;
  severity: number; // 1-10
  urgency: number; // 1-10
  impact: number; // 1-10
  vulnerability: number; // 1-10
  priorityScore: number; // 1-100
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'AI Prioritized' | 'Assigned' | 'Pending' | 'Escalation Required' | 'In Progress' | 'Resolved';
  similarity?: number;
  relatedCount: number;
  recommendedAction: string;
  slaHours: number;
  timeRemainingHours: number;
  createdAt: string;
  citizenName?: string;
  citizenContact?: string;
  isSystemicCluster?: boolean;
  clusterId?: string;
}

export interface SystemicIssue {
  id: string;
  title: string;
  category: string;
  locality: string;
  complaintCount: number;
  growthPercentage: number;
  affectedLocationsCount: number;
  confidenceScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  summary: string;
  assessment: string;
  recommendedAction: string;
  assignedDepartment: string;
  suggestedSLA: string;
}

export interface GeoCluster {
  id: string;
  name: string;
  category: string;
  count: number;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  lat: number;
  lng: number;
  aiInsight: string;
}

export const MOCK_GRIEVANCES: Grievance[] = [
  {
    id: 'GRV-1042',
    title: 'No water supply for 5 consecutive days in Madhapur',
    description: 'There has been no water supply in our locality for five days. My mother is 78 years old and we are struggling to get drinking water.',
    category: 'Water Supply',
    location: 'Madhapur, Sector 3, Hyderabad',
    coordinates: { lat: 17.4486, lng: 78.3908 },
    department: 'Water Supply & Sewerage Board',
    severity: 8,
    urgency: 10,
    impact: 8,
    vulnerability: 10,
    priorityScore: 97,
    priority: 'CRITICAL',
    status: 'Escalation Required',
    similarity: 94,
    relatedCount: 12,
    recommendedAction: 'Immediate escalation to local Water Supply Officer and field inspection within 24h SLA.',
    slaHours: 24,
    timeRemainingHours: 14,
    createdAt: '2 hours ago',
    citizenName: 'Sunita Sharma',
    citizenContact: '+91 98765 43210',
    isSystemicCluster: true,
    clusterId: 'SYS-WATER-01'
  },
  {
    id: 'GRV-1039',
    title: 'Major road sinkhole near Primary School',
    description: 'A deep sinkhole has developed near St. Marks School entrance following yesterday rains. High accident risk for children.',
    category: 'Road Infrastructure',
    location: 'Kukatpally Housing Board, Phase 2',
    coordinates: { lat: 17.4947, lng: 78.3996 },
    department: 'GHMC Engineering Dept',
    severity: 9,
    urgency: 9,
    impact: 9,
    vulnerability: 9,
    priorityScore: 94,
    priority: 'CRITICAL',
    status: 'Assigned',
    similarity: 88,
    relatedCount: 7,
    recommendedAction: 'Deploy immediate emergency barricading and road repair crew.',
    slaHours: 12,
    timeRemainingHours: 4,
    createdAt: '3 hours ago',
    citizenName: 'Rajesh Varma',
    citizenContact: '+91 99887 66554',
    isSystemicCluster: true,
    clusterId: 'SYS-ROADS-02'
  },
  {
    id: 'GRV-1035',
    title: 'Garbage dumping site uncollected for 4 days',
    description: 'Massive foul smell and stray animals accumulating around overflowed community dumpster. Health hazard for nearby residents.',
    category: 'Waste Management',
    location: 'Banjara Hills, Road No. 12',
    coordinates: { lat: 17.4156, lng: 78.4347 },
    department: 'Sanitation & Solid Waste',
    severity: 7,
    urgency: 8,
    impact: 8,
    vulnerability: 7,
    priorityScore: 82,
    priority: 'HIGH',
    status: 'Pending',
    similarity: 82,
    relatedCount: 5,
    recommendedAction: 'Reroute secondary waste compactor truck for evening clearance.',
    slaHours: 24,
    timeRemainingHours: 11,
    createdAt: '5 hours ago',
    citizenName: 'Ananth Kumar',
    citizenContact: '+91 97112 33445'
  },
  {
    id: 'GRV-1031',
    title: 'Frequent high voltage fluctuation & power outages',
    description: 'Transformer spark observed yesterday. Power trips every 20 minutes causing damage to home appliances.',
    category: 'Electricity',
    location: 'Gachibowli, Financial District',
    coordinates: { lat: 17.4401, lng: 78.3489 },
    department: 'TSSPDCL Power Board',
    severity: 7,
    urgency: 8,
    impact: 7,
    vulnerability: 6,
    priorityScore: 79,
    priority: 'HIGH',
    status: 'Assigned',
    similarity: 75,
    relatedCount: 4,
    recommendedAction: 'Inspect Substation transformer T-42 load balancing.',
    slaHours: 24,
    timeRemainingHours: 18,
    createdAt: '6 hours ago',
    citizenName: 'Priya Reddy',
    citizenContact: '+91 91234 56789'
  },
  {
    id: 'GRV-1028',
    title: 'Open storm drain overflowing onto pedestrian footpath',
    description: 'Black sewage water leaking out onto sidewalk near metro pillar 45. Risk of disease outbreak.',
    category: 'Drainage',
    location: 'Hitec City, Mindspace Junction',
    coordinates: { lat: 17.4435, lng: 78.3772 },
    department: 'Water Supply & Sewerage Board',
    severity: 8,
    urgency: 7,
    impact: 8,
    vulnerability: 6,
    priorityScore: 76,
    priority: 'HIGH',
    status: 'In Progress',
    similarity: 91,
    relatedCount: 9,
    recommendedAction: 'Deploy desilting jetting machine to clear drain blockage.',
    slaHours: 36,
    timeRemainingHours: 22,
    createdAt: '8 hours ago',
    citizenName: 'Vikram Mehta',
    citizenContact: '+91 98490 12345',
    isSystemicCluster: true
  },
  {
    id: 'GRV-1022',
    title: 'Streetlights non-functional on main arterial road',
    description: 'Dark stretch of 800m on Outer Ring Road access line. Creates safety hazard for women commuters at night.',
    category: 'Public Safety',
    location: 'Jubilee Hills, Road No. 36',
    coordinates: { lat: 17.4319, lng: 78.4073 },
    department: 'Electrical Works Dept',
    severity: 6,
    urgency: 7,
    impact: 7,
    vulnerability: 8,
    priorityScore: 71,
    priority: 'HIGH',
    status: 'Pending',
    similarity: 68,
    relatedCount: 3,
    recommendedAction: 'Replace blown fuse on Feeder Pillar 12.',
    slaHours: 48,
    timeRemainingHours: 30,
    createdAt: '12 hours ago',
    citizenName: 'Sneha Rao',
    citizenContact: '+91 93456 78901'
  },
  {
    id: 'GRV-1015',
    title: 'Pothole patch work required near bus stop',
    description: 'Two small potholes causing traffic slowdown during morning peak hours.',
    category: 'Road Infrastructure',
    location: 'Kondapur, Main Signal',
    coordinates: { lat: 17.4646, lng: 78.3622 },
    department: 'GHMC Engineering Dept',
    severity: 4,
    urgency: 5,
    impact: 5,
    vulnerability: 3,
    priorityScore: 48,
    priority: 'MEDIUM',
    status: 'Pending',
    similarity: 40,
    relatedCount: 1,
    recommendedAction: 'Schedule cold-mix asphalt patch during routine maintenance.',
    slaHours: 72,
    timeRemainingHours: 54,
    createdAt: '1 day ago',
    citizenName: 'Mohd Irfan',
    citizenContact: '+91 95500 11223'
  },
  {
    id: 'GRV-1008',
    title: 'Low water pressure on upper floors',
    description: 'Water pressure dropped slightly since yesterday evening.',
    category: 'Water Supply',
    location: 'Madhapur, Sector 1',
    coordinates: { lat: 17.4520, lng: 78.3880 },
    department: 'Water Supply & Sewerage Board',
    severity: 3,
    urgency: 4,
    impact: 4,
    vulnerability: 3,
    priorityScore: 35,
    priority: 'LOW',
    status: 'Resolved',
    similarity: 85,
    relatedCount: 6,
    recommendedAction: 'Adjust valve pressure at local booster pump station.',
    slaHours: 96,
    timeRemainingHours: 0,
    createdAt: '2 days ago',
    citizenName: 'Kavita Joshi',
    citizenContact: '+91 96677 88990'
  }
];

export const MOCK_SYSTEMIC_ISSUES: SystemicIssue[] = [
  {
    id: 'SYS-WATER-01',
    title: 'Major Water Supply Disruption',
    category: 'Water Supply',
    locality: 'Madhapur & Surrounding Sectors',
    complaintCount: 47,
    growthPercentage: 143,
    affectedLocationsCount: 6,
    confidenceScore: 94,
    riskLevel: 'CRITICAL',
    summary: 'AI detected a 143% surge in drinking water scarcity complaints across 6 adjacent sectors in Madhapur over 48 hours.',
    assessment: 'Likely main feeder pipe rupture or unannounced pump station failure affecting ~15,000 households.',
    recommendedAction: 'Declare centralized incident, dispatch emergency water tankers to vulnerable zones, and send pipeline repair team to Sector 3 pumping station.',
    assignedDepartment: 'Water Supply & Sewerage Board',
    suggestedSLA: '12 Hours'
  },
  {
    id: 'SYS-ROADS-02',
    title: 'Monsoon Road Damage & Cave-in Cluster',
    category: 'Road Infrastructure',
    locality: 'Kukatpally - Miyapur Corridor',
    complaintCount: 31,
    growthPercentage: 76,
    affectedLocationsCount: 4,
    confidenceScore: 89,
    riskLevel: 'HIGH',
    summary: 'Multiple grievances report deep potholes and asphalt erosion along high-density school and transit routes.',
    assessment: 'Sub-base water logging following heavy rainfall causing rapid asphalt disintegration.',
    recommendedAction: 'Deploy emergency cold-patching units and initiate temporary traffic diversions.',
    assignedDepartment: 'GHMC Road Maintenance Division',
    suggestedSLA: '24 Hours'
  },
  {
    id: 'SYS-WASTE-03',
    title: 'Solid Waste Collection Bottleneck',
    category: 'Waste Management',
    locality: 'Banjara Hills & Jubilee Hills Border',
    complaintCount: 24,
    growthPercentage: 51,
    affectedLocationsCount: 3,
    confidenceScore: 85,
    riskLevel: 'MEDIUM',
    summary: 'Overflowing dumpsters and uncollected bio-waste reported across 3 residential wards.',
    assessment: 'Contractor vehicle breakdown at Transfer Station 4 leading to route delays.',
    recommendedAction: 'Reassign standby sanitation vehicles from Zone B to clear accumulated backlogs.',
    assignedDepartment: 'Sanitation & Solid Waste Management',
    suggestedSLA: '36 Hours'
  },
  {
    id: 'SYS-ELEC-04',
    title: 'Feeder Transformer Overload Grid Fault',
    category: 'Electricity',
    locality: 'Gachibowli Tech Zone',
    complaintCount: 18,
    growthPercentage: 35,
    affectedLocationsCount: 2,
    confidenceScore: 91,
    riskLevel: 'MEDIUM',
    summary: 'Repeated micro-outages and voltage drops reported during peak office and residential hours.',
    assessment: 'Transformer T-42 running at 118% rated capacity; high risk of trip failure.',
    recommendedAction: 'Balance load to auxiliary Transformer T-43 and inspect thermal cooling oil.',
    assignedDepartment: 'TSSPDCL Power Grid Operations',
    suggestedSLA: '24 Hours'
  }
];

export const MOCK_GEO_CLUSTERS: GeoCluster[] = [
  {
    id: 'GEO-01',
    name: 'Madhapur Sector 3 Cluster',
    category: 'Water Supply',
    count: 47,
    risk: 'CRITICAL',
    lat: 17.4486,
    lng: 78.3908,
    aiInsight: 'Potential main trunk pipeline leak affecting 6 nearby sub-sectors.'
  },
  {
    id: 'GEO-02',
    name: 'Kukatpally School Zone',
    category: 'Road Infrastructure',
    count: 31,
    risk: 'HIGH',
    lat: 17.4947,
    lng: 78.3996,
    aiInsight: 'Severe sinkhole & asphalt degradation creating school commute hazard.'
  },
  {
    id: 'GEO-03',
    name: 'Banjara Hills Ward 12',
    category: 'Waste Management',
    count: 24,
    risk: 'MEDIUM',
    lat: 17.4156,
    lng: 78.4347,
    aiInsight: 'Collection delay causing sanitation risk in high-density zone.'
  },
  {
    id: 'GEO-04',
    name: 'Gachibowli Financial Hub',
    category: 'Electricity',
    count: 18,
    risk: 'MEDIUM',
    lat: 17.4401,
    lng: 78.3489,
    aiInsight: 'Feeder transformer overload warning.'
  },
  {
    id: 'GEO-05',
    name: 'Mindspace Junction',
    category: 'Drainage',
    count: 14,
    risk: 'HIGH',
    lat: 17.4435,
    lng: 78.3772,
    aiInsight: 'Stormwater drain blockage near commercial transit hub.'
  }
];

export const MOCK_DAILY_TRENDS = [
  { day: 'Mon', water: 12, roads: 15, sanitation: 10, electricity: 8 },
  { day: 'Tue', water: 15, roads: 14, sanitation: 12, electricity: 9 },
  { day: 'Wed', water: 22, roads: 18, sanitation: 14, electricity: 11 },
  { day: 'Thu', water: 28, roads: 19, sanitation: 16, electricity: 12 },
  { day: 'Fri', water: 34, roads: 22, sanitation: 18, electricity: 14 },
  { day: 'Sat', water: 41, roads: 25, sanitation: 20, electricity: 15 },
  { day: 'Sun', dayFull: 'Today', water: 47, roads: 31, sanitation: 24, electricity: 18 }
];

export const MOCK_CATEGORY_DISTRIBUTION = [
  { name: 'Water Supply', value: 47, color: '#3b82f6' },
  { name: 'Road Infrastructure', value: 31, color: '#f97316' },
  { name: 'Waste Management', value: 24, color: '#eab308' },
  { name: 'Electricity', value: 18, color: '#a855f7' },
  { name: 'Drainage & Sewage', value: 14, color: '#06b6d4' },
  { name: 'Public Safety', value: 10, color: '#10b981' }
];

export const MOCK_KPI_DATA = {
  totalGrievances: 1248,
  totalGrowth: '+18.4% vs previous week',
  criticalCount: 37,
  highCount: 164,
  duplicatesCount: 86,
  systemicCount: 12
};
