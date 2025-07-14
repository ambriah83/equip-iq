# Limble CMMS Integration Guide

**Integration Status**: ✅ API tested, 348 assets retrieved successfully, 20,055+ work orders available

## 🔌 API Connection

### Authentication
```javascript
// Environment Variables Required
LIMBLE_API_KEY=your_api_key_here
LIMBLE_BASE_URL=https://api.limble.com/v1
```

### Base Configuration
```javascript
const limbleConfig = {
  baseURL: 'https://api.limble.com/v1',
  headers: {
    'Authorization': `Bearer ${LIMBLE_API_KEY}`,
    'Content-Type': 'application/json'
  }
};
```

## 📊 Available Data

### Assets (1,168 total)
**Endpoint**: `GET /assets`
**Response includes**:
- Asset ID and name
- Equipment type and model
- Location hierarchy
- Serial numbers
- Purchase dates
- Warranty information
- Current status
- Maintenance history

### Work Orders (20,055 total)  
**Endpoint**: `GET /work-orders`
**Response includes**:
- Work order ID and description
- Asset association
- Priority level (Low/Medium/High/Urgent)
- Status (Open/In Progress/Resolved/Closed)
- Created/due/completed dates
- Assigned technician
- Time estimates vs. actual
- Resolution notes
- Parts used
- Cost breakdown

### Parts Inventory (940 total)
**Endpoint**: `GET /parts`
**Response includes**:
- Part ID and name
- Part numbers
- Current quantities
- Min/Max stock levels
- Cost information
- Supplier details
- Compatible equipment

### Locations (38 active)
**Endpoint**: `GET /locations`
**Response includes**:
- Location hierarchy (State > City > Building > Room)
- Location codes and names
- Manager assignments
- Contact information
- Operating status

### Users
**Endpoint**: `GET /users`
**Response includes**:
- User roles and permissions
- Contact information
- Location assignments
- Skill sets/certifications

## 🗂️ Data Structure Examples

### Asset Record
```json
{
  "id": "asset_12345",
  "name": "Norvell Auto Rev #27 MK",
  "type": "Tanning Equipment",
  "model": "Auto Rev Pro",
  "serial_number": "NRV-2023-0127",
  "location": {
    "building": "McKinney Location",
    "room": "Tanning Room 5",
    "position": "Bay A"
  },
  "status": "Active",
  "purchase_date": "2023-03-15",
  "warranty_expires": "2025-03-15",
  "maintenance_cost_total": "$2,847",
  "last_service_date": "2024-07-01"
}
```

### Work Order Record
```json
{
  "id": "wo_67890",
  "asset_id": "asset_12345", 
  "title": "Tanning bed won't start",
  "description": "Customer reported bed #27 not responding to start button. No error codes visible.",
  "priority": "High",
  "status": "Open",
  "created_date": "2024-07-13T09:30:00Z",
  "due_date": "2024-07-13T17:00:00Z",
  "assigned_to": "John Tech",
  "estimated_time": 60,
  "category": "Electrical",
  "location": "McKinney - Room 5"
}
```

### Parts Usage
```json
{
  "part_id": "part_456",
  "name": "UV Bulb - 100W",
  "part_number": "UV-100-STD",
  "quantity_used": 4,
  "cost_per_unit": "$23.50",
  "supplier": "Tanning Supply Co",
  "compatible_equipment": ["Norvell Auto Rev", "Skin Wellness Pro"]
}
```

## 🔄 Integration Patterns

### 1. **Real-time Data Sync**
```javascript
// Sync new work orders every 5 minutes
const syncWorkOrders = async () => {
  const lastSync = await getLastSyncTime();
  const newOrders = await limbleAPI.get(`/work-orders?created_after=${lastSync}`);
  
  for (const order of newOrders) {
    await processWorkOrder(order);
    await updateAIKnowledge(order);
  }
};
```

### 2. **Asset Lookup for AI**
```javascript
// When user mentions equipment, lookup asset details
const getAssetContext = async (equipmentMention) => {
  const searchQuery = parseEquipmentName(equipmentMention);
  const asset = await limbleAPI.get(`/assets/search?query=${searchQuery}`);
  
  return {
    asset_id: asset.id,
    full_name: asset.name,
    location: asset.location,
    recent_issues: await getRecentWorkOrders(asset.id),
    maintenance_history: asset.maintenance_summary
  };
};
```

### 3. **Auto-Ticket Creation**
```javascript
// When AI chat identifies need for technician
const createLimbleTicket = async (chatContext) => {
  const workOrder = {
    asset_id: chatContext.asset_id,
    title: chatContext.issue_summary,
    description: chatContext.conversation_history,
    priority: determinePriority(chatContext.issue_type),
    requested_by: chatContext.user_info,
    location: chatContext.location,
    category: classifyIssue(chatContext.issue_description)
  };
  
  const response = await limbleAPI.post('/work-orders', workOrder);
  return response.data.id; // Return work order ID for tracking
};
```

## 🧠 AI Training Data Extraction

### Historical Pattern Analysis
```javascript
// Extract common issue patterns for AI training
const analyzeWorkOrderPatterns = async () => {
  const workOrders = await limbleAPI.get('/work-orders?limit=20000');
  
  const patterns = {
    equipment_issues: groupBy(workOrders, 'asset_type'),
    resolution_times: calculateAverageResolution(workOrders),
    common_solutions: extractSolutionPatterns(workOrders),
    escalation_triggers: identifyEscalationPatterns(workOrders)
  };
  
  return patterns;
};
```

### Equipment Knowledge Base
```javascript
// Build equipment-specific knowledge from work orders
const buildEquipmentKnowledge = async (asset_id) => {
  const workOrders = await limbleAPI.get(`/work-orders?asset_id=${asset_id}`);
  
  return {
    common_issues: extractIssueFrequency(workOrders),
    typical_solutions: extractSolutions(workOrders),
    parts_commonly_replaced: extractPartsUsage(workOrders),
    average_repair_time: calculateRepairTimes(workOrders),
    seasonal_patterns: analyzeSeasonalTrends(workOrders)
  };
};
```

## ⚡ Performance Optimization

### Caching Strategy
```javascript
// Cache frequently accessed data
const cacheStrategy = {
  assets: '1 hour', // Asset info changes rarely
  work_orders_active: '5 minutes', // Active work orders change frequently  
  work_orders_historical: '24 hours', // Historical data for AI training
  parts_inventory: '30 minutes', // Inventory levels change regularly
  locations: '12 hours', // Location info stable
};
```

### Batch Operations
```javascript
// Batch multiple API calls for efficiency
const batchAssetLookup = async (assetIds) => {
  const chunks = chunkArray(assetIds, 50); // Limble API limit
  const results = await Promise.all(
    chunks.map(chunk => 
      limbleAPI.get(`/assets?ids=${chunk.join(',')}`)
    )
  );
  return results.flat();
};
```

## 🔍 Search & Filtering

### Equipment Search
```javascript
// Smart equipment search for AI context
const searchEquipment = async (userInput) => {
  // Extract equipment identifiers from user input
  const searchTerms = extractEquipmentTerms(userInput);
  
  const searchParams = {
    name: searchTerms.name,
    location: searchTerms.location,
    type: searchTerms.type,
    status: 'Active'
  };
  
  return await limbleAPI.get('/assets/search', { params: searchParams });
};
```

### Work Order Filters
```javascript
// Filter work orders for AI training and context
const getRelevantWorkOrders = async (asset_id, issue_type) => {
  const filters = {
    asset_id: asset_id,
    status: ['Closed'], // Only completed work orders for training
    category: issue_type,
    created_after: '2023-01-01', // Recent data only
    limit: 100
  };
  
  return await limbleAPI.get('/work-orders', { params: filters });
};
```

## 🚨 Error Handling

### API Rate Limits
```javascript
// Handle Limble API rate limits gracefully
const limbleAPIWithRetry = async (endpoint, options, retries = 3) => {
  try {
    return await limbleAPI(endpoint, options);
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      const waitTime = error.headers['retry-after'] * 1000;
      await sleep(waitTime);
      return limbleAPIWithRetry(endpoint, options, retries - 1);
    }
    throw error;
  }
};
```

### Data Validation
```javascript
// Validate Limble data before processing
const validateWorkOrder = (workOrder) => {
  const required = ['id', 'asset_id', 'title', 'status'];
  const missing = required.filter(field => !workOrder[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  return true;
};
```

## 📈 Monitoring & Analytics

### Sync Health Monitoring
```javascript
// Monitor Limble integration health
const monitorSyncHealth = () => {
  return {
    last_successful_sync: getLastSyncTime(),
    failed_requests_24h: getFailedRequestCount(),
    api_response_times: getAverageResponseTime(),
    data_freshness: calculateDataFreshness(),
    sync_errors: getRecentSyncErrors()
  };
};
```

---

**Note**: This integration leverages Glo Tanning's existing Limble CMMS data (20,055+ work orders) to train the AI and provide equipment-aware responses. The focus is on augmenting Limble with intelligent chat capabilities, not replacing existing workflows.
